require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Suppress async operation warnings during startup
process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    // Ignore this specific warning
    return;
  }
  console.warn(warning);
});

// Routes
const profileRouter = require('./routes/profile');
const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const experienceRouter = require('./routes/experience');
const blogRouter = require('./routes/blog');
const certificationsRouter = require('./routes/certifications');
const testimonialsRouter = require('./routes/testimonials');
const contactRouter = require('./routes/contact');
const githubRouter = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// General rate limiter
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
  })
);

// ─── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Logging ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/profile', profileRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/blog', blogRouter);
app.use('/api/certifications', certificationsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/github', githubRouter);

// ─── 404 & Error handling ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ─────────────────────────────────────────────────────────────────
// For local development
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    try {
      await testConnection();
      app.listen(PORT, () => {
        console.log(`\n🚀 Backend API running on http://localhost:${PORT}`);
        console.log(`   Health: http://localhost:${PORT}/health`);
        console.log(`   Env:    ${process.env.NODE_ENV || 'development'}\n`);
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  };

  start();
}

// Export for Vercel serverless functions
module.exports = app;
