const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/profile
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Profile not found' });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
