const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');
const { authenticateAdmin, extractRequestInfo } = require('../middleware/auth');
const { adminApiLimiter } = require('../middleware/rateLimiter');
const { csrfProtection } = require('../middleware/csrf');
const auditService = require('../services/auditService');
const {
  validateUpdateProfile,
  validateCreateSkill,
  validateUpdateSkill,
  validateCreateProject,
  validateUpdateProject,
  validateCreateExperience,
  validateUpdateExperience,
  validateCreateCertification,
  validateUpdateCertification
} = require('../middleware/validators');

// Apply middleware to all routes
router.use(extractRequestInfo);
router.use(authenticateAdmin);
router.use(adminApiLimiter);

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * GET /api/admin/content/profile
 * Get profile information
 */
router.get('/profile', async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profile')
      .select('*')
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch profile'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

/**
 * PUT /api/admin/content/profile
 * Update profile information
 */
router.put('/profile', csrfProtection, validateUpdateProfile, async (req, res) => {
  try {
    const { user, clientIp, userAgent } = req;
    const profileData = req.body;

    // Get current profile to track changes
    const { data: currentProfile } = await supabase
      .from('profile')
      .select('*')
      .single();

    // Update profile
    const { data: profile, error } = await supabase
      .from('profile')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProfile.id)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }

    // Track changed fields
    const changedFields = Object.keys(profileData);

    // Log activity
    await auditService.logProfileUpdated(
      user.id,
      user.username,
      changedFields,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      profile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// ============================================
// SKILLS MANAGEMENT
// ============================================

/**
 * GET /api/admin/content/skills
 * Get all skills
 */
router.get('/skills', async (req, res) => {
  try {
    const { category, featured } = req.query;

    let query = supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured === 'true');
    }

    const { data: skills, error } = await query;

    if (error) {
      console.error('Get skills error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch skills'
      });
    }

    res.json({
      success: true,
      skills: skills || []
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch skills'
    });
  }
});

/**
 * POST /api/admin/content/skills
 * Create a new skill
 */
router.post('/skills', csrfProtection, validateCreateSkill, async (req, res) => {
  try {
    const { user, clientIp, userAgent } = req;
    const skillData = req.body;

    const { data: skill, error } = await supabase
      .from('skills')
      .insert(skillData)
      .select()
      .single();

    if (error) {
      console.error('Create skill error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create skill'
      });
    }

    // Log activity
    await auditService.logSkillCreated(
      user.id,
      user.username,
      skill.id,
      skill.name,
      clientIp,
      userAgent
    );

    res.status(201).json({
      success: true,
      skill,
      message: 'Skill created successfully'
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create skill'
    });
  }
});

/**
 * PUT /api/admin/content/skills/:id
 * Update a skill
 */
router.put('/skills/:id', csrfProtection, validateUpdateSkill, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;
    const skillData = req.body;

    const { data: skill, error } = await supabase
      .from('skills')
      .update(skillData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update skill error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update skill'
      });
    }

    // Log activity
    await auditService.logSkillUpdated(
      user.id,
      user.username,
      skill.id,
      skill.name,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      skill,
      message: 'Skill updated successfully'
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update skill'
    });
  }
});

/**
 * DELETE /api/admin/content/skills/:id
 * Delete a skill
 */
router.delete('/skills/:id', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    // Get skill name before deleting
    const { data: skill } = await supabase
      .from('skills')
      .select('name')
      .eq('id', id)
      .single();

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete skill error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete skill'
      });
    }

    // Log activity
    await auditService.logSkillDeleted(
      user.id,
      user.username,
      parseInt(id),
      skill.name,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete skill'
    });
  }
});

/**
 * PUT /api/admin/content/skills/reorder
 * Reorder skills
 */
router.put('/reorder/skills', csrfProtection, async (req, res) => {
  try {
    const { skillOrders } = req.body; // Array of { id, sort_order }

    if (!Array.isArray(skillOrders)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      });
    }

    // Update sort orders in transaction
    const updates = skillOrders.map(({ id, sort_order }) =>
      supabase
        .from('skills')
        .update({ sort_order })
        .eq('id', id)
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Skills reordered successfully'
    });
  } catch (error) {
    console.error('Reorder skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder skills'
    });
  }
});

