const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { supabase } = require('../config/database');

const TOTP_WINDOW = 1; // Accept codes from 1 window before/after (30 seconds each)
const BACKUP_CODES_COUNT = 10;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

class TOTPService {
  constructor() {
    // Get encryption key from environment variable
    this.encryptionKey = process.env.TOTP_ENCRYPTION_KEY || this.generateEncryptionKey();
    if (!process.env.TOTP_ENCRYPTION_KEY) {
      console.warn('⚠️  TOTP_ENCRYPTION_KEY not set in environment. Using temporary key.');
      console.warn('⚠️  Set TOTP_ENCRYPTION_KEY in .env for production!');
    }
  }

  /**
   * Generate a secure encryption key (32 bytes for AES-256)
   */
  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Encrypt TOTP secret for storage
   */
  encryptSecret(secret) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHM,
      Buffer.from(this.encryptionKey, 'hex'),
      iv
    );

    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Return iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt TOTP secret
   */
  decryptSecret(encryptedData) {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      Buffer.from(this.encryptionKey, 'hex'),
      iv
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Generate a new TOTP secret for a user
   */
  async generateTOTPSecret(userId, username) {
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `Portfolio Admin (${username})`,
        issuer: 'Portfolio Admin Portal',
        length: 32
      });

      // Encrypt secret for storage
      const encryptedSecret = this.encryptSecret(secret.base32);

      // Store encrypted secret in database
      const { error } = await supabase
        .from('admin_users')
        .update({
          totp_secret_encrypted: encryptedSecret,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error storing TOTP secret:', error);
        return { success: false, error: 'Failed to generate TOTP secret' };
      }

      return {
        success: true,
        secret: secret.base32,
        otpauthUrl: secret.otpauth_url
      };
    } catch (error) {
      console.error('Error generating TOTP secret:', error);
      return { success: false, error: 'Failed to generate TOTP secret' };
    }
  }

  /**
   * Generate QR code for TOTP setup
   */
  async generateQRCode(otpauthUrl) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      return { success: true, qrCode: qrCodeDataUrl };
    } catch (error) {
      console.error('Error generating QR code:', error);
      return { success: false, error: 'Failed to generate QR code' };
    }
  }

  /**
   * Verify a TOTP code
   */
  async verifyTOTPCode(userId, code) {
    try {
      // Get user's encrypted TOTP secret
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('totp_secret_encrypted, totp_enabled')
        .eq('id', userId)
        .single();

      if (userError || !user || !user.totp_secret_encrypted) {
        return { success: false, error: 'TOTP not configured for this user' };
      }

      // Decrypt secret
      const secret = this.decryptSecret(user.totp_secret_encrypted);

      // Verify code with time window
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: TOTP_WINDOW
      });

      return { success: verified };
    } catch (error) {
      console.error('Error verifying TOTP code:', error);
      return { success: false, error: 'Failed to verify TOTP code' };
    }
  }

  /**
   * Enable TOTP for a user after successful verification
   */
  async enableTOTP(userId) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          totp_enabled: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error enabling TOTP:', error);
        return { success: false, error: 'Failed to enable TOTP' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error enabling TOTP:', error);
      return { success: false, error: 'Failed to enable TOTP' };
    }
  }

  /**
   * Disable TOTP for a user
   */
  async disableTOTP(userId) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          totp_enabled: false,
          totp_secret_encrypted: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error disabling TOTP:', error);
        return { success: false, error: 'Failed to disable TOTP' };
      }

      // Also delete all backup codes
      await supabase
        .from('backup_codes')
        .delete()
        .eq('admin_user_id', userId);

      return { success: true };
    } catch (error) {
      console.error('Error disabling TOTP:', error);
      return { success: false, error: 'Failed to disable TOTP' };
    }
  }

  /**
   * Generate backup codes for 2FA recovery
   */
  async generateBackupCodes(userId) {
    try {
      // Delete existing unused backup codes
      await supabase
        .from('backup_codes')
        .delete()
        .eq('admin_user_id', userId)
        .is('used_at', null);

      // Generate new backup codes
      const codes = [];
      const bcrypt = require('bcrypt');

      for (let i = 0; i < BACKUP_CODES_COUNT; i++) {
        // Generate 8-character alphanumeric code
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(code);

        // Hash and store
        const codeHash = await bcrypt.hash(code, 10);
        await supabase
          .from('backup_codes')
          .insert({
            admin_user_id: userId,
            code_hash: codeHash
          });
      }

      return { success: true, codes };
    } catch (error) {
      console.error('Error generating backup codes:', error);
      return { success: false, error: 'Failed to generate backup codes' };
    }
  }

  /**
   * Verify a backup code
   */
  async verifyBackupCode(userId, code) {
    try {
      const bcrypt = require('bcrypt');

      // Get all unused backup codes for user
      const { data: backupCodes, error } = await supabase
        .from('backup_codes')
        .select('id, code_hash')
        .eq('admin_user_id', userId)
        .is('used_at', null);

      if (error || !backupCodes || backupCodes.length === 0) {
        return { success: false, error: 'No valid backup codes available' };
      }

      // Check each backup code
      for (const backupCode of backupCodes) {
        const matches = await bcrypt.compare(code, backupCode.code_hash);
        if (matches) {
          // Mark code as used
          await supabase
            .from('backup_codes')
            .update({ used_at: new Date().toISOString() })
            .eq('id', backupCode.id);

          return { success: true };
        }
      }

      return { success: false, error: 'Invalid backup code' };
    } catch (error) {
      console.error('Error verifying backup code:', error);
      return { success: false, error: 'Failed to verify backup code' };
    }
  }

  /**
   * Get remaining backup codes count
   */
  async getRemainingBackupCodesCount(userId) {
    try {
      const { data, error, count } = await supabase
        .from('backup_codes')
        .select('id', { count: 'exact', head: true })
        .eq('admin_user_id', userId)
        .is('used_at', null);

      if (error) {
        console.error('Error getting backup codes count:', error);
        return { success: false, error: 'Failed to get backup codes count' };
      }

      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Error getting backup codes count:', error);
      return { success: false, error: 'Failed to get backup codes count' };
    }
  }

  /**
   * Check if user has TOTP enabled
   */
  async isTOTPEnabled(userId) {
    try {
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('totp_enabled')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, enabled: user.totp_enabled };
    } catch (error) {
      console.error('Error checking TOTP status:', error);
      return { success: false, error: 'Failed to check TOTP status' };
    }
  }
}

module.exports = new TOTPService();
