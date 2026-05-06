import React from 'react';

interface CommunityImpactProps {
  project: any;
}

export const CommunityImpact = ({ project }: CommunityImpactProps) => {
  return (
    <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Community Impact</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            {project.beneficiaries ? (
              <>This project is designed to benefit: <span className="font-semibold text-slate-900">{project.beneficiaries}</span>. {project.areaCoverage && `It covers a total area of ${project.areaCoverage}.`}</>
            ) : (
              "This project directly serves over 5,000 residents in the surrounding barangays. By providing reliable infrastructure, we are enabling local farmers to transport goods more efficiently and ensuring that medical emergency vehicles can reach remote areas in half the time."
            )}
          </p>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {project.beneficiariesCount ? `${project.beneficiariesCount.toLocaleString()}+` : (project.id === '6' ? '14k+' : project.id === '7' ? '50' : project.id === '8' ? '70' : '5k+')}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Beneficiaries</div>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {project.impactPercentage ? `${project.impactPercentage}%` : (project.id === '6' ? '50%' : '40%')}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Impact Rate</div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
          <img 
            src={project.beneficiariesImage || `https://picsum.photos/seed/community-${project.id}/600/400`} 
            alt="Beneficiary Community"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
};
