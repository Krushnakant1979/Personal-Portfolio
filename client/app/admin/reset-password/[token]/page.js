'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ResetPassword({ params }) {
  const { token } = use(params);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setStatus('success');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Set New Password</h2>
          <p className="text-gray-400">Please enter your new password below</p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-4">
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-6 rounded-lg flex flex-col items-center">
              <CheckCircle size={48} className="mb-4 text-green-500" />
              <p className="text-lg font-medium mb-2">Password Reset Successful!</p>
              <p className="text-sm">You can now login with your new password.</p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button type="submit" variant="primary" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
