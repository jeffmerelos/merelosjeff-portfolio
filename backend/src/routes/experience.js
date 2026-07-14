const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/experience — supports ?type=work or ?type=education
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;

    let query = 'SELECT * FROM experience WHERE 1=1';
    const params = [];

    if (type && (type === 'work' || type === 'education')) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY start_date DESC';

    const [rows] = await pool.query(query, params);

    // Parse JSON fields
    const experience = rows.map((row) => ({
      ...row,
      achievements: row.achievements ? JSON.parse(row.achievements) : [],
      technologies: row.technologies ? JSON.parse(row.technologies) : [],
    }));

    res.json({ success: true, data: experience, count: experience.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
