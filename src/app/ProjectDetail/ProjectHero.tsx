import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../../constants';

interface ProjectHeroProps {
  project: any;
}

export const ProjectHero = ({ project }: ProjectHeroProps) => {
  return (
    <header className="bg-[#0f172a] pt-20 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="max-w-7xl mx-auto relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              {project.category} • {project.status}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-400" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-emerald-400" />
                <span>Commenced: {formatDate(project.targetStart)}</span>
              </div>
            </div>

            {project.proposalUrl && (
              <div className="mt-8">
                <a 
                  href={project.proposalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={`Proposal-${project.title.replace(/\s+/g, '_')}.pdf`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold text-sm"
                >
                  <FileText size={18} className="text-emerald-400" />
                  View Project Proposal
                </a>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-3xl bg-white/5 border-white/10"
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Budget</div>
                <div className="text-3xl font-mono font-bold text-white">{formatCurrency(project.budget)}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Funding Gap</div>
                <div className="text-3xl font-mono font-bold text-emerald-400">{formatCurrency(project.investorGoal)}</div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Funding Progress</span>
                <span className="text-emerald-400 font-bold">
                  {project.currentFunding || '0'}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${project.currentFunding || '0'}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
