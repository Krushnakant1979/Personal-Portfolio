'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`);
        if (res.ok) {
          const data = await res.json();
          setExperiences(data);
        }
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const filtered = activeTab === 'all' ? experiences : experiences.filter(e => e.type === activeTab);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'work', label: 'Work', icon: Briefcase },
    { key: 'education', label: 'Education', icon: GraduationCap },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14"
      >
        <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">My Journey</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5">
          Experience <span className="text-gradient">&</span> Education
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          My professional journey and academic background — the path that shaped who I am as a developer.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center gap-3 mb-14"
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key ? 'text-white shadow-lg shadow-primary/20' : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === tab.key && (
              <motion.span
                layoutId="exp-filter-bg"
                className="absolute inset-0 rounded-full bg-primary"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-1/4 mb-4" />
              <div className="h-5 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-3 bg-white/5 rounded w-full mb-1" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-500">No entries found.</div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-white/10 to-transparent" />

          <div className="space-y-8 pl-16 sm:pl-20">
            {filtered.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[46px] sm:-left-[54px] top-5 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_12px_rgba(255,77,77,0.4)] z-10 group-hover:scale-125 transition-transform duration-300">
                  {exp.type === 'work' ? (
                    <Briefcase size={10} className="text-primary" />
                  ) : (
                    <GraduationCap size={10} className="text-primary" />
                  )}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="glass p-6 rounded-2xl relative overflow-hidden"
                >
                  {/* Top border glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/60 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${exp.type === 'work' ? 'bg-primary/15 border border-primary/25' : 'bg-blue-500/15 border border-blue-500/25'}`}>
                        {exp.type === 'work' ? (
                          <Briefcase size={13} className="text-primary" />
                        ) : (
                          <GraduationCap size={13} className="text-blue-400" />
                        )}
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${exp.type === 'work' ? 'text-primary' : 'text-blue-400'}`}>
                        {exp.type === 'work' ? 'Work Experience' : 'Education'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs gap-1">
                      <Calendar size={11} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-0.5">{exp.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                    <MapPin size={12} />
                    <span>{exp.company}</span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{exp.description}</p>

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/8 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
