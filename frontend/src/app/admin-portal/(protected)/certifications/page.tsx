'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Loading, useToast, Badge } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function CertificationsPage() {
  const { showToast } = useToast();
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date_obtained: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
  });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const response = await adminApi.getCertifications();
      if (response.success) {
        setCertifications(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading certifications:', error);
      showToast({ message: 'Failed to load certifications', type: 'error' });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editingCertification) {
        response = await adminApi.updateCertification(editingCertification.id, formData);
      } else {
        response = await adminApi.createCertification(formData);
      }

      if (response.success) {
        showToast({
          message: `Certification ${editingCertification ? 'updated' : 'created'} successfully`,
          type: 'success'
        });
        loadCertifications();
        closeModal();
      } else {
        showToast({ message: response.error || 'Failed to save certification', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      showToast({ message: 'Failed to save certification', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const response = await adminApi.deleteCertification(id);
      if (response.success) {
        showToast({ message: 'Certification deleted successfully', type: 'success' });
        loadCertifications();
      } else {
        showToast({ message: response.error || 'Failed to delete certification', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      showToast({ message: 'Failed to delete certification', type: 'error' });
    }
  };

  const openModal = (certification?: any) => {
    if (certification) {
      setEditingCertification(certification);
      setFormData({
        name: certification.name,
        issuer: certification.issuer,
        date_obtained: certification.date_obtained || '',
        expiry_date: certification.expiry_date || '',
        credential_id: certification.credential_id || '',
        credential_url: certification.credential_url || '',
      });
    } else {
      setEditingCertification(null);
      setFormData({
        name: '',
        issuer: '',
        date_obtained: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCertification(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry > now && expiry <= thirtyDaysFromNow;
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Certifications" neonBorder glowColor="green">
        <div className="flex justify-between items-center mb-6">
          <p className="text-cyber-text-muted font-tech">
            {certifications.length} certification{certifications.length !== 1 ? 's' : ''} total
          </p>
          <Button variant="cyan" onClick={() => openModal()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Certification
          </Button>
        </div>

        {certifications.length === 0 ? (
          <div className="text-center py-12 text-cyber-text-dim">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p className="font-tech">No certifications added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-lg bg-cyber-darker border border-cyber-border hover:border-cyber-green transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-cyber text-cyber-green mb-1">{cert.name}</h3>
                    <p className="text-sm text-cyber-text font-tech">{cert.issuer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cert.expiry_date && isExpired(cert.expiry_date) && (
                      <Badge variant="danger">Expired</Badge>
                    )}
                    {cert.expiry_date && isExpiringSoon(cert.expiry_date) && (
                      <Badge variant="warning">Expiring Soon</Badge>
                    )}
                    {!cert.expiry_date && <Badge variant="success">No Expiry</Badge>}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-cyber-text-muted font-tech">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Obtained: {formatDate(cert.date_obtained)}</span>
                  </div>
                  {cert.expiry_date && (
                    <div className="flex items-center gap-2 text-sm text-cyber-text-muted font-tech">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Expires: {formatDate(cert.expiry_date)}</span>
                    </div>
                  )}
                  {cert.credential_id && (
                    <div className="flex items-center gap-2 text-sm text-cyber-text-muted font-tech">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>ID: {cert.credential_id}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-cyber-border">
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 rounded-lg bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20 transition-colors text-center text-sm font-tech"
                    >
                      View Credential
                    </a>
                  )}
                  <button
                    onClick={() => openModal(cert)}
                    className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 rounded-lg bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        title={editingCertification ? 'Edit Certification' : 'Add New Certification'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label="Certification Name"
            placeholder="AWS Certified Solutions Architect"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            name="issuer"
            label="Issuing Organization"
            placeholder="Amazon Web Services"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="date_obtained"
              type="date"
              label="Date Obtained"
              value={formData.date_obtained}
              onChange={(e) => setFormData({ ...formData, date_obtained: e.target.value })}
              required
            />

            <Input
              name="expiry_date"
              type="date"
              label="Expiry Date (Optional)"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              helperText="Leave empty if no expiry"
            />
          </div>

          <Input
            name="credential_id"
            label="Credential ID (Optional)"
            placeholder="ABC123XYZ789"
            value={formData.credential_id}
            onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
          />

          <Input
            name="credential_url"
            label="Credential URL (Optional)"
            placeholder="https://www.certmetrics.com/..."
            value={formData.credential_url}
            onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
            <Button type="submit" variant="cyan" fullWidth>
              {editingCertification ? 'Update Certification' : 'Add Certification'}
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

