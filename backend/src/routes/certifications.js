const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/certifications
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certifications ORDER BY issue_date DESC');
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
