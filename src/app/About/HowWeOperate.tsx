import React from 'react';
import { MessageSquare, Zap, Users } from 'lucide-react';

export const HowWeOperate = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-200 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How We Operate</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">The AFP's Strategic Nerve Center for CMO, providing a Common Operating Picture and Centralized Command.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Public Affairs", 
              icon: MessageSquare, 
              desc: "Establishing truth and narrative integrity through strategic communication to fill the information vacuum.",
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "Psychological Operations", 
              icon: Zap, 
              desc: "Defending the population's cognitive functions and 'immunizing' them against malign influence.",
              color: "bg-purple-50 text-purple-600"
            },
            { 
              title: "Civil Affairs", 
              icon: Users, 
              desc: "Providing tangible proof of government commitment and bridging the gap through civic partnerships.",
              color: "bg-emerald-50 text-emerald-600"
            }
          ].map((pillar, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:border-emerald-200 transition-all group">
              <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <pillar.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
              <p className="text-slate-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
