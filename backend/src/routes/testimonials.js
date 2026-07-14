const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/testimonials — supports ?featured=true
router.get('/', async (req, res, next) => {
  try {
    const { featured } = req.query;

    let query = 'SELECT * FROM testimonials WHERE 1=1';
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }
    query += ' ORDER BY sort_order ASC';

    const [rows] = await pool.query(query);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
