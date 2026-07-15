const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/testimonials — supports ?featured=true
router.get('/', async (req, res, next) => {
  try {
    const { featured } = req.query;

    let query = supabase.from('testimonials').select('*');

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data: rows, error } = await query.order('sort_order');

    if (error) throw error;

    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
