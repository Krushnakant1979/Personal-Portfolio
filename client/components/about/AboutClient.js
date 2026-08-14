'use client';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Download, Zap, Heart, Target, Coffee } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
};

const values = [
  { icon: Zap, title: 'Continuous Learning', desc: 'Technology evolves rapidly. I dedicate time every week to learn new patterns, tools, and best practices to stay at the cutting edge.' },
  { icon: Heart, title: 'User-Centric Design', desc: 'Code is just a tool; the end goal is to serve the user. I always prioritize accessibility, performance, and intuitive interfaces.' },
  { icon: Target, title: 'Problem Solver', desc: 'I thrive on complex challenges. Breaking down problems into manageable pieces and finding elegant solutions is what drives me.' },
  { icon: Coffee, title: 'Attention to Detail', desc: 'From pixel-perfect UI to clean architecture, I care deeply about quality in every part of a project — no shortcuts taken.' },
];

export default function AboutClient({ profile }) {
  const renderAboutText = (text) => {
    if (!text) return <p>About me section is currently empty. Please update it from the admin portal.</p>;
    return text.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index}>
          {parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">

      {/* Hero Section */}
      <div className="mb-10">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">Who I am</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            About <span className="text-gradient">Me</span>
          </h1>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-24 bg-gradient-to-r from-primary to-transparent mb-10"
        />

        {/* About text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="prose prose-invert max-w-none text-gray-300 space-y-5 text-base leading-relaxed"
        >
          {renderAboutText(profile?.about)}
        </motion.div>
      </div>

      {/* Personal Values */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        custom={0}
        className="mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Personal Values <span className="text-gradient">&</span> Approach</h2>
        <p className="text-gray-400 mb-10">The principles that guide how I work and grow.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.5}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="glass p-7 rounded-2xl group cursor-default relative overflow-hidden"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/5 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Download Resume CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="glass p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary/10"
      >
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Interested in working together?</h3>
          <p className="text-gray-400 text-sm">Download my resume to learn more about my experience and skills.</p>
        </div>
        <Button href={profile?.resume || '/resume.pdf'} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Download className="mr-2" size={18} />
          Download Resume
        </Button>
      </motion.div>
    </div>
  );
}
