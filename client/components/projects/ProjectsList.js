'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Badge from '@/components/ui/Badge';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function ProjectsList({ initialProjects = [] }) {
  const [filter, setFilter] = useState('All');
  
  // Compute unique categories directly from initialProjects
  const categories = ['All', ...new Set(initialProjects.map(p => p.category))];

  const filteredProjects = filter === 'All' ? initialProjects : initialProjects.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">What I've built</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          My <span className="text-gradient">Projects</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-2xl leading-relaxed">
          Here are some of the projects I've worked on, ranging from full-stack web applications to mobile apps.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === cat
                ? 'text-white shadow-lg shadow-primary/20'
                : 'glass text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {filter === cat && (
              <motion.span
                layoutId="filter-bg"
                className="absolute inset-0 rounded-full bg-primary"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Project Grid */}
      <motion.div
        key={filter}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project._id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass rounded-2xl overflow-hidden group flex flex-col h-full relative"
          >
            {/* Top glow line on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 group-hover:from-black/40 transition-all duration-500" />
              <Image
                src={project.coverImage || '/placeholder.png'}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index < 4}
                className="object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Badges overlaid on image */}
              <div className="absolute top-3 left-3 flex gap-2 z-20">
                <Badge>{project.category}</Badge>
                {project.featured && <Badge className="bg-amber-500/30 text-amber-400 border-amber-500/40">⭐ Featured</Badge>}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                {project.shortDescription}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <Link href={`/projects/${project.slug}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-primary transition-colors duration-200 group/link">
                  View Details
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
                <div className="flex items-center space-x-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors duration-200" title="GitHub">
                      <FaGithub size={17} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors duration-200" title="Live Demo">
                      <ExternalLink size={17} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-24 text-gray-500">
            <p className="text-lg">No projects found for this category.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
