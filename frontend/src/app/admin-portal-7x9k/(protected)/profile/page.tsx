'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Loading, useToast } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function ProfilePage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    tagline: '',
    resume_url: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await adminApi.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          full_name: response.data.full_name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          bio: response.data.bio || '',
          tagline: response.data.tagline || '',
          resume_url: response.data.resume_url || '',
          github_url: response.data.github_url || '',
          linkedin_url: response.data.linkedin_url || '',
          twitter_url: response.data.twitter_url || '',
          website_url: response.data.website_url || '',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      addToast('Failed to load profile', 'error');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await adminApi.updateProfile(formData);
      if (response.success) {
        addToast('Profile updated successfully', 'success');
        setProfile(response.data);
      } else {
        addToast(response.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Profile Information" neonBorder glowColor="cyan">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-cyber text-cyber-magenta mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="full_name"
                label="Full Name"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                label="Phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                name="location"
                label="Location"
                placeholder="San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h3 className="text-lg font-cyber text-cyber-magenta mb-4">Bio & Tagline</h3>
            <div className="space-y-4">
              <Input
                name="tagline"
                label="Tagline"
                placeholder="Full Stack Developer | Tech Enthusiast"
                value={formData.tagline}
                onChange={handleChange}
                helperText="Short one-liner about yourself"
              />
              <div>
                <label className="block text-sm font-tech text-cyber-text mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text placeholder-cyber-text-dim focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
                  placeholder="Tell us about yourself, your experience, and what drives you..."
                />
                <p className="mt-1 text-xs text-cyber-text-dim">
                  Longer description about your background and expertise
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-cyber text-cyber-magenta mb-4">Links & Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="resume_url"
                label="Resume URL"
                placeholder="https://example.com/resume.pdf"
                value={formData.resume_url}
                onChange={handleChange}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <Input
                name="github_url"
                label="GitHub URL"
                placeholder="https://github.com/username"
                value={formData.github_url}
                onChange={handleChange}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                }
              />
              <Input
                name="linkedin_url"
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin_url}
                onChange={handleChange}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                }
              />
              <Input
                name="twitter_url"
                label="Twitter URL"
                placeholder="https://twitter.com/username"
                value={formData.twitter_url}
                onChange={handleChange}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                }
              />
              <Input
                name="website_url"
                label="Website URL"
                placeholder="https://yourwebsite.com"
                value={formData.website_url}
                onChange={handleChange}
                className="md:col-span-2"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4 border-t border-cyber-border">
            <Button
              type="submit"
              variant="cyan"
              size="lg"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button
              type="button"
              variant="red"
              size="lg"
              onClick={loadProfile}
              disabled={saving}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
