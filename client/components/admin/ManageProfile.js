'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Save, User, Mail, Phone, FileText, Upload, Lock, Key } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useToast } from '../ui/Toast';

export default function ManageProfile() {
  const [profile, setProfile] = useState({
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    instagram: '',
    resume: '',
    about: ''
  });
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  // Shared helper — reads auth token from localStorage once
  const getToken = () => {
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      return adminInfo ? JSON.parse(adminInfo).token : '';
    } catch {
      return '';
    }
  };

  const fetchProfile = async (signal) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, { signal });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProfile({
            email: data.email || '',
            phone: data.phone || '',
            github: data.github || '',
            linkedin: data.linkedin || '',
            instagram: data.instagram || '',
            resume: data.resume || '',
            about: data.about || ''
          });
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch profile:', error);
        addToast('Failed to load profile data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast('Please upload a PDF file', 'error');
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('image', file); // API expects 'image' as field name for multer

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, resume: data.url }));
        addToast('Resume uploaded. Remember to save profile.', 'success');
      } else {
        addToast('Failed to upload resume', 'error');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      addToast('An error occurred during upload', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(profile)
      });
      
      if (!res.ok) {
        addToast('Failed to update profile', 'error');
      } else {
        addToast('Profile saved successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 py-10">Loading profile data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <User className="mr-3 text-primary" /> Profile Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Contact Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <Mail size={16} className="mr-2" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="krushna@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <Phone size={16} className="mr-2" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <FileText size={16} className="mr-2" /> Resume (PDF)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer flex items-center justify-center bg-black/20 border border-white/10 border-dashed rounded-lg px-4 py-2.5 text-gray-400 hover:text-white hover:border-primary transition-colors">
                  <Upload size={16} className="mr-2" />
                  <span className="text-sm">
                    {uploadingResume ? 'Uploading...' : 'Choose PDF File'}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={uploadingResume}
                  />
                </label>
                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark transition-colors text-sm font-medium flex-shrink-0 flex items-center"
                  >
                    View Current
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Social Profiles</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <FaLinkedin size={16} className="mr-2" /> LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <FaGithub size={16} className="mr-2" /> GitHub URL
              </label>
              <input
                type="url"
                name="github"
                value={profile.github}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                <FaInstagram size={16} className="mr-2" /> Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                value={profile.instagram}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
          
          {/* About Me Section */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 flex items-center">
              <FileText size={18} className="mr-2" /> About Me (Biography)
            </h3>
            <p className="text-sm text-gray-400">Use line breaks to separate paragraphs. Note: This will be displayed as plain text on your portfolio.</p>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              rows={8}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              placeholder="Hi, I'm Krushnakant Rutele, a passionate Full-Stack developer..."
            />
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            style={{ width: '160px' }}
            className="h-11 rounded-lg font-medium text-sm text-white bg-primary hover:bg-primary-dark shadow-[0_4px_20px_rgba(255,77,77,0.3)] transition-colors duration-200 flex items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-70"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} className="shrink-0" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
