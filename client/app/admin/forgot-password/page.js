'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-2xl w-full max-w-md"
      >
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white flex items-center transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Login
          </button>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-gray-400">Enter your email to receive a reset link</p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-6 rounded-lg flex flex-col items-center">
              <CheckCircle size={48} className="mb-4 text-green-500" />
              <p className="text-lg font-medium mb-2">Email Sent!</p>
              <p className="text-sm">Check your inbox for the password reset link. It expires in 10 minutes.</p>
            </div>
            <Button onClick={() => router.push('/admin/login')} variant="primary" className="w-full">
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-start text-sm">
                <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>
            
            <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
