'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Target, Trophy } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const RenderFormattedText = ({ text }) => {
  if (!text) return null;
  
  return (
    <div className="space-y-4">
      {text.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;
        
        // Detect if admin already added their own bullet points (-, *, or •)
        const isBullet = /^[-*•]\s+/.test(trimmedLine);
        const cleanLine = isBullet ? trimmedLine.replace(/^[-*•]\s+/, '') : trimmedLine;

        return (
          <div key={index} className="flex items-start">
            <span className="text-primary mr-3 mt-1.5 flex-shrink-0 text-xl leading-none">•</span>
            <p className="leading-relaxed text-gray-300">{cleanLine}</p>
          </div>
        );
      })}
    </div>
  );
};

export default function ProjectDetailClient({ project }) {
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Project not found</h1>
        <Button href="/projects" variant="secondary">Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
      <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" />
        Back to all projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
          {/* Left Column: Text & Actions */}
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge>{project.category}</Badge>
              {project.featured && <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Featured</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">{project.title}</h1>
            
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <Button href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                  <FaGithub size={20} className="mr-2" />
                  View Source
                </Button>
              )}
              {project.liveUrl && (
                <Button href={project.liveUrl} target="_blank" rel="noopener noreferrer" variant="primary">
                  <ExternalLink size={20} className="mr-2" />
                  Live Demo
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20">
            <Image 
              src={project.coverImage || '/placeholder.png'} 
              alt={project.title} 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Target className="mr-3 text-primary" /> Overview
              </h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <RenderFormattedText text={project.fullDescription} />
              </div>
            </section>

            {project.challenges && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Trophy className="mr-3 text-primary" /> Challenges
                </h2>
                <div className="glass p-6 rounded-xl text-gray-300">
                  <RenderFormattedText text={project.challenges} />
                </div>
              </section>
            )}

            {project.outcome && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Calendar className="mr-3 text-primary" /> Outcome
                </h2>
                <div className="glass p-6 rounded-xl text-gray-300 border-l-4 border-l-primary">
                  <p>{project.outcome}</p>
                </div>
              </section>
            )}
          </div>

          <div>
            <div className="glass p-6 rounded-2xl sticky top-24">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Technologies Used</h3>
              <ul className="space-y-3">
                {project.technologies.map((tech) => (
                  <li key={tech} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