// ============================================
// PROJECTS MANAGEMENT
// ============================================

/**
 * GET /api/admin/content/projects
 * Get all projects
 */
router.get('/projects', async (req, res) => {
  try {
    const { category, status, featured } = req.query;

    let query = supabase
      .from('projects')
      .select(`
        *,
        project_technologies (
          skill_id,
          skills (id, name, icon_name, color)
        )
      `)
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured === 'true');
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Get projects error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch projects'
      });
    }

    res.json({
      success: true,
      projects: projects || []
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

/**
 * GET /api/admin/content/projects/:slug
 * Get a single project by slug
 */
router.get('/projects/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_technologies (
          skill_id,
          skills (id, name, icon_name, color)
        ),
        project_images (*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

/**
 * POST /api/admin/content/projects
 * Create a new project
 */
router.post('/projects', csrfProtection, validateCreateProject, async (req, res) => {
  try {
    const { user, clientIp, userAgent } = req;
    const { technologies, ...projectData } = req.body;

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (projectError) {
      console.error('Create project error:', projectError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create project'
      });
    }

    // Insert technologies if provided
    if (technologies && technologies.length > 0) {
      const techRecords = technologies.map(skillId => ({
        project_id: project.id,
        skill_id: skillId
      }));

      await supabase
        .from('project_technologies')
        .insert(techRecords);
    }

    // Log activity
    await auditService.logProjectCreated(
      user.id,
      user.username,
      project.id,
      project.title,
      clientIp,
      userAgent
    );

    res.status(201).json({
      success: true,
      project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

/**
 * PUT /api/admin/content/projects/:id
 * Update a project
 */
router.put('/projects/:id', csrfProtection, validateUpdateProject, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;
    const { technologies, ...projectData } = req.body;

    // Update project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update({
        ...projectData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (projectError) {
      console.error('Update project error:', projectError);
      return res.status(500).json({
        success: false,
        error: 'Failed to update project'
      });
    }

    // Update technologies if provided
    if (technologies !== undefined) {
      // Delete existing technologies
      await supabase
        .from('project_technologies')
        .delete()
        .eq('project_id', id);

      // Insert new technologies
      if (technologies.length > 0) {
        const techRecords = technologies.map(skillId => ({
          project_id: parseInt(id),
          skill_id: skillId
        }));

        await supabase
          .from('project_technologies')
          .insert(techRecords);
      }
    }

    // Log activity
    await auditService.logProjectUpdated(
      user.id,
      user.username,
      project.id,
      project.title,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

/**
 * DELETE /api/admin/content/projects/:id
 * Delete a project
 */
router.delete('/projects/:id', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    // Get project title before deleting
    const { data: project } = await supabase
      .from('projects')
      .select('title')
      .eq('id', id)
      .single();

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Delete project (cascades to technologies and images)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete project error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete project'
      });
    }

    // Log activity
    await auditService.logProjectDeleted(
      user.id,
      user.username,
      parseInt(id),
      project.title,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

/**
 * PUT /api/admin/content/projects/reorder
 * Reorder projects
 */
router.put('/reorder/projects', csrfProtection, async (req, res) => {
  try {
    const { projectOrders } = req.body;

    if (!Array.isArray(projectOrders)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      });
    }

    const updates = projectOrders.map(({ id, sort_order }) =>
      supabase
        .from('projects')
        .update({ sort_order })
        .eq('id', id)
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Projects reordered successfully'
    });
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder projects'
    });
  }
});

// ============================================
// EXPERIENCE MANAGEMENT
// ============================================

/**
 * GET /api/admin/content/experience
 * Get all experience entries
 */
router.get('/experience', async (req, res) => {
  try {
    const { type } = req.query;

    let query = supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: experience, error } = await query;

    if (error) {
      console.error('Get experience error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch experience'
      });
    }

    res.json({
      success: true,
      experience: experience || []
    });
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience'
    });
  }
});

/**
 * POST /api/admin/content/experience
 * Create a new experience entry
 */
