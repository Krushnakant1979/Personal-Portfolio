'use client';
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  // Only one toast at a time — stored as a single object or null
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const addToast = useCallback((message, type = 'success') => {
    // Clear any existing auto-dismiss timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Replace whatever is showing with the new toast
    // Give it a new key each time so AnimatePresence animates the swap
    const id = Date.now().toString();
    setToast({ id, message, type });

    // Auto-dismiss after 4 seconds
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const icons = {
    success: <CheckCircle size={18} className="text-green-400 shrink-0" />,
    error:   <AlertCircle size={18} className="text-red-400 shrink-0" />,
    info:    <Info        size={18} className="text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-green-500/30 bg-green-500/10',
    error:   'border-red-500/30 bg-red-500/10',
    info:    'border-blue-500/30 bg-blue-500/10',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none max-w-sm w-full">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 10,  scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className={`pointer-events-auto glass border rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl ${borders[toast.type]}`}
            >
              {icons[toast.type]}
              <p className="text-sm text-white flex-1">{toast.message}</p>
              <button
                onClick={dismissToast}
                className="text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
