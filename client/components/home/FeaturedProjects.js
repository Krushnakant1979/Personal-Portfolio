'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will fetch from API later, for now we will just use a hardcoded mock or handle empty state.
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.filter(p => p.featured).slice(0, 3));
        } else {
          console.error("Server returned an error:", res.status);
        }
      } catch (err) {
        console.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-gray-400 max-w-2xl">
              A selection of my best work across web and mobile development.
            </p>
          </div>
          <Link href="/projects" className="hidden md:flex items-center text-primary hover:text-white transition-colors group">
            View All Projects
            <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No featured projects yet. Mark a project as featured from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="glass rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors flex flex-col h-full"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <Image 
                    src={project.coverImage || '/placeholder.png'} 
                    alt={project.title} 
                    fill 
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>{project.category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">
                    {project.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <Link href={`/projects/${project.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                      View Details →
                    </Link>
                    <div className="flex space-x-3">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                          <FaGithub size={18} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Button href="/projects" variant="outline" className="w-full">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
