'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { getIconComponent } from '@/components/ui/IconMap';
import Button from '@/components/ui/Button';
import SkillForm from './SkillForm';

const ManageSkills = ({ token }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';
  const selectedId = searchParams.get('id');
  const selectedSkill = skills.find(s => s._id === selectedId) || null;

  const setView = (newView, id = null) => {
    if (newView === 'list') {
      router.push('/admin/dashboard?tab=skills');
    } else if (newView === 'edit' && id) {
      router.push(`/admin/dashboard?tab=skills&view=edit&id=${id}`);
    } else if (newView === 'add') {
      router.push('/admin/dashboard?tab=skills&view=add');
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Failed to fetch skills', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the "${title}" category? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSkills(skills.filter(s => s._id !== id));
      } else {
        alert('Failed to delete skill category');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting skill category');
    }
  };

  if (view === 'add') {
    return (
      <SkillForm 
        token={token} 
        onSkillAdded={() => { fetchSkills(); setView('list'); }} 
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedSkill) {
    return (
      <SkillForm 
        token={token} 
        initialData={selectedSkill}
        onSkillAdded={() => { fetchSkills(); setView('list'); }} 
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Skills</h2>
        <Button onClick={() => setView('add')} variant="primary" className="text-sm">
          <PlusCircle size={16} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading skills...</div>
        ) : skills.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No skill categories found. Add one above!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {skills.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              
              return (
                <div key={category._id} className="p-6 bg-black/20 hover:bg-white/5 border border-white/5 rounded-xl transition-colors relative group">
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setView('edit', category._id)}
                      className="p-1.5 text-gray-400 hover:text-white bg-black/40 hover:bg-white/10 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category._id, category.title)}
                      className="p-1.5 text-gray-400 hover:text-red-400 bg-black/40 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className="text-primary" size={24} />
                    <h3 className="text-lg font-bold text-white">{category.title}</h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {category.skills.map(skill => (
                      <li key={skill} className="text-gray-400 text-sm flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:mr-2">
                        {skill}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
                    Display Order: {category.displayOrder}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSkills;
