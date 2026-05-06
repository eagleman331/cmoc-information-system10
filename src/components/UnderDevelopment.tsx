import React from 'react';
import { motion } from 'motion/react';
import { Construction, ArrowLeft, Hammer, Wrench, HardHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative inline-block">
          <div className="bg-amber-100 p-8 rounded-[2.5rem] relative z-10">
            <Construction size={64} className="text-amber-600 mx-auto" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 bg-emerald-100 p-3 rounded-2xl z-20"
          >
            <Settings size={24} className="text-emerald-600" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 -left-4 bg-blue-100 p-3 rounded-2xl z-20"
          >
            <HardHat size={24} className="text-blue-600" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Under <span className="text-amber-600">Development</span>
          </h1>
          <p className="text-slate-600 leading-relaxed">
            We're currently building out the detailed analytics for this category. Our team is working hard to bring you comprehensive civil data insights.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-center gap-4 py-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Hammer size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Building</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Wrench size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Refining</span>
            </div>
          </div>

          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Helper component for the animation
const Settings = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
