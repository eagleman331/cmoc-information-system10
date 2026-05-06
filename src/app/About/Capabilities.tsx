import React from 'react';
import { Search, BookOpen } from 'lucide-react';

export const Capabilities = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-8 rounded-[2rem] text-white space-y-4">
              <Search size={32} className="text-emerald-400" />
              <h4 className="font-bold text-lg">Strategic Research</h4>
              <p className="text-slate-400 text-xs">Data-driven analysis and audience studies to support strategic messaging.</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] space-y-4 mt-8">
              <BookOpen size={32} className="text-emerald-600" />
              <h4 className="font-bold text-lg">Executive Education</h4>
              <p className="text-slate-500 text-xs">Offering the 'Big 6' Executive Courses through the AFP CMO School.</p>
            </div>
          </div>
        </div>
        <div className="space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            Capabilities
          </div>
          <h2 className="text-4xl font-bold text-slate-900">Enterprise-Level <span className="text-emerald-600">Support</span></h2>
          <p className="text-slate-600 leading-relaxed">
            We unlock advanced capabilities to support operations across the archipelago, ensuring that every mission is backed by academic rigor and specialized training.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Academic Partnerships & Evidence-based Studies
            </li>
            <li className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Harmonized CMO Education across Major Services
            </li>
            <li className="flex items-center gap-3 text-slate-700 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Strategic Audience Analysis & Civic Activities
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
