import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const WhyWeExist = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
            Strategic Context
          </div>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">
            Why We <span className="text-emerald-600">Exist</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            The CMO Command was activated to address a fundamental shift in our national security landscape. As the AFP pivots toward <strong>Comprehensive Archipelagic Defense Operations (CADO)</strong>, we recognize that the front line has moved beyond physical borders into the <strong>National Will</strong>.
          </p>
          
          <div className="space-y-6">
            {[
              { title: "The Cognitive Battlefield", desc: "While traditional domains maintain a posture of competition, the Cognitive Domain is already in a state of 'Active War'." },
              { title: "The Threat of FIMIO", desc: "Countering adversarial United Front Work and gray-zone tactics that weaponize disinformation to win 'without fighting'." },
              { title: "Ending Fragmentation", desc: "Consolidating the entire CMO capability of the AFP to direct its focus and effects with maximum efficiency." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" 
              alt="Strategic Operations" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
            <p className="text-sm font-medium text-slate-600 italic">
              "The hearts and minds of our people are the hill where we must hold our first and final lines of defense."
            </p>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">— Commander, CMOC</p>
          </div>
        </div>
      </div>
    </section>
  );
};
