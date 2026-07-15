const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { supabase } = require('../config/database');
const { sendContactEmail, sendAutoReply } = require('../config/mailer');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Strict rate limiter for contact form — 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '5'),
  message: {
    success: false,
    error: 'Too many messages sent. Please wait a while and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 150 }).withMessage('Name must be 150 characters or fewer'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Subject must be 255 characters or fewer'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 20 }).withMessage('Message must be at least 20 characters')
    .isLength({ max: 5000 }).withMessage('Message must be 5000 characters or fewer'),
  // Honeypot — bots fill this, humans don't
  body('website')
    .custom((value) => {
      if (value) throw new Error('Bot detected');
      return true;
    }),
];

// POST /api/contact
router.post('/', contactLimiter, contactValidation, validate, async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    // Save to database
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject: subject || null,
          message,
          ip_address: ip,
          status: 'unread',
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    // Send emails (non-blocking — don't fail the response if email fails)
    try {
      await sendContactEmail({ name, email, subject, message });
      await sendAutoReply({ name, email });
    } catch (emailErr) {
      console.error('Email send failed (message saved to DB):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Message received! I\'ll get back to you within 24–48 hours.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
