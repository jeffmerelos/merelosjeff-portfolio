'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Loading, useToast, Badge } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function ProjectsPage() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    technologies: '',
    featured: false,
    status: 'completed',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await adminApi.getProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      addToast('Failed to load projects', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert technologies string to array
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter((t) => t),
    };

    try {
      let response;
      if (editingProject) {
        response = await adminApi.updateProject(editingProject.id, projectData);
      } else {
        response = await adminApi.createProject(projectData);
      }

      if (response.success) {
        addToast(`Project ${editingProject ? 'updated' : 'created'} successfully`, 'success');
        loadProjects();
        closeModal();
      } else {
        addToast(response.error || 'Failed to save project', 'error');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      addToast('Failed to save project', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await adminApi.deleteProject(id);
      if (response.success) {
        addToast('Project deleted successfully', 'success');
        loadProjects();
      } else {
        addToast(response.error || 'Failed to delete project', 'error');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      addToast('Failed to delete project', 'error');
    }
  };

  const openModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description || '',
        long_description: project.long_description || '',
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        featured: project.featured || false,
        status: project.status || 'completed',
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        long_description: '',
        image_url: '',
        demo_url: '',
        github_url: '',
        technologies: '',
        featured: false,
        status: 'completed',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'planned':
        return <Badge variant="info">Planned</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Projects Management" neonBorder glowColor="cyan">
        <div className="flex justify-between items-center mb-6">
          <p className="text-cyber-text-muted font-tech">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
          <Button variant="cyan" onClick={() => openModal()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-cyber-text-dim">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="font-tech">No projects added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-lg bg-cyber-darker border border-cyber-border hover:border-cyber-cyan transition-all group"
              >
                {project.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-cyber-border">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-cyber text-cyber-cyan">{project.title}</h3>
                  {project.featured && (
                    <svg className="w-5 h-5 text-cyber-yellow" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                </div>

                <p className="text-sm text-cyber-text-muted mb-3 line-clamp-2 font-tech">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {getStatusBadge(project.status)}
                  {Array.isArray(project.technologies) &&
                    project.technologies.slice(0, 3).map((tech: string) => (
                      <Badge key={tech} variant="default">
                        {tech}
                      </Badge>
                    ))}
                  {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                    <Badge variant="default">+{project.technologies.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-cyber-border">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20 transition-colors"
                      title="View Demo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-cyber-magenta/10 text-cyber-magenta hover:bg-cyber-magenta/20 transition-colors"
                      title="View on GitHub"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  <div className="flex-1" />
                  <button
                    onClick={() => openModal(project)}
                    className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-lg bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="title"
              label="Project Title"
              placeholder="My Awesome Project"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({
                  ...formData,
                  title,
                  slug: editingProject ? formData.slug : generateSlug(title),
                });
              }}
              required
            />

            <Input
              name="slug"
              label="URL Slug"
              placeholder="my-awesome-project"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              helperText="Unique identifier for URL"
            />
          </div>

          <Input
            name="description"
            label="Short Description"
            placeholder="Brief description (1-2 sentences)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-tech text-cyber-text mb-2">
              Long Description
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text placeholder-cyber-text-dim focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
              placeholder="Detailed project description, challenges, solutions..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="image_url"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />

            <Input
              name="technologies"
              label="Technologies"
              placeholder="React, Node.js, PostgreSQL"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              helperText="Comma-separated list"
            />

            <Input
              name="demo_url"
              label="Demo URL"
              placeholder="https://demo.example.com"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
            />

            <Input
              name="github_url"
              label="GitHub URL"
              placeholder="https://github.com/username/repo"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-tech text-cyber-text mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-cyber-border bg-cyber-darker checked:bg-cyber-yellow focus:ring-2 focus:ring-cyber-yellow"
                />
                <span className="text-sm font-tech text-cyber-text group-hover:text-cyber-yellow transition-colors">
                  Featured Project
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
            <Button type="submit" variant="cyan" fullWidth>
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
            <Button type="button" variant="red" onClick={closeModal} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
