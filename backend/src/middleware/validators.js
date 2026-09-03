const Joi = require('joi');

/**
 * Validation middleware factory
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors
      });
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
}

// ============================================
// Authentication Validators
// ============================================

const loginSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 50 characters',
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    })
});

const twoFactorSchema = Joi.object({
  code: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.length': 'Code must be 6 digits',
      'string.pattern.base': 'Code must contain only numbers',
      'any.required': 'Verification code is required'
    }),
  userId: Joi.string()
    .uuid()
    .required()
});

const backupCodeSchema = Joi.object({
  code: Joi.string()
    .length(8)
    .pattern(/^[A-F0-9]{8}$/)
    .required()
    .messages({
      'string.length': 'Backup code must be 8 characters',
      'string.pattern.base': 'Invalid backup code format',
      'any.required': 'Backup code is required'
    }),
  userId: Joi.string()
    .uuid()
    .required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(12)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 12 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

// ============================================
// Profile Validators
// ============================================

const updateProfileSchema = Joi.object({
  full_name: Joi.string()
    .min(1)
    .max(150)
    .optional(),
  title: Joi.string()
    .min(1)
    .max(150)
    .optional(),
  tagline: Joi.string()
    .max(255)
    .optional()
    .allow('', null),
  bio_short: Joi.string()
    .max(500)
    .optional()
    .allow('', null),
  bio_long: Joi.string()
    .max(5000)
    .optional()
    .allow('', null),
  email: Joi.string()
    .email()
    .max(100)
    .optional(),
  phone: Joi.string()
    .max(30)
    .optional()
    .allow('', null),
  location: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  github_username: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  linkedin_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null),
  twitter_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null),
  website_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null)
});

// ============================================
// Skill Validators
// ============================================

const createSkillSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required(),
  category: Joi.string()
    .valid('frontend', 'backend', 'database', 'devops', 'design', 'other')
    .required(),
  proficiency: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(80),
  icon_name: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  color: Joi.string()
    .max(20)
    .optional()
    .allow('', null),
  sort_order: Joi.number()
    .integer()
    .min(0)
    .default(0),
  is_featured: Joi.boolean()
    .default(false)
});

const updateSkillSchema = createSkillSchema.fork(
  ['name', 'category'],
  (schema) => schema.optional()
);

// ============================================
// Project Validators
// ============================================

const createProjectSchema = Joi.object({
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .min(1)
    .max(150)
    .required()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens'
    }),
  title: Joi.string()
    .min(1)
    .max(200)
    .required(),
  tagline: Joi.string()
    .max(255)
    .optional()
    .allow('', null),
  description: Joi.string()
    .max(10000)
    .optional()
    .allow('', null),
  problem: Joi.string()
    .max(10000)
    .optional()
    .allow('', null),
  approach: Joi.string()
    .max(10000)
    .optional()
    .allow('', null),
  solution: Joi.string()
    .max(10000)
    .optional()
    .allow('', null),
  results: Joi.string()
    .max(10000)
    .optional()
    .allow('', null),
  learnings: Joi.string()
    .max(10000)
    .optional()
    .allow('', null),
  video_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null),
  live_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null),
  github_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null),
  category: Joi.string()
    .valid('web', 'mobile', 'desktop', 'api', 'other')
    .default('web'),
  status: Joi.string()
    .valid('completed', 'in-progress', 'archived')
    .default('completed'),
  role: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  timeframe: Joi.string()
    .max(100)
    .optional()
    .allow('', null),
  is_featured: Joi.boolean()
    .default(false),
  is_pinned: Joi.boolean()
    .default(false),
  sort_order: Joi.number()
    .integer()
    .min(0)
    .default(0),
  technologies: Joi.array()
    .items(Joi.number().integer())
    .optional()
});

const updateProjectSchema = createProjectSchema.fork(
  ['slug', 'title'],
  (schema) => schema.optional()
);

// ============================================
// Experience Validators
// ============================================

const createExperienceSchema = Joi.object({
  type: Joi.string()
    .valid('work', 'education')
    .default('work'),
  title: Joi.string()
    .min(1)
    .max(200)
    .required(),
  organization: Joi.string()
    .min(1)
    .max(200)
    .required(),
  location: Joi.string()
    .max(150)
    .optional()
    .allow('', null),
  start_date: Joi.date()
    .max('now')
    .required(),
  end_date: Joi.date()
    .min(Joi.ref('start_date'))
    .optional()
    .allow(null),
  is_current: Joi.boolean()
    .default(false),
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('', null),
  achievements: Joi.array()
    .items(Joi.string())
    .optional(),
  technologies: Joi.array()
    .items(Joi.string())
    .optional(),
  sort_order: Joi.number()
    .integer()
    .min(0)
    .default(0)
});

const updateExperienceSchema = createExperienceSchema.fork(
  ['title', 'organization', 'start_date'],
  (schema) => schema.optional()
);

// ============================================
// Certification Validators
// ============================================

const createCertificationSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required(),
  issuing_org: Joi.string()
    .min(1)
    .max(150)
    .required(),
  issue_date: Joi.date()
    .required(),
  expiry_date: Joi.date()
    .min(Joi.ref('issue_date'))
    .optional()
    .allow(null),
  credential_id: Joi.string()
    .max(150)
    .optional()
    .allow('', null),
  verify_url: Joi.string()
    .uri()
    .max(500)
    .optional()
    .allow('', null),
  category: Joi.string()
    .max(50)
    .default('other'),
  sort_order: Joi.number()
    .integer()
    .min(0)
    .default(0)
});

const updateCertificationSchema = createCertificationSchema.fork(
  ['title', 'issuing_org', 'issue_date'],
  (schema) => schema.optional()
);

// ============================================
// Contact Message Validators
// ============================================

const messageFilterSchema = Joi.object({
  status: Joi.string()
    .valid('read', 'unread', 'archived', 'all')
    .default('all'),
  search: Joi.string()
    .max(200)
    .optional(),
  startDate: Joi.date()
    .optional(),
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
});

// ============================================
// Export validators
// ============================================

module.exports = {
  validate,
  // Auth
  validateLogin: validate(loginSchema),
  validateTwoFactor: validate(twoFactorSchema),
  validateBackupCode: validate(backupCodeSchema),
  validateChangePassword: validate(changePasswordSchema),
  // Profile
  validateUpdateProfile: validate(updateProfileSchema),
  // Skills
  validateCreateSkill: validate(createSkillSchema),
  validateUpdateSkill: validate(updateSkillSchema),
  // Projects
  validateCreateProject: validate(createProjectSchema),
  validateUpdateProject: validate(updateProjectSchema),
  // Experience
  validateCreateExperience: validate(createExperienceSchema),
  validateUpdateExperience: validate(updateExperienceSchema),
  // Certifications
  validateCreateCertification: validate(createCertificationSchema),
  validateUpdateCertification: validate(updateCertificationSchema),
  // Messages
  validateMessageFilter: validate(messageFilterSchema, 'query')
};
