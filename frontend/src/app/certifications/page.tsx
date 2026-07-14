'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getCertifications } from '@/lib/api';
import { motion } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';

interface Certification {
  id: number;
  title: string;
  issuing_org: string;
  org_logo_url: string;
  badge_image_url: string;
  issue_date: string;
  expiry_date: string | null;
  verify_url: string;
  category: string;
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertifications()
      .then(setCerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        <section className="section">
          <div className="container">
            <p className="eyebrow mb-4">// credentials</p>
            <h1 className="heading-1 mb-4">
              <span className="text-gradient">Certifications</span> &amp; Achievements
            </h1>
            <p className="text-text-muted max-w-2xl leading-relaxed mb-12">
              Industry-recognized certifications and achievements that validate expertise across cloud, web, and database technologies.
            </p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certs.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="card-hover"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-bg-void rounded-lg flex items-center justify-center border border-line flex-shrink-0">
                        {cert.badge_image_url ? (
                          <img src={cert.badge_image_url} alt={`${cert.title} badge`} className="w-8 h-8 object-contain" />
                        ) : (
                          <Award size={20} className="text-neon-violet" />
                        )}
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-text-primary text-sm leading-tight">{cert.title}</h2>
                        <p className="font-mono text-xs text-neon-violet mt-1">{cert.issuing_org}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-mono text-xs text-text-muted">
                        Issued {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>

                      {cert.verify_url && (
                        <a
                          href={cert.verify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Verify ${cert.title} certificate`}
                          className="flex items-center gap-1 text-xs text-neon-blue hover:text-neon-pink transition-colors"
                        >
                          Verify <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
