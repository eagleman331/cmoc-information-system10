import React, { useState } from 'react';
import { Mail, Facebook, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQContact = () => {
  const [showSupport, setShowSupport] = useState(false);

  const playSupportSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.error('Audio context not supported', e);
    }
  };

  const handleContactClick = () => {
    playSupportSound();
    setShowSupport(true);
  };

  return (
    <div className="mt-20 p-10 rounded-[2.5rem] bg-[#0f172a] text-white text-center">
      <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
      <p className="text-slate-400 mb-8">Our coordination team is ready to assist you with any specific inquiries.</p>
      <button 
        onClick={handleContactClick}
        className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
      >
        Contact Support
      </button>

      <AnimatePresence>
        {showSupport && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupport(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Contact Support</h3>
                  <button 
                    onClick={() => setShowSupport(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl group">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                      <Mail size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Address</p>
                      <p className="text-sm font-bold text-slate-900">cmoc@afp.mil.ph</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl group">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                      <Facebook size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Facebook Page</p>
                      <p className="text-sm font-bold text-slate-900">facebook.com/cmmisportal</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl group">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-700">
                      <Phone size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Telephone</p>
                      <p className="text-sm font-bold text-slate-900">+63 (2) 8888-0000</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSupport(false)}
                  className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
