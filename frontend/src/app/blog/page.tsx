'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/api';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  tags: string[];
  read_time_minutes: number;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        <section className="section">
          <div className="container">
            <p className="eyebrow mb-4">// writing</p>
            <h1 className="heading-1 mb-4">
              The <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-text-muted max-w-2xl leading-relaxed mb-12">
              Thoughts on web development, software engineering, and building things that last.
            </p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card h-48 animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 card">
                <p className="font-mono text-text-muted">// No posts published yet — check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="card-hover overflow-hidden p-0"
                  >
                    {post.cover_image_url && (
                      <div className="h-48 overflow-hidden">
                        <img src={post.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="font-mono text-xs text-neon-violet border border-neon-violet/30 rounded px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-display font-bold text-lg text-text-primary hover:text-neon-pink transition-colors mb-2">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-text-muted text-sm line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 font-mono text-xs text-text-muted">
                          <Clock size={12} />
                          {post.read_time_minutes} min read
                        </div>
                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-sm text-neon-blue hover:text-neon-pink transition-colors">
                          Read more <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
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
