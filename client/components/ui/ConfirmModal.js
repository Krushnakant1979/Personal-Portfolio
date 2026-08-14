'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-gray-300 text-sm leading-relaxed">
              {message}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 space-x-3 bg-white/[0.02] border-t border-white/5">
              <Button variant="outline" onClick={onClose} className="px-4 py-2 border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] border-0' : ''}`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