router.post('/experience', csrfProtection, validateCreateExperience, async (req, res) => {
  try {
    const { user, clientIp, userAgent } = req;
    const experienceData = req.body;

    const { data: experience, error } = await supabase
      .from('experience')
      .insert(experienceData)
      .select()
      .single();

    if (error) {
      console.error('Create experience error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create experience'
      });
    }

    // Log activity
    await auditService.logExperienceCreated(
      user.id,
      user.username,
      experience.id,
      experience.organization,
      clientIp,
      userAgent
    );

    res.status(201).json({
      success: true,
      experience,
      message: 'Experience created successfully'
    });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create experience'
    });
  }
});

/**
 * PUT /api/admin/content/experience/:id
 * Update an experience entry
 */
router.put('/experience/:id', csrfProtection, validateUpdateExperience, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;
    const experienceData = req.body;

    const { data: experience, error } = await supabase
      .from('experience')
      .update(experienceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update experience error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update experience'
      });
    }

    // Log activity
    await auditService.logExperienceUpdated(
      user.id,
      user.username,
      experience.id,
      experience.organization,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      experience,
      message: 'Experience updated successfully'
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update experience'
    });
  }
});

/**
 * DELETE /api/admin/content/experience/:id
 * Delete an experience entry
 */
router.delete('/experience/:id', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    // Get organization name before deleting
    const { data: experience } = await supabase
      .from('experience')
      .select('organization')
      .eq('id', id)
      .single();

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete experience error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete experience'
      });
    }

    // Log activity
    await auditService.logExperienceDeleted(
      user.id,
      user.username,
      parseInt(id),
      experience.organization,
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete experience'
    });
  }
});

// ============================================
// CERTIFICATIONS MANAGEMENT
// ============================================

/**
 * GET /api/admin/content/certifications
 * Get all certifications
 */
router.get('/certifications', async (req, res) => {
  try {
    const { data: certifications, error } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) {
      console.error('Get certifications error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch certifications'
      });
    }

    res.json({
      success: true,
      certifications: certifications || []
    });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch certifications'
    });
  }
});

/**
 * POST /api/admin/content/certifications
 * Create a new certification
 */
router.post('/certifications', csrfProtection, validateCreateCertification, async (req, res) => {
  try {
    const { user, clientIp, userAgent } = req;
    const certificationData = req.body;

    const { data: certification, error } = await supabase
      .from('certifications')
      .insert(certificationData)
      .select()
      .single();

    if (error) {
      console.error('Create certification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create certification'
      });
    }

    // Log activity (reuse experience logging for now)
    await auditService.log(
      'certification_created',
      user.id,
      `Certification "${certification.title}" created by ${user.username}`,
      {
        entityType: 'certification',
        entityId: certification.id.toString(),
        metadata: { title: certification.title },
        ipAddress: clientIp,
        userAgent
      }
    );

    res.status(201).json({
      success: true,
      certification,
      message: 'Certification created successfully'
    });
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create certification'
    });
  }
});

/**
 * PUT /api/admin/content/certifications/:id
 * Update a certification
 */
router.put('/certifications/:id', csrfProtection, validateUpdateCertification, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;
    const certificationData = req.body;

    const { data: certification, error } = await supabase
      .from('certifications')
      .update(certificationData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update certification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update certification'
      });
    }

    // Log activity
    await auditService.log(
      'certification_updated',
      user.id,
      `Certification "${certification.title}" updated by ${user.username}`,
      {
        entityType: 'certification',
        entityId: certification.id.toString(),
        metadata: { title: certification.title },
        ipAddress: clientIp,
        userAgent
      }
    );

    res.json({
      success: true,
      certification,
      message: 'Certification updated successfully'
    });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update certification'
    });
  }
});

/**
 * DELETE /api/admin/content/certifications/:id
 * Delete a certification
 */
router.delete('/certifications/:id', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    // Get certification title before deleting
    const { data: certification } = await supabase
      .from('certifications')
      .select('title')
      .eq('id', id)
      .single();

    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      });
    }

    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete certification error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete certification'
      });
    }

    // Log activity
    await auditService.log(
      'certification_deleted',
      user.id,
      `Certification "${certification.title}" deleted by ${user.username}`,
      {
        entityType: 'certification',
        entityId: id.toString(),
        metadata: { title: certification.title },
        ipAddress: clientIp,
        userAgent
      }
    );

    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete certification'
    });
  }
});

module.exports = router;
