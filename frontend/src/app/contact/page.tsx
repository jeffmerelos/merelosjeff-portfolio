'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { sendContactMessage } from '@/lib/api';
import Link from 'next/link';
import { Mail, MapPin, Clock, Send, CheckCircle2, XCircle } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);

  // Auto-hide modal after 3 seconds
  useEffect(() => {
    if (showModal && submitStatus.type) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setSubmitStatus({ type: null, message: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal, submitStatus.type]);

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
      setShowModal(true);
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
      setShowModal(true);

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
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      {/* Modal for Success/Error Messages */}
      {showModal && submitStatus.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md animate-in zoom-in duration-300">
            <div className={`card p-8 text-center ${
              submitStatus.type === 'success' 
                ? 'border-neon-blue shadow-neon-blue' 
                : 'border-neon-pink shadow-neon-pink'
            }`}>
              <div className="mb-4 flex justify-center">
                {submitStatus.type === 'success' ? (
                  <CheckCircle2 className="w-16 h-16 text-neon-blue animate-in zoom-in duration-500" />
                ) : (
                  <XCircle className="w-16 h-16 text-neon-pink animate-in zoom-in duration-500" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-text-primary">
                {submitStatus.type === 'success' ? 'Success!' : 'Oops!'}
              </h3>
              
              <p className={`text-base ${
                submitStatus.type === 'success' ? 'text-neon-blue' : 'text-neon-pink'
              }`}>
                {submitStatus.message}
              </p>
              
              {/* Auto-close indicator */}
              <div className="mt-6">
                <div className="h-1 bg-line rounded-full overflow-hidden">
                  <div className={`h-full ${
                    submitStatus.type === 'success' ? 'bg-neon-blue' : 'bg-neon-pink'
                  } animate-shrink`} />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Closing automatically...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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

        {/* Contact Section - Horizontal Layout with Equal Heights */}
        <section className="section">
          <div className="container max-w-7xl">
            <div className="grid lg:grid-cols-5 gap-8 items-stretch">
              
              {/* Left Side - Contact Info */}
              <div className="lg:col-span-2">
                <div className="card-hover h-full flex flex-col">
                  <h2 className="heading-3 mb-6 text-gradient">Contact Info</h2>
                  
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    {/* Email */}
                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-bg-void/50 border border-line hover:border-neon-blue transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-neon-blue transition-all duration-300">
                          <Mail className="w-6 h-6 text-neon-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-mono text-text-muted uppercase mb-1">
                            Email
                          </h3>
                          <a
                            href="mailto:jeffmerelos@gmail.com"
                            className="text-text-primary hover:text-neon-blue transition-colors duration-200 break-all text-sm"
                          >
                            jeffmerelos@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-bg-void/50 border border-line hover:border-neon-violet transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-neon-violet/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-neon-violet transition-all duration-300">
                          <MapPin className="w-6 h-6 text-neon-violet" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-mono text-text-muted uppercase mb-1">
                            Location
                          </h3>
                          <p className="text-text-primary text-sm">
                            Available Worldwide
                          </p>
                          <p className="text-text-muted text-xs mt-1">
                            Remote Work Preferred
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="group">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-bg-void/50 border border-line hover:border-neon-pink transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-neon-pink/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-neon-pink transition-all duration-300">
                          <Clock className="w-6 h-6 text-neon-pink" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-mono text-text-muted uppercase mb-1">
                            Response Time
                          </h3>
                          <p className="text-text-primary text-sm">
                            24-48 Hours
                          </p>
                          <p className="text-text-muted text-xs mt-1">
                            Usually within a day
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-violet/10 border border-neon-blue/50">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse" />
                          <div className="absolute inset-0 w-3 h-3 rounded-full bg-neon-blue animate-ping" />
                        </div>
                        <div>
                          <p className="font-medium text-neon-blue text-sm">
                            Available for New Projects
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            Let's build something amazing together
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="lg:col-span-3">
                <div className="card-hover h-full flex flex-col">
                  <h2 className="heading-3 mb-6 text-gradient">Send a Message</h2>

                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                    {/* Name & Email Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-primary">
                          Name <span className="text-neon-pink">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-lg bg-bg-void border ${
                            errors.name
                              ? 'border-neon-pink focus:border-neon-pink focus:shadow-neon-pink'
                              : 'border-line focus:border-neon-blue focus:shadow-neon-blue'
                          } text-text-primary placeholder-text-muted transition-all duration-300 outline-none`}
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <p className="text-neon-pink text-xs mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-neon-pink" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-primary">
                          Email <span className="text-neon-pink">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`w-full px-4 py-3 rounded-lg bg-bg-void border ${
                            errors.email
                              ? 'border-neon-pink focus:border-neon-pink focus:shadow-neon-pink'
                              : 'border-line focus:border-neon-blue focus:shadow-neon-blue'
                          } text-text-primary placeholder-text-muted transition-all duration-300 outline-none`}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-neon-pink text-xs mt-1.5 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-neon-pink" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-text-primary">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        className={`w-full px-4 py-3 rounded-lg bg-bg-void border ${
                          errors.subject
                            ? 'border-neon-pink focus:border-neon-pink focus:shadow-neon-pink'
                            : 'border-line focus:border-neon-blue focus:shadow-neon-blue'
                        } text-text-primary placeholder-text-muted transition-all duration-300 outline-none`}
                        disabled={isSubmitting}
                      />
                      {errors.subject && (
                        <p className="text-neon-pink text-xs mt-1.5 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-neon-pink" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message Field - Flexible Height */}
                    <div className="flex-1 flex flex-col">
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-text-primary">
                        Message <span className="text-neon-pink">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or question..."
                        className={`flex-1 w-full px-4 py-3 rounded-lg bg-bg-void border ${
                          errors.message
                            ? 'border-neon-pink focus:border-neon-pink focus:shadow-neon-pink'
                            : 'border-line focus:border-neon-blue focus:shadow-neon-blue'
                        } text-text-primary placeholder-text-muted transition-all duration-300 outline-none resize-none min-h-[180px]`}
                        disabled={isSubmitting}
                      />
                      <div className="flex justify-between items-center mt-2">
                        {errors.message ? (
                          <p className="text-neon-pink text-xs flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-neon-pink" />
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <p className={`text-xs font-mono ${
                          formData.message.length > 4500 
                            ? 'text-neon-pink' 
                            : 'text-text-muted'
                        }`}>
                          {formData.message.length}/5000
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-violet text-white rounded-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-neon-pink disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            Send Message
                          </>
                        )}
                      </span>
                      
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-violet to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <p className="text-text-muted text-center text-xs">
                      <span className="text-neon-pink">*</span> Required fields
                    </p>
                  </form>
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
