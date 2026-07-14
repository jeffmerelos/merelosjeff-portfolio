const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/skills — supports ?category=frontend&featured=true
router.get('/', async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    let query = 'SELECT * FROM skills WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }

    query += ' ORDER BY category, sort_order ASC';

    const [rows] = await pool.query(query, params);

    // Group by category
    const grouped = rows.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({ success: true, data: rows, grouped, count: rows.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
