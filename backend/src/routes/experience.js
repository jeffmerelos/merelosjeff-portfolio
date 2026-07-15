const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/experience — supports ?type=work or ?type=education
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;

    let query = supabase.from('experience').select('*');

    if (type && (type === 'work' || type === 'education')) {
      query = query.eq('type', type);
    }

    const { data: rows, error } = await query.order('start_date', { ascending: false });

    if (error) throw error;

    // Parse JSON fields
    const experience = rows.map((row) => ({
      ...row,
      achievements: row.achievements ? JSON.parse(JSON.stringify(row.achievements)) : [],
      technologies: row.technologies ? JSON.parse(JSON.stringify(row.technologies)) : [],
    }));

    res.json({ success: true, data: experience, count: experience.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
