'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, Image as ImageIcon, Star, Globe, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProjectForm from './ProjectForm';
import { useToast } from '@/components/ui/Toast';

const ManageProjects = ({ token, onProjectsChange }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const selectedId = searchParams.get('id');
  const selectedProject = projects.find(p => p._id === selectedId) || null;

  const setView = (newView, id = null) => {
    if (newView === 'list') {
      router.push('/admin/dashboard?tab=projects');
    } else if (newView === 'edit' && id) {
      router.push(`/admin/dashboard?tab=projects&view=edit&id=${id}`);
    } else if (newView === 'add') {
      router.push('/admin/dashboard?tab=projects&view=add');
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
        addToast(`"${title}" deleted.`, 'success');
        if (onProjectsChange) onProjectsChange();
      } else {
        addToast('Failed to delete project.', 'error');
      }
    } catch (err) {
      addToast('Error deleting project.', 'error');
    }
  };

  const quickUpdate = async (project, patch) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...project, ...patch })
      });
      if (res.ok) {
        await fetchProjects();
        if (onProjectsChange) onProjectsChange();
        const msg = patch.status === 'published'
          ? `"${project.title}" published!`
          : patch.featured !== undefined
            ? `"${project.title}" ${patch.featured ? 'marked as featured.' : 'removed from featured.'}`
            : 'Project updated.';
        addToast(msg, 'success');
      }
    } catch (err) {
      addToast('Failed to update project.', 'error');
    }
  };

  if (view === 'add') {
    return (
      <ProjectForm
        token={token}
        onProjectAdded={() => { fetchProjects(); setView('list'); if (onProjectsChange) onProjectsChange(); }}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedProject) {
    return (
      <ProjectForm
        token={token}
        initialData={selectedProject}
        onProjectAdded={() => { fetchProjects(); setView('list'); if (onProjectsChange) onProjectsChange(); }}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button onClick={() => setView('add')} variant="primary" className="text-sm">
          <PlusCircle size={16} className="mr-2" /> Add Project
        </Button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No projects found. Add one above!</div>
        ) : (
          <div className="divide-y divide-white/5">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white/5 transition-colors gap-4"
              >
                {/* Left: Thumbnail + Info */}
                <div className="flex items-center space-x-4">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded-lg border border-white/10 hidden sm:block shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 hidden sm:flex items-center justify-center text-gray-500 shrink-0">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center flex-wrap gap-2">
                      {project.title}
                      {project.featured && (
                        <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">Featured</span>
                      )}
                      {project.status === 'draft' && (
                        <span className="text-[10px] uppercase tracking-wider bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/30">Draft</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-1 max-w-sm">{project.shortDescription}</p>
                    <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-1">
                      <span className="text-xs bg-black/40 text-gray-300 px-2 py-0.5 rounded">{project.category}</span>
                      <span className="text-xs text-gray-600">Order: {project.displayOrder}</span>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        Uploaded: {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
                  {/* View on site */}
                  {project.status !== 'draft' && (
                    <a
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-white/10 rounded-lg transition-colors flex items-center"
                      title="View on Site"
                    >
                      <Globe size={15} className="sm:mr-1.5" />
                      <span className="hidden sm:inline text-sm font-medium">View</span>
                    </a>
                  )}

                  {/* Quick Publish (only for drafts) */}
                  {project.status === 'draft' && (
                    <button
                      onClick={() => quickUpdate(project, { status: 'published' })}
                      className="p-2 text-yellow-400 hover:text-white bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg transition-colors flex items-center"
                      title="Publish Project"
                    >
                      <BookOpen size={15} className="sm:mr-1.5" />
                      <span className="hidden sm:inline text-sm font-medium">Publish</span>
                    </button>
                  )}

                  {/* Quick Featured Toggle */}
                  <button
                    onClick={() => quickUpdate(project, { featured: !project.featured })}
                    className={`p-2 rounded-lg transition-colors flex items-center ${
                      project.featured
                        ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
                        : 'text-gray-400 hover:text-amber-400 bg-black/20 hover:bg-amber-500/10 border border-transparent'
                    }`}
                    title={project.featured ? 'Remove from Featured' : 'Mark as Featured'}
                  >
                    <Star size={15} fill={project.featured ? 'currentColor' : 'none'} className="sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm font-medium">{project.featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => setView('edit', project._id)}
                    className="p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-white/10 rounded-lg transition-colors flex items-center"
                    title="Edit Project"
                  >
                    <Edit2 size={15} className="sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm font-medium">Edit</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(project._id, project.title)}
                    className="p-2 text-gray-400 hover:text-red-400 bg-black/20 hover:bg-red-500/10 rounded-lg transition-colors flex items-center"
                    title="Delete Project"
                  >
                    <Trash2 size={15} className="sm:mr-1.5" />
                    <span className="hidden sm:inline text-sm font-medium">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
