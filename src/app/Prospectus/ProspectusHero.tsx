import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';

interface ProspectusHeroProps {
  project: any;
}

export const ProspectusHero = ({ project }: ProspectusHeroProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          Investor Proposal 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
          Secure Your Stake in <span className="text-emerald-600">{project.title}</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Download the full strategic proposal for the {project.title}. This document outlines the comprehensive engineering plan, security protocols, and long-term socio-economic impact assessments.
        </p>
      </div>

      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
        <img 
          src={project.proposedImage || `https://picsum.photos/seed/prospectus-${project.id}/1200/800`} 
          alt={project.title}
          className="w-full aspect-[4/3] object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <Users className="text-emerald-600 mb-3" size={24} />
          <div className="text-2xl font-bold text-slate-900">
            {project.beneficiariesCount ? project.beneficiariesCount.toLocaleString() : '0'}+
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Beneficiaries</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <TrendingUp className="text-emerald-600 mb-3" size={24} />
          <div className="text-2xl font-bold text-slate-900">
            {project.impactPercentage || '0'}%
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Regional ROI</div>
        </div>
      </div>
    </motion.div>
  );
};
