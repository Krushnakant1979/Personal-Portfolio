'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import {
  LogOut, Trash2, CheckCircle, Mail, MessageSquare, Briefcase, ArrowLeft,
  Code, Database, Star, Eye, ExternalLink, RefreshCw, Reply, LayoutDashboard,
  FolderOpen, FileText
} from 'lucide-react';
import { User } from 'lucide-react';
import dynamic from 'next/dynamic';

const ManageProjects = dynamic(() => import('@/components/admin/ManageProjects'), {
  loading: () => <div className="p-10 text-center text-gray-400">Loading Projects...</div>
});
const ManageSkills = dynamic(() => import('@/components/admin/ManageSkills'), {
  loading: () => <div className="p-10 text-center text-gray-400">Loading Skills...</div>
});
const ManageExperience = dynamic(() => import('@/components/admin/ManageExperience'), {
  loading: () => <div className="p-10 text-center text-gray-400">Loading Experience...</div>
});
const ManageProfile = dynamic(() => import('@/components/admin/ManageProfile'), {
  loading: () => <div className="p-10 text-center text-gray-400">Loading Profile...</div>
});


function DashboardContent() {
  const [admin, setAdmin] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tab) => {
    router.push(`/admin/dashboard?tab=${tab}`);
  };

  const handleAuthError = (res) => {
    if (res.status === 401) {
      addToast('Session expired. Please log in again.', 'error');
      localStorage.removeItem('adminInfo');
      router.push('/admin/login');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
      return;
    }
    const parsedAdmin = JSON.parse(adminInfo);
    setAdmin(parsedAdmin);
    fetchContacts(parsedAdmin.token);
    fetchAllProjects(parsedAdmin.token);
  }, [router]);

  const fetchContacts = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (handleAuthError(res)) return;
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    router.push('/');
  };

  const markContact = async (id, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
        addToast(`Message marked as ${newStatus}.`, 'success');
      }
    } catch (err) {
      addToast('Failed to update message.', 'error');
    }
  };

  const confirmDeleteContact = (id) => {
    setContactToDelete(id);
    setDeleteModalOpen(true);
  };

  const deleteContact = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${contactToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${admin.token}` }
      });
      if (res.ok) {
        setContacts(contacts.filter(c => c._id !== contactToDelete));
        addToast('Message deleted.', 'success');
      }
    } catch (err) {
      addToast('Failed to delete message.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  const quickUpdateProject = async (id, patch) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify(patch)
      });
      if (res.ok) {
        await fetchAllProjects(admin.token);
        addToast('Project updated.', 'success');
      }
    } catch (err) {
      addToast('Failed to update project.', 'error');
    }
  };

  if (loading || !admin) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  const getFilteredContacts = () => {
    if (filter === 'all') return contacts;
    const now = new Date();
    return contacts.filter(contact => {
      const contactDate = new Date(contact.createdAt?._seconds ? contact.createdAt._seconds * 1000 : contact.createdAt);
      if (filter === 'today') return contactDate.toDateString() === now.toDateString();
      if (filter === 'month') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        return contactDate >= thirtyDaysAgo;
      }
      return true;
    });
  };

  const filteredContacts = getFilteredContacts();
  const unreadCount = contacts.filter(c => c.status === 'new').length;
  const draftCount = allProjects.filter(p => p.status === 'draft').length;
  const publishedCount = allProjects.filter(p => p.status !== 'draft').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} />, badge: unreadCount },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} /> },
    { id: 'skills', label: 'Skills', icon: <Database size={16} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white flex items-center transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {admin.name}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab navigation */}
          <div className="flex flex-wrap bg-black/40 p-1 rounded-lg border border-white/10 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all relative ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Logout — always visible */}
          <Button onClick={handleLogout} variant="outline" className="text-sm border-white/10 flex items-center">
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
          {/* PROFILE TAB */}
          {activeTab === 'profile' && <ManageProfile />}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <LayoutDashboard className="text-primary" /> Dashboard Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Published Projects', value: publishedCount, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', tab: 'projects' },
                  { label: 'Draft Projects', value: draftCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', tab: 'projects' },
                  { label: 'Unread Messages', value: unreadCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', tab: 'messages' },
                  { label: 'Total Messages', value: contacts.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', tab: 'messages' },
                ].map(stat => (
                  <button
                    key={stat.label}
                    onClick={() => setActiveTab(stat.tab)}
                    className={`glass border ${stat.bg} rounded-xl p-5 text-left hover:scale-[1.02] transition-transform`}
                  >
                    <p className="text-gray-400 text-xs mb-2">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" /> Recent Messages
                  </h3>
                  {contacts.slice(0, 4).map(c => (
                    <div key={c._id} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.subject}</p>
                      </div>
                      {c.status === 'new' && <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">New</Badge>}
                    </div>
                  ))}
                  {contacts.length === 0 && <p className="text-gray-400 text-sm">No messages yet.</p>}
                  <button onClick={() => setActiveTab('messages')} className="mt-3 text-xs text-primary hover:text-white transition-colors flex items-center gap-1">
                    View all messages <ExternalLink size={12} />
                  </button>
                </div>

                {/* Recent Projects */}
                <div className="glass rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FolderOpen size={18} className="text-primary" /> Recent Projects
                  </h3>
                  {allProjects.slice(0, 4).map(p => (
                    <div key={p._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{p.title}</p>
                      {p.status === 'draft'
                        ? <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px]">Draft</Badge>
                        : <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-[10px]">Published</Badge>
                      }
                    </div>
                  ))}
                  {allProjects.length === 0 && <p className="text-gray-400 text-sm">No projects yet.</p>}
                  <button onClick={() => setActiveTab('projects')} className="mt-3 text-xs text-primary hover:text-white transition-colors flex items-center gap-1">
                    Manage projects <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <MessageSquare className="mr-2 text-primary" /> Messages
                  {unreadCount > 0 && <span className="ml-3 text-sm font-normal text-red-400">({unreadCount} unread)</span>}
                </h2>
                <div className="flex space-x-2 bg-black/20 p-1 rounded-full border border-white/10">
                  {['all', 'today', 'month'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`text-xs px-4 py-1.5 rounded-full transition-colors capitalize ${filter === f ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
                    >
                      {f === 'month' ? 'Last 30 Days' : f === 'all' ? 'All' : 'Today'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl overflow-hidden">
                {filteredContacts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No messages match this filter.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredContacts.map((contact) => (
                      <div key={contact._id} className={`p-6 transition-colors ${contact.status === 'new' ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-white/5'}`}>
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                          <div>
                            <div className="flex items-center space-x-3 mb-1 flex-wrap gap-2">
                              <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                              {contact.status === 'new' && <Badge className="bg-primary/20 text-primary border-primary/30">New</Badge>}
                              {contact.status === 'read' && <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Read</Badge>}
                            </div>
                            <a href={`mailto:${contact.email}`} className="text-sm text-gray-400 flex items-center hover:text-primary transition-colors">
                              <Mail size={14} className="mr-1" /> {contact.email}
                            </a>
                          </div>
                          <div className="text-xs text-gray-500">{new Date(contact.createdAt?._seconds ? contact.createdAt._seconds * 1000 : contact.createdAt).toLocaleDateString()}</div>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg mb-4 border border-white/5">
                          <p className="text-sm font-semibold text-white mb-2">Subject: {contact.subject}</p>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{contact.message}</p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Reply */}
                          <a
                            href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
                            className="text-xs font-medium text-blue-400 hover:text-white flex items-center transition-colors bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg"
                          >
                            <Reply size={13} className="mr-1" /> Reply
                          </a>

                          {/* Mark as Read / Unread toggle */}
                          {contact.status === 'new' ? (
                            <button
                              onClick={() => markContact(contact._id, 'read')}
                              className="text-xs font-medium text-primary hover:text-white flex items-center transition-colors"
                            >
                              <CheckCircle size={14} className="mr-1" /> Mark as Read
                            </button>
                          ) : (
                            <button
                              onClick={() => markContact(contact._id, 'new')}
                              className="text-xs font-medium text-gray-400 hover:text-white flex items-center transition-colors"
                            >
                              <RefreshCw size={13} className="mr-1" /> Mark as Unread
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => confirmDeleteContact(contact._id)}
                            className="text-xs font-medium text-red-400 hover:text-white flex items-center transition-colors ml-auto"
                          >
                            <Trash2 size={13} className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <section>
              <ManageProjects token={admin.token} onProjectsChange={() => fetchAllProjects(admin.token)} />
            </section>
          )}

          {activeTab === 'skills' && (
            <section><ManageSkills token={admin.token} /></section>
          )}

          {activeTab === 'experience' && (
            <section><ManageExperience token={admin.token} /></section>
          )}
        </motion.div>
      </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/80" />
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <Trash2 className="text-red-500" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Delete Message</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Are you sure you want to delete this message? This action cannot be undone and the message will be permanently removed.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => { setDeleteModalOpen(false); setContactToDelete(null); }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={deleteContact}
                  disabled={isDeleting}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 size={16} /> Delete Message</>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
