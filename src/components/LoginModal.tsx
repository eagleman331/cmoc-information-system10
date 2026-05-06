import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Facebook, Twitter } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const handleLogin = () => {
    onLogin();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Sign In</h3>
                  <p className="text-slate-500 text-sm">Choose your preferred login method</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleLogin}
                  className="w-full flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <Mail className="text-red-500" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Continue with Gmail</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Google Account</p>
                  </div>
                </button>

                <button 
                  onClick={handleLogin}
                  className="w-full flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <Facebook className="text-blue-600" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Continue with Facebook</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Social Profile</p>
                  </div>
                </button>

                <button 
                  onClick={handleLogin}
                  className="w-full flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <Twitter className="text-slate-900" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Continue with X Account</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Twitter Profile</p>
                  </div>
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-slate-400">
                By signing in, you agree to our <button className="text-slate-600 font-bold hover:underline">Terms of Service</button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
