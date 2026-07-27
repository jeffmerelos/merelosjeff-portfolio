import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000, // Increased from 10000 to 30 seconds for Vercel cold starts
  headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Important for cross-origin requests
});

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error (No Response):', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
      });
    } else {
      // Error in request setup
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ─── Profile ────────────────────────────────────────────────
export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.data;
};

// ─── Projects ───────────────────────────────────────────────
export const getProjects = async (params?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) => {
  const { data } = await api.get('/projects', { params });
  return data.data;
};

export const getProject = async (slug: string) => {
  const { data } = await api.get(`/projects/${slug}`);
  return data.data;
};

// ─── Skills ─────────────────────────────────────────────────
export const getSkills = async (params?: { category?: string; featured?: boolean }) => {
  const { data } = await api.get('/skills', { params });
  return data;
};

// ─── Experience ─────────────────────────────────────────────
export const getExperience = async (type?: 'work' | 'education') => {
  const { data } = await api.get('/experience', { params: type ? { type } : {} });
  return data.data;
};

// ─── Blog ───────────────────────────────────────────────────
export const getBlogPosts = async () => {
  const { data } = await api.get('/blog');
  return data.data;
};

export const getBlogPost = async (slug: string) => {
  const { data } = await api.get(`/blog/${slug}`);
  return data.data;
};

// ─── Certifications ─────────────────────────────────────────
export const getCertifications = async () => {
  const { data } = await api.get('/certifications');
  return data.data;
};

// ─── Testimonials ───────────────────────────────────────────
export const getTestimonials = async (featured?: boolean) => {
  const { data } = await api.get('/testimonials', {
    params: featured ? { featured: 'true' } : {},
  });
  return data.data;
};

// ─── Contact ────────────────────────────────────────────────
export const sendContactMessage = async (payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string; // honeypot
}) => {
  const { data } = await api.post('/contact', payload);
  return data;
};

// ─── GitHub ─────────────────────────────────────────────────
export const getGitHubStats = async () => {
  const { data } = await api.get('/github');
  return data.data;
};

export default api;
