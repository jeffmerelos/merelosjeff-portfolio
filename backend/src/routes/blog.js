const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/blog — list all published posts
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, slug, title, excerpt, cover_image_url, tags, read_time_minutes, published_at FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC'
    );

    const posts = rows.map((row) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
    }));

    res.json({ success: true, data: posts, count: posts.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/blog/:slug — single post
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1',
      [req.params.slug]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const post = rows[0];
    post.tags = post.tags ? JSON.parse(post.tags) : [];

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
