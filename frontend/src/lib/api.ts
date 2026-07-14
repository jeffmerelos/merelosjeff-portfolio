import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

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
