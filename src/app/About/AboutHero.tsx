import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {dashboardSlides} from '@/src/assets/Data/dashboardSlides'

export const AboutHero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % dashboardSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative bg-[#0f172a] py-24 px-4 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              Official Unit Primer
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Civil-Military <br />
              <span className="text-emerald-400">Operations Command</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Defenders of the Hearts and Minds of the Filipino People. Operating at the intersection of national security and community development.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImage}
                  src={dashboardSlides[currentImage].image} 
                  alt={dashboardSlides[currentImage].caption} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Indicators */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                {dashboardSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentImage === i ? "bg-emerald-400 w-4" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <motion.div 
              key={`caption-${currentImage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-4 -left-4 bg-emerald-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg z-10"
            >
              {dashboardSlides[currentImage].caption}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
