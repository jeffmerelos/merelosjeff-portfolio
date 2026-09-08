import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const sendContactEmail = async ({ name, email, subject, message }: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Portfolio Contact] ${subject || 'New Message'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #F5F5F7; padding: 32px; border-radius: 12px; border: 1px solid #2A2A35;">
        <h2 style="color: #FF1B6B; margin-top: 0;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #9A9AA5; width: 100px;">From:</td>
            <td style="padding: 8px 0; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9A9AA5;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4EA8FF;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9A9AA5;">Subject:</td>
            <td style="padding: 8px 0;">${subject || 'No subject'}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #2A2A35; margin: 24px 0;" />
        <h3 style="color: #9D4EDD; margin-top: 0;">Message:</h3>
        <p style="line-height: 1.7; white-space: pre-line;">${message}</p>
        <hr style="border: 1px solid #2A2A35; margin: 24px 0;" />
        <p style="color: #9A9AA5; font-size: 12px;">Sent via portfolio contact form at ${new Date().toISOString()}</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendAutoReply = async ({ name, email }: { name: string; email: string }) => {
  const mailOptions = {
    from: `"Jeff Developer" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #F5F5F7; padding: 32px; border-radius: 12px; border: 1px solid #2A2A35;">
        <h2 style="color: #FF1B6B; margin-top: 0;">Message Received ✓</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thanks for getting in touch! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
        <p style="color: #9A9AA5;">If your matter is urgent, you can also reach me directly at <a href="mailto:${process.env.EMAIL_TO}" style="color: #4EA8FF;">${process.env.EMAIL_TO}</a>.</p>
        <p>Talk soon,<br /><strong>Jeff</strong></p>
        <hr style="border: 1px solid #2A2A35; margin: 24px 0;" />
        <p style="color: #9A9AA5; font-size: 12px;">This is an automated confirmation. Please do not reply to this email directly.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Rate limiting storage (in-memory, use Redis/database in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 900000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many messages sent. Please wait a while and try again.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json(
        { success: false, error: 'Bot detected' },
        { status: 400 }
      );
    }

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (name.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Name must be 150 characters or fewer' },
        { status: 400 }
      );
    }

    if (message.length < 20 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 20 and 5000 characters' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('📧 Processing contact form submission:', { name, email, subject });

    // Save to database
    const { data: insertedData, error: insertError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject?.trim() || null,
          message: message.trim(),
          ip_address: ip,
          status: 'unread',
        },
      ])
      .select();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save message to database',
          details: insertError.message,
        },
        { status: 400 }
      );
    }

    console.log('✅ Message saved to database:', insertedData);

    // Send emails (non-blocking)
    try {
      console.log('📨 Sending contact email notification...');
      await sendContactEmail({ name, email, subject, message });
      console.log('✅ Contact email sent successfully');

      console.log('📨 Sending auto-reply to user...');
      await sendAutoReply({ name, email });
      console.log('✅ Auto-reply sent successfully');
    } catch (emailErr: any) {
      console.error('⚠️  Email send failed (message saved to DB):', emailErr.message);
      // Don't fail the response - message is already saved to DB
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message received! I'll get back to you within 24–48 hours.",
        data: insertedData,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('❌ Contact route error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
