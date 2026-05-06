import React from 'react';
import { Target, Shield, CheckCircle2 } from 'lucide-react';

interface ProjectOverviewProps {
  project: any;
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Overview</h2>
      
      <div className="mb-8 rounded-3xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
        <img 
          src={project.proposedImage || `https://picsum.photos/seed/construction-${project.id}/1200/600`} 
          alt={project.title}
          className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-6 mb-8">
        {project.proponent && (
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Proponent</h3>
            <p className="text-lg font-semibold text-slate-900">{project.proponent}</p>
            {project.aboutProponent && (
              <p className="text-slate-600 mt-1 text-sm italic">{project.aboutProponent}</p>
            )}
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-slate-600 leading-relaxed">
            {project.description}
          </p>
        </div>

        {project.background && (
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Background & Rationale</h3>
            <p className="text-slate-600 leading-relaxed">
              {project.background}
            </p>
          </div>
        )}

      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Target size={20} className="text-emerald-600" />
              {project.objectives ? 'Project Objectives' : 'Strategic Objectives'}
            </h3>
            <ul className="space-y-3">
              {project.objectives ? (
                <li className="flex items-start gap-3 text-slate-600 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  {project.objectives}
                </li>
              ) : (
                [
                  "Enhance regional security through infrastructure",
                  "Provide essential services to remote populations",
                  "Foster civilian-military cooperation",
                  "Stimulate local economic growth"
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {obj}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Beneficiaries</p>
              <p className="text-xl font-bold text-slate-900">{project.beneficiariesCount?.toLocaleString() || '0'}+</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Impact Rate</p>
              <p className="text-xl font-bold text-emerald-600">{project.impactPercentage || '0'}%</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Shield size={20} className="text-emerald-600" />
            Security Framework
          </h3>
          <ul className="space-y-3">
            {[
              "24/7 Engineering Brigade site protection",
              "Community-based intelligence network",
              "Joint coordination with local government",
              "Secure logistics and supply chain"
            ].map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
