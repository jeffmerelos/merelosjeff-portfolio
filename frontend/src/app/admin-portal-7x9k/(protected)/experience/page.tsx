'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Loading, useToast, Badge } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function ExperiencePage() {
  const { addToast } = useToast();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    achievements: '',
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await adminApi.getExperience();
      if (response.success) {
        setExperiences(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading experiences:', error);
      addToast('Failed to load experiences', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert achievements string to array
    const experienceData = {
      ...formData,
      achievements: formData.achievements
        .split('\n')
        .map((a) => a.trim())
        .filter((a) => a),
    };

    try {
      let response;
      if (editingExperience) {
        response = await adminApi.updateExperience(editingExperience.id, experienceData);
      } else {
        response = await adminApi.createExperience(experienceData);
      }

      if (response.success) {
        addToast(`Experience ${editingExperience ? 'updated' : 'created'} successfully`, 'success');
        loadExperiences();
        closeModal();
      } else {
        addToast(response.error || 'Failed to save experience', 'error');
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      addToast('Failed to save experience', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await adminApi.deleteExperience(id);
      if (response.success) {
        addToast('Experience deleted successfully', 'success');
        loadExperiences();
      } else {
        addToast(response.error || 'Failed to delete experience', 'error');
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      addToast('Failed to delete experience', 'error');
    }
  };

  const openModal = (experience?: any) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        company: experience.company,
        position: experience.position,
        location: experience.location || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        current: experience.current || false,
        description: experience.description || '',
        achievements: Array.isArray(experience.achievements)
          ? experience.achievements.join('\n')
          : '',
      });
    } else {
      setEditingExperience(null);
      setFormData({
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: '',
        achievements: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExperience(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Work Experience" neonBorder glowColor="yellow">
        <div className="flex justify-between items-center mb-6">
          <p className="text-cyber-text-muted font-tech">
            {experiences.length} experience{experiences.length !== 1 ? 's' : ''} total
          </p>
          <Button variant="cyan" onClick={() => openModal()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </Button>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12 text-cyber-text-dim">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-tech">No work experience added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-lg bg-cyber-darker border border-cyber-border hover:border-cyber-yellow transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-cyber text-cyber-yellow">{exp.position}</h3>
                    <p className="text-lg text-cyber-text font-tech">{exp.company}</p>
                    {exp.location && (
                      <p className="text-sm text-cyber-text-dim font-tech">{exp.location}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {exp.current && <Badge variant="success">Current</Badge>}
                    <button
                      onClick={() => openModal(exp)}
                      className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 rounded-lg bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-cyber-text-muted font-tech mb-3">
                  {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                </p>

                {exp.description && (
                  <p className="text-sm text-cyber-text mb-3 font-tech">{exp.description}</p>
                )}

                {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-cyber-text font-tech">
                        <span className="text-cyber-cyan mt-1">▹</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExperience ? 'Edit Experience' : 'Add New Experience'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="company"
              label="Company"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />

            <Input
              name="position"
              label="Position"
              placeholder="Job Title"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />

            <Input
              name="location"
              label="Location"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <Input
              name="start_date"
              type="date"
              label="Start Date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />

            {!formData.current && (
              <Input
                name="end_date"
                type="date"
                label="End Date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            )}

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) =>
                    setFormData({ ...formData, current: e.target.checked, end_date: '' })
                  }
                  className="w-5 h-5 rounded border-cyber-border bg-cyber-darker checked:bg-cyber-cyan focus:ring-2 focus:ring-cyber-cyan"
                />
                <span className="text-sm font-tech text-cyber-text group-hover:text-cyber-cyan transition-colors">
                  Currently Working Here
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-tech text-cyber-text mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text placeholder-cyber-text-dim focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
              placeholder="Brief description of your role..."
            />
          </div>

          <div>
            <label className="block text-sm font-tech text-cyber-text mb-2">
              Key Achievements
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text placeholder-cyber-text-dim focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
              placeholder="One achievement per line..."
            />
            <p className="mt-1 text-xs text-cyber-text-dim">Enter each achievement on a new line</p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
            <Button type="submit" variant="cyan" fullWidth>
              {editingExperience ? 'Update Experience' : 'Add Experience'}
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
