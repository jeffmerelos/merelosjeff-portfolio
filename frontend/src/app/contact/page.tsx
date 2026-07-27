'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { sendContactMessage } from '@/lib/api';
import Link from 'next/link';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Validate email format
  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length > 150) {
      newErrors.name = 'Name must be 150 characters or fewer';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
    }

    if (formData.subject.trim().length > 255) {
      newErrors.subject = 'Subject must be 255 characters or fewer';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = 'Message must be 5000 characters or fewer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Real-time email validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: undefined,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors above',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      console.log('📧 Sending contact form:', formData);
      const response = await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      console.log('✅ Contact form sent successfully:', response);

      setSubmitStatus({
        type: 'success',
        message:
          'Message sent successfully! I\'ll get back to you within 24–48 hours.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('❌ Contact form error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again or email me directly.';

      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="section border-t border-line bg-gradient-to-br from-neon-pink/5 via-transparent to-neon-violet/5">
          <div className="container text-center">
            <p className="eyebrow mb-4">// get in touch</p>
            <h1 className="heading-1 mb-6">
              Let's <span className="text-gradient">Connect</span>
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
              Have a question or project in mind? I'd love to hear from you.
              Fill out the form below and I'll get back to you as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section">
          <div className="container max-w-2xl">
            <div className="card">
              {/* Reserved space for messages - prevents layout shift */}
              <div className="mb-6 min-h-24">
                {submitStatus.type === 'success' && (
                  <div className="p-4 rounded-lg bg-neon-pink/10 border border-neon-pink text-neon-pink animate-in fade-in">
                    ✅ {submitStatus.message}
                  </div>
                )}

                {submitStatus.type === 'error' && (
                  <div className="p-4 rounded-lg bg-neon-pink/10 border border-neon-pink text-neon-pink animate-in fade-in">
                    ❌ {submitStatus.message}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span className="text-neon-pink">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`w-full px-4 py-2 rounded-lg bg-bg-input border ${
                      errors.name
                        ? 'border-neon-pink focus:border-neon-pink'
                        : 'border-line focus:border-neon-pink'
                    } text-text-primary placeholder-text-muted transition-colors outline-none`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-neon-pink text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-neon-pink">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-2 rounded-lg bg-bg-input border ${
                      errors.email
                        ? 'border-neon-pink focus:border-neon-pink'
                        : 'border-line focus:border-neon-pink'
                    } text-text-primary placeholder-text-muted transition-colors outline-none`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-neon-pink text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className={`w-full px-4 py-2 rounded-lg bg-bg-input border ${
                      errors.subject
                        ? 'border-neon-pink focus:border-neon-pink'
                        : 'border-line focus:border-neon-pink'
                    } text-text-primary placeholder-text-muted transition-colors outline-none`}
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="text-neon-pink text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-neon-pink">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or question..."
                    rows={6}
                    className={`w-full px-4 py-2 rounded-lg bg-bg-input border ${
                      errors.message
                        ? 'border-neon-pink focus:border-neon-pink'
                        : 'border-line focus:border-neon-pink'
                    } text-text-primary placeholder-text-muted transition-colors outline-none resize-none`}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message && (
                      <p className="text-neon-pink text-sm">{errors.message}</p>
                    )}
                    <p className="text-text-muted text-sm ml-auto">
                      {formData.message.length}/5000
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-text-muted text-center text-sm">
                  <span className="text-neon-pink">*</span> Required fields
                </p>
              </form>

              {/* Alternative Contact Methods */}
              <div className="mt-8 pt-8 border-t border-line">
                <p className="text-text-muted text-center mb-4">
                  Prefer another way to reach me?
                </p>
                <div className="space-y-2 text-center">
                  <p>
                    <span className="text-text-muted">Email: </span>
                    <a
                      href="mailto:jeffmerelos@gmail.com"
                      className="text-neon-pink hover:underline"
                    >
                      jeffmerelos@gmail.com
                    </a>
                  </p>
                  <p className="text-text-muted text-sm">
                    I typically respond within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section border-t border-line">
          <div className="container text-center">
            <p className="eyebrow mb-4">// want to explore more?</p>
            <h2 className="heading-2 mb-6">Check Out My Work</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/projects" className="btn-secondary">
                View Projects
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn About Me
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
