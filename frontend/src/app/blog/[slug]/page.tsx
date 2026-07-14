import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getBlogPost, getBlogPosts } from '@/lib/api';
import { Clock, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  read_time_minutes: number;
  published_at: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug);
    
    return {
      title: `${post.title} — Jeff Developer Blog`,
      description: post.excerpt || 'Blog post by Jeff Developer',
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
        type: 'article',
        publishedTime: post.published_at,
      },
    };
  } catch {
    return {
      title: 'Post Not Found — Jeff Developer Blog',
      description: 'The requested blog post could not be found.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post: BlogPost) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  let post: BlogPost;
  
  try {
    post = await getBlogPost(params.slug);
  } catch {
    notFound();
  }

  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        {/* Back Navigation */}
        <section className="py-8">
          <div className="container">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-pink transition-colors">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <article className="pb-24">
          <header className="section">
            <div className="container max-w-4xl">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="font-mono text-xs text-neon-violet border border-neon-violet/30 rounded px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="heading-1 mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-text-muted leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-sm text-text-muted mb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {publishedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {post.read_time_minutes} min read
                </div>
              </div>

              {/* Cover Image */}
              {post.cover_image_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-8 border border-line">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <section className="section">
            <div className="container max-w-4xl">
              <div className="card">
                {post.content ? (
                  <div 
                    className="prose prose-invert prose-pink max-w-none prose-headings:font-display prose-headings:text-gradient prose-a:text-neon-blue prose-a:no-underline hover:prose-a:text-neon-pink prose-strong:text-text-primary prose-code:text-neon-violet prose-code:bg-bg-panel prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-bg-void prose-pre:border prose-pre:border-line prose-blockquote:border-l-2 prose-blockquote:border-neon-pink prose-blockquote:text-text-muted"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="font-mono text-text-muted mb-4">// Content coming soon</p>
                    <p className="text-text-muted text-sm">
                      This post is still being written. Check back later for the full content.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="section border-t border-line bg-bg-panel/30">
            <div className="container max-w-4xl">
              <div className="flex justify-between items-center">
                <Link href="/blog" className="btn-secondary">
                  <ArrowLeft size={18} />
                  All Posts
                </Link>
                
                <div className="flex gap-3">
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    title="Share on Twitter"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    title="Share on LinkedIn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}