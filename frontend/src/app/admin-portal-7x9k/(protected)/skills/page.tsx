'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Loading, useToast, Badge } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function SkillsPage() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50,
  });
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await adminApi.getSkills();
      if (response.success) {
        setSkills(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading skills:', error);
      addToast('Failed to load skills', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editingSkill) {
        response = await adminApi.updateSkill(editingSkill.id, formData);
      } else {
        response = await adminApi.createSkill(formData);
      }

      if (response.success) {
        addToast(`Skill ${editingSkill ? 'updated' : 'created'} successfully`, 'success');
        loadSkills();
        closeModal();
      } else {
        addToast(response.error || 'Failed to save skill', 'error');
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      addToast('Failed to save skill', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await adminApi.deleteSkill(id);
      if (response.success) {
        addToast('Skill deleted successfully', 'success');
        loadSkills();
      } else {
        addToast(response.error || 'Failed to delete skill', 'error');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      addToast('Failed to delete skill', 'error');
    }
  };

  const openModal = (skill?: any) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
      });
    } else {
      setEditingSkill(null);
      setFormData({ name: '', category: '', proficiency: 50 });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    setFormData({ name: '', category: '', proficiency: 50 });
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newSkills = [...skills];
    const draggedItem = newSkills[draggingIndex];
    newSkills.splice(draggingIndex, 1);
    newSkills.splice(index, 0, draggedItem);

    setSkills(newSkills);
    setDraggingIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggingIndex === null) return;

    try {
      const orderedIds = skills.map((skill) => skill.id);
      const response = await adminApi.reorderSkills(orderedIds);
      if (!response.success) {
        addToast('Failed to save new order', 'error');
        loadSkills();
      } else {
        addToast('Skills reordered successfully', 'success');
      }
    } catch (error) {
      console.error('Error reordering skills:', error);
      addToast('Failed to save new order', 'error');
      loadSkills();
    }

    setDraggingIndex(null);
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-cyber-green';
    if (proficiency >= 50) return 'text-cyber-cyan';
    if (proficiency >= 30) return 'text-cyber-magenta';
    return 'text-cyber-yellow';
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Skills Management" neonBorder glowColor="magenta">
        <div className="flex justify-between items-center mb-6">
          <p className="text-cyber-text-muted font-tech">
            Drag and drop to reorder skills
          </p>
          <Button variant="cyan" onClick={() => openModal()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </Button>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-12 text-cyber-text-dim">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-tech">No skills added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 rounded-lg bg-cyber-darker border border-cyber-border hover:border-cyber-magenta transition-all cursor-move group ${
                  draggingIndex === index ? 'opacity-50 scale-95' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="text-cyber-text-dim">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>

                  {/* Skill Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-cyber text-cyber-text">{skill.name}</h3>
                      <Badge variant="default">{skill.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-cyber-border rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProficiencyColor(skill.proficiency)} bg-current transition-all`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className={`text-sm font-tech ${getProficiencyColor(skill.proficiency)}`}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(skill)}
                      className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 rounded-lg bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
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
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label="Skill Name"
            placeholder="e.g., JavaScript, React, Python"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            name="category"
            label="Category"
            placeholder="e.g., Frontend, Backend, DevOps"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-tech text-cyber-text mb-2">
              Proficiency ({formData.proficiency}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-cyber-border rounded-lg appearance-none cursor-pointer slider-cyber"
            />
            <div className="flex justify-between text-xs text-cyber-text-dim mt-1 font-tech">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" variant="cyan" fullWidth>
              {editingSkill ? 'Update Skill' : 'Add Skill'}
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
