import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {sevenCrgSlides} from '@/src/assets/Data/sevenCrgpics'

const HERO_IMAGES = [
  "https://picsum.photos/seed/philippines-dev-1/800/600",
  "https://picsum.photos/seed/philippines-dev-2/800/600",
  "https://picsum.photos/seed/philippines-dev-3/800/600",
  "https://picsum.photos/seed/philippines-dev-4/800/600",
  "https://picsum.photos/seed/philippines-dev-5/800/600"
];

export const DashboardHero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sevenCrgSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative overflow-hidden pt-16 pb-24 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Globe size={14} />
            National Development Initiative
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Bridging Security <br />
            <span className="text-emerald-600">& Community Growth</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            Coordinating civilian infrastructure projects with military logistics and security to reach the most remote regions of the Philippines.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a href="#projects" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2">
              Explore Projects <ChevronRight size={18} />
            </a>
            <Link to="/prospectus" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              Download Project
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="relative glass-panel p-2 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImage}
                  src={sevenCrgSlides[currentImage].image} 
                  alt={`Development Project ${currentImage + 1}`} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>
            
            {/* Indicators */}
            <div className="absolute bottom-6 right-6 flex gap-2 z-10">
              {sevenCrgSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImage === i ? "bg-emerald-600 w-6" : "bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl shadow-xl flex items-center gap-4 z-10">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Building2 size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase">Ongoing Projects</div>
                <div className="text-xl font-bold text-slate-900">12 Active Sites</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};
