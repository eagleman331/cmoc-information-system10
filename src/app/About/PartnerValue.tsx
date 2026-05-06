import React from 'react';
import { Shield, Globe, Zap, MessageSquare } from 'lucide-react';

export const PartnerValue = () => {
  return (
    <section className="py-24 bg-slate-900 text-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Value as a Partner</h2>
          <p className="text-slate-400">Why the private sector and civil society choose to coordinate with CMOC.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="text-emerald-400" /> Public Trust
            </h3>
            <p className="text-slate-400 text-lg">
              Partner with the most trusted and approved government agency in the country. Our service is built on a foundation of institutional integrity and public approval.
            </p>
          </div>
          <div className="bg-emerald-600 p-10 rounded-[2.5rem] flex flex-col justify-between">
            <Globe size={40} className="text-emerald-200" />
            <div>
              <h3 className="text-xl font-bold mb-2">Unrivaled Logistics</h3>
              <p className="text-emerald-100 text-sm">Tap into the government's largest land, maritime, and air logistics provider.</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all">
            <Zap size={32} className="text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold mb-2">Crisis Response</h3>
            <p className="text-slate-400 text-sm">From armed conflicts to devastating typhoons, we are at the front lines of every national crisis.</p>
          </div>
          <div className="md:col-span-2 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex items-center gap-8 hover:bg-white/10 transition-all">
            <div className="hidden sm:block w-32 h-32 bg-emerald-500/20 rounded-3xl flex-shrink-0 flex items-center justify-center">
              <MessageSquare size={48} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Force Multiplier</h3>
              <p className="text-slate-400 text-sm">Effective communication is our strength. We rally partners behind shared missions for sustained impact across all media forms.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
