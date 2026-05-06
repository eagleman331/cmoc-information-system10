import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, formatCurrency } from '../../constants';

interface ProjectSidebarProps {
  selectedProject: Project | null;
  onClose: () => void;
}

export const ProjectSidebar = ({ selectedProject, onClose }: ProjectSidebarProps) => {
  return (
    <div className="lg:col-span-5">
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-8 rounded-3xl sticky top-24"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-900">{selectedProject.title}</h3>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="bg-slate-100 p-2 rounded-lg"><MapIcon size={18} /></div>
                <span className="font-medium">{selectedProject.location}</span>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-600 leading-relaxed italic">
                  "{selectedProject.description}"
                </p>
              </div>

              {selectedProject.proposalUrl && (
                <div className="pt-2">
                  <a 
                    href={selectedProject.proposalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download={`Proposal-${selectedProject.title.replace(/\s+/g, '_')}.pdf`}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm"
                  >
                    <FileText size={16} /> View Project Proposal
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Budget</div>
                  <div className="text-xl font-mono font-bold text-slate-900">{formatCurrency(selectedProject.budget)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Funding Gap</div>
                  <div className="text-xl font-mono font-bold text-emerald-600">{formatCurrency(selectedProject.investorGoal)}</div>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  to={`/project/${selectedProject.id}`}
                  className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  Inquire for Investment <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4 h-[500px]">
            <div className="bg-slate-100 p-6 rounded-full text-slate-300">
              <MapIcon size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">No Project Selected</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Click on a pin on the map to view detailed investment opportunities and project status.
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
