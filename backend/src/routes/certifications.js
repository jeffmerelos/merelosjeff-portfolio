const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/certifications
router.get('/', async (req, res, next) => {
  try {
    const { data: rows, error } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
