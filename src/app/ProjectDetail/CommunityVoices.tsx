import React from 'react';
import { Project } from '../../constants';

interface CommunityVoicesProps {
  project: Project;
}

export const CommunityVoices = ({ project }: CommunityVoicesProps) => {
  const minorTestimonials = project.testimonials?.filter(t => t.voiceType === 'minor') || [];

  return (
    <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Community Voices</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {minorTestimonials.length > 0 ? (
          minorTestimonials.map((t, i) => (
            <div key={t.id || i} className="space-y-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm">
                <img 
                  src={t.photo || `https://picsum.photos/seed/${t.id}/200/200`} 
                  alt={t.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <p className="text-slate-600 text-sm italic leading-relaxed">"{t.statement}"</p>
              <div>
                <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">{t.position}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">No community voices shared yet for this project.</p>
          </div>
        )}
      </div>
    </section>
  );
};
