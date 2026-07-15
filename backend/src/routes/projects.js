const express = require('express');
const { supabase } = require('../config/database');

const router = express.Router();

// GET /api/projects — supports ?category=web&featured=true&search=alpha
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;

    // Using Supabase PostgREST API to fetch projects with technologies
    // We'll fetch projects and then fetch technologies separately, then join in app
    let query = supabase
      .from('projects')
      .select(`
        id,
        slug,
        title,
        tagline,
        description,
        problem,
        approach,
        solution,
        results,
        learnings,
        cover_image_url,
        video_url,
        live_url,
        github_url,
        category,
        status,
        role,
        timeframe,
        is_featured,
        is_pinned,
        sort_order,
        created_at,
        updated_at,
        project_technologies (
          skill_id,
          skills (
            id,
            name,
            icon_name,
            color
          )
        )
      `);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (search) {
      const term = `%${search}%`;
      query = query.or(
        `title.ilike.${term},tagline.ilike.${term},description.ilike.${term}`
      );
    }

    const { data: rows, error } = await query
      .order('is_pinned', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // Transform the nested data structure
    const projects = rows.map((row) => ({
      ...row,
      technologies: row.project_technologies
        .filter((pt) => pt.skills)
        .map((pt) => ({
          id: pt.skills.id,
          name: pt.skills.name,
          icon_name: pt.skills.icon_name,
          color: pt.skills.color,
        })),
      project_technologies: undefined,
    }));

    res.json({ success: true, data: projects, count: projects.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { data: rows, error: projectError } = await supabase
      .from('projects')
      .select(`
        id,
        slug,
        title,
        tagline,
        description,
        problem,
        approach,
        solution,
        results,
        learnings,
        cover_image_url,
        video_url,
        live_url,
        github_url,
        category,
        status,
        role,
        timeframe,
        is_featured,
        is_pinned,
        sort_order,
        created_at,
        updated_at,
        project_technologies (
          skill_id,
          skills (
            id,
            name,
            icon_name,
            color
          )
        )
      `)
      .eq('slug', req.params.slug)
      .single();

    if (projectError) {
      if (projectError.code === 'PGRST116') {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
      throw projectError;
    }

    const project = rows;
    project.technologies = project.project_technologies
      .filter((pt) => pt.skills)
      .map((pt) => ({
        id: pt.skills.id,
        name: pt.skills.name,
        icon_name: pt.skills.icon_name,
        color: pt.skills.color,
      }));
    delete project.project_technologies;

    // Get images
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true });

    if (!imagesError) {
      project.images = images;
    }

    // Get prev project
    const { data: prevData } = await supabase
      .from('projects')
      .select('slug, title')
      .lt('sort_order', project.sort_order)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();
    project.prev = prevData || null;

    // Get next project
    const { data: nextData } = await supabase
      .from('projects')
      .select('slug, title')
      .gt('sort_order', project.sort_order)
      .order('sort_order', { ascending: true })
      .limit(1)
      .single();
    project.next = nextData || null;

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
