'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import Button from '@/components/ui/Button';
import ExperienceForm from './ExperienceForm';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function ManageExperience({ token }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`);
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Failed to fetch experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchExperiences();
    return () => controller.abort();
  }, []);

  const requestDelete = (exp) => {
    setExperienceToDelete(exp);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete) return;
    const { _id } = experienceToDelete;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setExperiences(experiences.filter(exp => exp._id !== _id));
      } else {
        alert('Failed to delete experience');
      }
    } catch (err) {
      console.error('Error deleting experience:', err);
      alert('An error occurred while deleting');
    }
    setExperienceToDelete(null);
  };

  const handleEdit = (exp) => {
    setSelectedExperience(exp);
    setView('edit');
  };

  const handleExperienceAdded = () => {
    fetchExperiences();
    setView('list');
  };

  if (view === 'add') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ExperienceForm 
          token={token} 
          onCancel={() => setView('list')} 
          onExperienceAdded={handleExperienceAdded}
        />
      </motion.div>
    );
  }

  if (view === 'edit' && selectedExperience) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ExperienceForm 
          token={token} 
          initialData={selectedExperience}
          onCancel={() => setView('list')} 
          onExperienceAdded={handleExperienceAdded}
        />
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Experience</h2>
        <Button onClick={() => setView('add')} variant="primary" className="flex items-center text-sm py-2">
          <Plus size={16} className="mr-2" /> Add Entry
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading experience data...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="glass p-10 text-center rounded-xl">
          <p className="text-gray-400 mb-4">No experience entries found.</p>
          <Button onClick={() => setView('add')} variant="primary">
            Add Your First Entry
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between group"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`p-1.5 rounded-lg ${exp.type === 'work' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'}`}>
                    {exp.type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                  </span>
                  <span className="text-sm font-medium text-gray-400 flex items-center">
                    <Calendar size={14} className="mr-1" /> {exp.period}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                <h4 className="text-primary font-medium text-sm mb-3">{exp.company}</h4>
                
                <p className="text-gray-400 text-sm line-clamp-2 max-w-3xl">
                  {exp.description}
                </p>
              </div>

              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:ml-6 shrink-0">
                <Button 
                  onClick={() => handleEdit(exp)} 
                  variant="outline" 
                  className="p-2 border-white/10 hover:border-white/30 text-gray-300 hover:text-white"
                  title="Edit entry"
                >
                  <Edit2 size={16} />
                </Button>
                <Button 
                  onClick={() => requestDelete(exp)} 
                  variant="outline" 
                  className="p-2 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Experience"
        message={`Are you sure you want to delete the "${experienceToDelete?.title}" experience entry? This cannot be undone.`}
        confirmText="Delete Entry"
        type="danger"
      />
    </div>
  );
}
