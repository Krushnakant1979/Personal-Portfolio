'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const ProjectForm = ({ token, onProjectAdded, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    fullDescription: initialData?.fullDescription || '',
    category: initialData?.category || 'Full-Stack',
    technologies: initialData?.technologies ? initialData.technologies.join(', ') : '',
    coverImage: initialData?.coverImage || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    featured: initialData?.featured || false,
    displayOrder: initialData?.displayOrder || 0,
    challenges: initialData?.challenges || '',
    outcome: initialData?.outcome || '',
    status: initialData?.status || 'published'
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState(initialData?.screenshots || []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (name === 'coverImage') {
        setImageFile(files[0]);
      } else if (name === 'screenshots') {
        const newFiles = Array.from(files);
        setScreenshotFiles(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setScreenshotPreviews(prev => [...prev, ...newPreviews]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const removeScreenshot = (index) => {
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Helper to generate a slug from the title automatically
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) 
        ? generateSlug(newTitle) 
        : prev.slug
    }));
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    
    // Process technologies string into array
    const techArray = formData.technologies
      .split(/,|\n/)
      .map(t => t.trim())
      .filter(t => t !== '');

    const payload = {
      ...formData,
      technologies: techArray,
      displayOrder: Number(formData.displayOrder),
      status: e.nativeEvent?.submitter?.value || formData.status
    };

    try {
      // 1. Upload Image first if one is selected
      if (imageFile) {
        setStatus('loading');
        setMessage('Uploading image...');
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: imageFormData
        });

        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed');
        }

        // Set the returned Cloudinary URL in our payload
        payload.coverImage = uploadData.url;
      }

      // 2. Upload screenshots if any new ones were selected
      if (screenshotFiles.length > 0) {
        setMessage('Uploading screenshots...');
        const uploadedUrls = [];
        for (const file of screenshotFiles) {
          const ssForm = new FormData();
          ssForm.append('image', file);
          const ssRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: ssForm
          });
          const ssData = await ssRes.json();
          if (ssRes.ok) uploadedUrls.push(ssData.url);
        }
        // Merge existing (non-blob) previews + newly uploaded URLs
        const existingUrls = screenshotPreviews.filter(p => !p.startsWith('blob:'));
        payload.screenshots = [...existingUrls, ...uploadedUrls];
      } else {
        payload.screenshots = screenshotPreviews.filter(p => !p.startsWith('blob:'));
      }

      setMessage('Saving project details...');
      const isEditing = !!initialData;
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${initialData._id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/projects`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'add'} project`);
      }

      setStatus('success');
      setMessage(isEditing ? 'Project updated successfully!' : 'Project added successfully!');
      
      // Reset form
      setFormData({
        title: '', slug: '', shortDescription: '', fullDescription: '',
        category: 'Full-Stack', technologies: '', coverImage: '',
        githubUrl: '', liveUrl: '', featured: false, displayOrder: 0,
        challenges: '', outcome: '', status: 'published'
      });
      setImageFile(null);
      setScreenshotFiles([]);
      setScreenshotPreviews([]);
      
      // Reset file input element if needed
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      if (onProjectAdded) onProjectAdded(data);
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

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
          {initialData ? 'Edit Project' : 'Add New Project'}
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          {initialData ? 'Update the details for this project below.' : 'Fill out the details below to add a new project to your portfolio.'}
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
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Project Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleTitleChange} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">URL Slug *</label>
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Short Description *</label>
            <input type="text" name="shortDescription" required value={formData.shortDescription} onChange={handleChange} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Description *</label>
            <textarea name="fullDescription" required rows="4" value={formData.fullDescription} onChange={handleChange} 
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
            <select name="category" required value={formData.category} onChange={handleChange} 
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all [&>option]:bg-gray-900">
              <option value="Full-Stack">Full-Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Mobile App">Mobile App</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Technologies (comma separated) *</label>
            <input type="text" name="technologies" required value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, MongoDB"
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image (Upload from Device)</label>
            <input type="file" name="coverImage" accept="image/*" onChange={handleChange} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
            <p className="text-xs text-gray-500 mt-2">Optional: Or enter an image URL directly above if not uploading a file.</p>
          </div>

          {/* Screenshots */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Screenshots (Optional — multiple allowed)</label>
            <input type="file" name="screenshots" accept="image/*" multiple onChange={handleChange}
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
            {screenshotPreviews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {screenshotPreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt={`screenshot-${i}`} className="w-24 h-20 object-cover rounded-lg border border-white/10" />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Live Demo URL</label>
            <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
          </div>

          {/* Additional Info */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Challenges</label>
            <textarea name="challenges" rows="2" value={formData.challenges} onChange={handleChange} 
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Outcome</label>
            <textarea name="outcome" rows="2" value={formData.outcome} onChange={handleChange} 
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
          </div>

          {/* Display Settings */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} 
                     className="w-5 h-5 rounded border-white/20 text-primary focus:ring-primary focus:ring-offset-gray-900 bg-black/40" />
              <span className="text-gray-300 font-medium">Featured Project</span>
            </label>
            
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-400">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} min="0"
                     className="w-20 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <Button type="submit" name="submitType" value="published" variant="primary" className="w-full md:w-auto" disabled={status === 'loading'}>
            {status === 'loading' ? 'Saving...' : (initialData ? 'Update & Publish' : 'Publish Project')}
          </Button>
          <Button type="submit" name="submitType" value="draft" variant="outline" className="w-full md:w-auto border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-white" disabled={status === 'loading'}>
            Save as Draft
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

export default ProjectForm;
