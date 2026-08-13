'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const ExperienceForm = ({ token, initialData, onCancel, onExperienceAdded }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'work',
    title: initialData?.title || '',
    company: initialData?.company || '',
    period: initialData?.period || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
    skills: initialData?.skills ? initialData.skills.join(', ') : '',
  });

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    // Process comma separated skills into an array
    const skillsArray = formData.skills
      .split(/,|\n/)
      .map(s => s.trim())
      .filter(s => s !== '');

    const payload = {
      ...formData,
      skills: skillsArray,
    };

    try {
      const isEditing = !!initialData;
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/experience/${initialData._id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/experience`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'add'} experience`);
      }

      setStatus('success');
      setMessage(isEditing ? 'Experience updated successfully!' : 'Experience added successfully!');
      
      // Reset if not editing
      if (!isEditing) {
        setFormData({ type: 'work', title: '', company: '', period: '', startDate: '', description: '', skills: '' });
      }

      if (onExperienceAdded) onExperienceAdded(data);
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center text-white">
          <PlusCircle className="mr-2 text-primary" size={24} /> 
          {initialData ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          {initialData ? 'Update the details for this experience below.' : 'Add a new work or education entry.'}
        </p>
      </div>

      {status === 'success' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-lg mb-6 flex items-center">
          <CheckCircle className="mr-2" size={20} /> {message}
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} /> {message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Type *</label>
            <select name="type" required value={formData.type} onChange={handleChange} 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-gray-900">
              <option value="work">Work Experience</option>
              <option value="education">Education</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title / Degree *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Full-Stack Developer"
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Company / Institution *</label>
            <input type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. Tech Solutions Inc."
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Display Period *</label>
            <input type="text" name="period" required value={formData.period} onChange={handleChange} placeholder="e.g. Jan 2024 - Present"
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Date (For sorting newer entries first) *</label>
            <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange}
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all [color-scheme:dark]" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
            <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} placeholder="Describe your role and accomplishments..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Skills Used (comma separated)</label>
            <textarea name="skills" rows="2" value={formData.skills} onChange={handleChange} placeholder="React, Next.js, Tailwind CSS"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <Button type="submit" variant="primary" className="w-full md:w-auto" disabled={status === 'loading'}>
            {status === 'loading' ? 'Saving...' : (initialData ? 'Update Experience' : 'Add Experience')}
          </Button>
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="outline" className="w-full md:w-auto">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;
