'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIconComponent } from '@/components/ui/IconMap';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -20 },
  show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

const SkillsHighlight = ({ initialSkills = [] }) => {
  const skillCategories = initialSkills;
  const loading = false;

  return (
    <section className="py-24 relative bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Technical <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-gray-400">
            A versatile skill set spanning modern web technologies and mobile app development, enabling me to build end-to-end solutions.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading skills...</div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No skills added yet.</div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {skillCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <motion.div
                  key={category._id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="glass p-6 rounded-2xl cursor-default"
                >
                  <motion.div variants={iconVariants}>
                    <IconComponent className="text-primary mb-4" size={32} />
                  </motion.div>
                  <h3 className="text-lg font-bold mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.skills.map(skill => (
                      <li key={skill} className="text-gray-400 text-sm flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-2">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsHighlight;
