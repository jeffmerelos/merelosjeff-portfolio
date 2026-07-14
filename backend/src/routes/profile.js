const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/profile
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profile LIMIT 1');
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
