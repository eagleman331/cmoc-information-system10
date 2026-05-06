import React from 'react';
import { motion } from 'motion/react';
import { MapPin, DollarSign, ShieldCheck, CheckCircle2, Download, FileText, Lock, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../constants';

interface ProspectusSummaryProps {
  project: any;
}

export const ProspectusSummary = ({ project }: ProspectusSummaryProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-8 lg:sticky lg:top-32"
    >
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <FileText size={120} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Project Summary</h2>
        
        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
              <div className="font-bold text-slate-900">{project.location}</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Project Budget</div>
              <div className="font-bold text-slate-900 text-xl">{formatCurrency(project.budget)}</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Security Status</div>
              <div className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} />
                Active Brigade Protection
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {project.proposalUrl ? (
            <a 
              href={project.proposalUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`Proposal-${project.title.replace(/\s+/g, '_')}.pdf`}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
            >
              <Download size={20} />
              Download Full Proposal
            </a>
          ) : (
            <>
              <button 
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold opacity-50 cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                onClick={() => alert('Project Proposal PDF is not yet available for this project.')}
              >
                <Download size={20} />
                Download Full Proposal
              </button>
              <p className="text-center text-slate-400 text-xs">
                Proposal document pending upload
              </p>
            </>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <Lock size={16} className="text-slate-300" />
            <span>Secure & Confidential Document</span>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
        <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} />
          Why Invest Now?
        </h4>
        <ul className="space-y-3">
          {[
            "Strategic priority for regional stability",
            "Fully backed by Engineering Brigades",
            "Pre-cleared environmental & social permits",
            "Immediate socio-economic impact"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-emerald-800 text-sm">
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
