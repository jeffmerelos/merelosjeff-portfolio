'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getSkills } from '@/lib/api';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Code } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_name: string;
  color: string;
  is_featured: boolean;
}

export default function AboutPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSkills()
      .then((skillsData) => {
        setSkills(skillsData.skills || []);
      })
      .catch((error) => {
        console.error('Error loading skills:', error);
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle scroll detection for story container
  const handleStoryScroll = () => {
    if (storyContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = storyContainerRef.current;
      // Check if scrolled to near the end (within 50px)
      const isAtEnd = scrollHeight - scrollTop - clientHeight < 50;
      setIsScrolledToEnd(isAtEnd);
    }
  };

  // Hardcoded profile data
  const profile = {
    full_name: 'Jefferson Bacaro Merelos',
    title: 'Junior Software Developer',
    location: 'Gaway-gaway, Uling City of Naga, Cebu Philippines',
    timezone: 'UTC+8 (Philippine Time)',
    email: 'merelosjeff@gmail.com',
    availability_status: 'available' as const,
    resume_url: '/files/Jeff-CV.pdf',
  };

  const availabilityColors = {
    available: 'text-green-400',
    busy: 'text-yellow-400',
    not_available: 'text-red-400'
  };

  const availabilityLabels = {
    available: 'Available for work',
    busy: 'Currently busy',
    not_available: 'Not available'
  };

  const featuredSkills = skills.filter(skill => skill.is_featured);

  return (
    <div id="top">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <p className="eyebrow mb-4">// about me</p>
              <h1 className="heading-1 mb-6 text-balance">
                Hi, I'm <span className="text-gradient">Jefferson B. Merelos</span>
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Avatar & Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-1"
                >
                  <div className="card text-center mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-pink to-neon-violet flex items-center justify-center text-2xl font-display font-bold overflow-hidden">
                      <img 
                        src="/images/profile2.png" 
                        alt={profile.full_name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="font-display font-bold text-lg mb-1">{profile.full_name}</h2>
                    <p className="text-neon-violet text-sm mb-3">{profile.title}</p>
                    
                    <div className={`flex items-center justify-center gap-2 mb-4 ${availabilityColors[profile.availability_status]}`}>
                      <div className="status-dot"></div>
                      <span className="font-mono text-xs">{availabilityLabels[profile.availability_status]}</span>
                    </div>

                    <div className="space-y-2 text-sm text-text-muted">
                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <a href={`mailto:${profile.email}`} className="link">{profile.email}</a>
                      </div>
                    </div>

                    {profile.resume_url && (
                      <a href={profile.resume_url} download className="btn-primary w-full mt-2 whitespace-nowrap inline-flex items-center justify-center gap-2">
                        <Download size={16} />
                        <span>Download My Resume</span>
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Bio Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <div className="card mb-6 h-full flex flex-col">
                    <h3 className="eyebrow mb-4">My Story</h3>
                    <div 
                      ref={storyContainerRef}
                      onScroll={handleStoryScroll}
                      className="prose prose-invert max-w-none flex-1 overflow-y-auto pr-3"
                    >
                      <p className="text-text-muted leading-relaxed mb-4">
                        Hello! I'm Jefferson Bacaro Merelos, a passionate Software Developer and a graduate of Cebu Technological University – Naga Extension Campus, where I earned my Bachelor of Science in Information Technology, Major in Programming.
                      </p>
                      
                      <p className="text-text-muted leading-relaxed mb-4">
                        I am passionate about building modern web applications that solve real-world problems and create meaningful experiences for users. I enjoy turning ideas into practical digital solutions by developing secure, efficient, and user-friendly applications that address real needs. Every project I work on is an opportunity to learn, improve, and create software that makes a positive impact.
                      </p>
                      
                      <p className="text-text-muted leading-relaxed mb-4">
                        My technical experience includes working with Next.js, Node.js, React, JavaScript, PHP, MySQL, Supabase, REST APIs, Git, and GitHub, allowing me to build responsive and scalable applications while continuously expanding my knowledge of modern web technologies. I am always eager to learn new tools, embrace new challenges, and grow as a software developer.
                      </p>
                      
                      <p className="text-text-muted leading-relaxed mb-4">
                        One of the projects I am most proud of is a Web-Based Time In and Out System with Face Recognition and SMS Verification, developed to enhance student safety and attendance monitoring. The system combines RFID authentication, facial recognition, and real-time SMS notifications to provide a secure and efficient solution for educational institutions. I am especially proud that we successfully deployed and implemented this system at Mohon Divino (Amore) National High School, located in Mohon, Talisay City, Cebu. Witnessing the system transition from development to real-world implementation was an incredibly rewarding experience, as it demonstrated how our work could positively impact the school's daily operations and improve the safety and efficiency of student attendance monitoring. This achievement strengthened my confidence as a developer and reinforced my passion for building innovative, reliable, and user-centered solutions that create meaningful value in real-world environments.
                      </p>
                      
                      <p className="text-text-muted leading-relaxed mb-4">
                        I believe technology has the power to improve lives and solve real-world challenges. My goal is to continue developing innovative web applications, collaborate with talented teams, and contribute to projects that make a meaningful difference. I am committed to continuous learning, writing clean and maintainable code, and delivering high-quality software solutions.
                      </p>
                      
                      <p className="text-text-muted leading-relaxed">
                        To learn more about my education, technical skills, projects, and experience, please feel free to explore my Curriculum Vitae (CV).
                      </p>
                    </div>
                    
                    {/* Reading Indicator */}
                    <div className="mt-4 pt-4 border-t border-line">
                      <p className={`text-xs font-mono transition-all duration-300 ${
                        isScrolledToEnd 
                          ? 'text-neon-blue' 
                          : 'text-neon-pink animate-pulse'
                      }`}>
                        {isScrolledToEnd 
                          ? '✓ You\'ve reached the end of Jeff\'s story.' 
                          : '↓ Continue reading Jeff\'s story...'}
                      </p>
                    </div>
                  </div>

                  {/* Featured Skills */}
                  {!loading && featuredSkills.length > 0 && (
                    <div className="card">
                      <h3 className="eyebrow mb-4">Core Technologies</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {featuredSkills.map((skill, i) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.05) }}
                            className="text-center p-3 rounded-lg border border-line hover:border-neon-pink/50 transition-colors"
                          >
                            <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                              <Code size={20} style={{ color: skill.color || '#9D4EDD' }} />
                            </div>
                            <div className="font-mono text-xs font-bold mb-1">{skill.name}</div>
                            <div className="text-text-muted text-xs">{skill.proficiency}%</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-bg-panel/30">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="heading-2 mb-4">
                Let's Build Something <span className="text-gradient">Amazing</span>
              </h2>
              <p className="text-text-muted leading-relaxed mb-8">
                I'm always excited to work on new projects and solve interesting problems.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/contact" className="btn-primary">
                  <Mail size={18} /> Get In Touch
                </a>
                <a href="/projects" className="btn-secondary">
                  <Code size={18} /> View My Work
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}