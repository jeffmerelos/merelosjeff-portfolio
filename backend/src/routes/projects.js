const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/projects — supports ?category=web&featured=true&search=alpha
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;

    let query = `
      SELECT 
        p.*,
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', s.id, 'name', s.name, 'icon_name', s.icon_name, 'color', s.color)
          ORDER BY s.name
          SEPARATOR '|||'
        ) AS technologies_raw
      FROM projects p
      LEFT JOIN project_technologies pt ON p.id = pt.project_id
      LEFT JOIN skills s ON pt.skill_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ' AND p.category = ?';
      params.push(category);
    }
    if (featured === 'true') {
      query += ' AND p.is_featured = 1';
    }
    if (search) {
      query += ' AND (p.title LIKE ? OR p.tagline LIKE ? OR p.description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' GROUP BY p.id ORDER BY p.is_pinned DESC, p.sort_order ASC';

    const [rows] = await pool.query(query, params);

    // Parse technologies from concatenated JSON
    const projects = rows.map((row) => ({
      ...row,
      technologies: row.technologies_raw
        ? row.technologies_raw.split('|||').map((t) => {
            try { return JSON.parse(t); } catch { return null; }
          }).filter(Boolean)
        : [],
      technologies_raw: undefined,
    }));

    res.json({ success: true, data: projects, count: projects.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*,
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', s.id, 'name', s.name, 'icon_name', s.icon_name, 'color', s.color)
          ORDER BY s.name
          SEPARATOR '|||'
        ) AS technologies_raw
       FROM projects p
       LEFT JOIN project_technologies pt ON p.id = pt.project_id
       LEFT JOIN skills s ON pt.skill_id = s.id
       WHERE p.slug = ?
       GROUP BY p.id`,
      [req.params.slug]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const project = rows[0];
    project.technologies = project.technologies_raw
      ? project.technologies_raw.split('|||').map((t) => {
          try { return JSON.parse(t); } catch { return null; }
        }).filter(Boolean)
      : [];
    delete project.technologies_raw;

    // Get images
    const [images] = await pool.query(
      'SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order',
      [project.id]
    );
    project.images = images;

    // Get prev/next
    const [prev] = await pool.query(
      'SELECT slug, title FROM projects WHERE sort_order < ? ORDER BY sort_order DESC LIMIT 1',
      [project.sort_order]
    );
    const [next] = await pool.query(
      'SELECT slug, title FROM projects WHERE sort_order > ? ORDER BY sort_order ASC LIMIT 1',
      [project.sort_order]
    );
    project.prev = prev[0] || null;
    project.next = next[0] || null;

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
