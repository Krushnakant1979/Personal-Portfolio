'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIconComponent } from '@/components/ui/IconMap';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`);
        if (res.ok) {
          const data = await res.json();
          setSkillCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">What I know</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5">
          Technical <span className="text-gradient">Skills</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
          I've worked with a variety of technologies across the web and mobile development ecosystem. Here's a categorized overview of my toolkit.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-8 animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-xl mb-6" />
              <div className="h-4 bg-white/10 rounded w-1/2 mb-6" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-6 bg-white/5 rounded-full w-16" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : skillCategories.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No skills added yet.</div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <motion.div
                key={category._id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glass p-7 rounded-2xl group relative overflow-hidden cursor-default"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="text-primary" size={22} />
                    </div>
                    <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">{category.title}</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, si) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: si * 0.04 }}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/8 hover:bg-primary/15 hover:text-white hover:border-primary/30 transition-all duration-200 cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
