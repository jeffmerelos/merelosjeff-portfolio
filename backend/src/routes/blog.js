const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/blog — list all published posts
router.get('/', async (req, res, next) => {
  try {
    const { data: rows, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, tags, read_time_minutes, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    const posts = rows.map((row) => ({
      ...row,
      tags: row.tags ? (Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags)) : [],
    }));

    res.json({ success: true, data: posts, count: posts.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/blog/:slug — single post
router.get('/:slug', async (req, res, next) => {
  try {
    const { data: rows, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      throw error;
    }

    const post = rows;
    post.tags = post.tags ? (Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags)) : [];

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
