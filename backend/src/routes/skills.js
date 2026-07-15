const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/skills — supports ?category=frontend&featured=true
router.get('/', async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    let query = supabase.from('skills').select('*');

    if (category) {
      query = query.eq('category', category);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data: rows, error } = await query.order('category').order('sort_order');

    if (error) throw error;

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
