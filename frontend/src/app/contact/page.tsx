'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendContactMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Mail, MapPin, Clock, Github, Linkedin, Twitter, Copy, Check, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().max(255).optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
  website: z.string().max(0).optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data.website) return; // honeypot
    setSending(true);
    try {
      await sendContactMessage(data);
      toast.success("Message sent! I'll be in touch within 48 hours.");
      reset();
    } catch {
      toast.error('Failed to send message. Please try emailing directly.');
    } finally {
      setSending(false);
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText('merelosjeft@gmail.com');
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        <section className="section">
          <div className="container">
            <p className="eyebrow mb-4">// let&apos;s talk</p>
            <h1 className="heading-1 mb-4">
              Let&apos;s Build Something <span className="text-gradient">Together</span>
            </h1>
            <p className="text-text-muted max-w-2xl leading-relaxed mb-12">
              Have a project in mind? Want to collaborate? Or just want to say hello?
              I&apos;m always up for a conversation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3"
              >
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  {/* Honeypot — hidden from humans */}
                  <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-2">
                        Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="input"
                        placeholder="Jefferson "
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-xs text-neon-pink" role="alert">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="input"
                        placeholder="merelosjeft@gmail.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-xs text-neon-pink" role="alert">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      {...register('subject')}
                      className="input"
                      placeholder="Project inquiry, collaboration..."
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={6}
                      className="textarea"
                      placeholder="Tell me about your project, timeline, and budget..."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1 text-xs text-neon-pink" role="alert">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <span className="animate-spin">⟳</span> Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Direct info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Email */}
                <div className="card">
                  <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-2">Email</p>
                  <div className="flex items-center justify-between gap-2">
                    <a href="mailto:merelosjeft@gmail.com" className="link text-sm font-medium flex items-center gap-2">
                      <Mail size={15} /> merelosjeft@gmail.com
                    </a>
                    <button onClick={copyEmail} aria-label="Copy email address" className="text-text-muted hover:text-neon-pink transition-colors">
                      {copied ? <Check size={15} className="text-neon-blue" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="card">
                  <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-2">Location</p>
                  <p className="text-sm flex items-center gap-2 text-text-primary">
                    <MapPin size={15} className="text-neon-violet" /> Gaway-gaway 1, Uling City of Naga Cebu, Philippines.
                  </p>
                  <p className="text-sm flex items-center gap-2 text-text-muted mt-1">
                    <Clock size={15} /> UTC+0 Timezone
                  </p>
                </div>

                {/* Availability */}
                <div className="card border-neon-blue/30">
                  <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-2">Availability</p>
                  <div className="flex items-center gap-2">
                    <span className="status-dot" aria-hidden="true" />
                    <span className="text-sm text-neon-blue font-medium">Open to new projects</span>
                  </div>
                  <p className="text-xs text-text-muted mt-2">Usually responds within 8-12 hours.</p>
                </div>

                {/* Social links */}
                <div className="card">
                  <p className="font-mono text-xs text-text-muted uppercase tracking-wider mb-3">Find me online</p>
                  <div className="flex gap-3">
                    {[
                      { href: 'https://github.com/jeffdev', label: 'GitHub', Icon: Github },
                      { href: 'https://linkedin.com/in/jeffdev', label: 'LinkedIn', Icon: Linkedin },
                      { href: 'https://twitter.com/jeffdev', label: 'Twitter/X', Icon: Twitter },
                    ].map(({ href, label, Icon }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                        aria-label={label} className="btn-icon w-10 h-10">
                        <Icon size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
