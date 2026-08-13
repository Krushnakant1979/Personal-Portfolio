'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Email</h3>
                    <a href={`mailto:${profile?.email || 'krushnakantrutele1979@gmail.com'}`} className="text-white hover:text-primary transition-colors font-medium break-all">
                      {profile?.email || 'krushnakantrutele1979@gmail.com'}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Phone</h3>
                    <a href={`tel:${profile?.phone || '+918530604630'}`} className="text-white hover:text-primary transition-colors font-medium">
                      {profile?.phone || '+91 8530604630'}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Location</h3>
                    <p className="text-white font-medium">
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass p-8 rounded-2xl bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold mb-2">Available for Work</h3>
              <p className="text-gray-400">
                I'm currently available for freelance projects and full-time roles. Let's build something amazing together.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 md:p-10 rounded-2xl h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              
              {/* Honeypot field (hidden) */}
              <div className="hidden" aria-hidden="true">
                <input type="text" name="honeypot" tabIndex="-1" autoComplete="off" value={formData.honeypot} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="mb-8 flex-grow">
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-full min-h-[150px]"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-auto pt-6">
                <Button type="submit" variant="primary" disabled={status === 'loading'} className={status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}>
                  {status === 'loading' ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message <Send size={18} className="ml-2" />
                    </span>
                  )}
                </Button>

                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center text-green-400 text-sm">
                    <CheckCircle size={16} className="mr-1" /> Message sent!
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center text-red-400 text-sm">
                    <AlertCircle size={16} className="mr-1" /> {errorMessage}
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
