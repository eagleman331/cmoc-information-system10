import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Map, 
  Building2, 
  Zap, 
  Users, 
  UserCircle, 
  Calendar, 
  Layers, 
  Activity, 
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const ASCOPE_CATEGORIES = [
  {
    icon: <Map className="text-emerald-600" />,
    title: "Areas",
    description: "Geographic locations of significance.",
    questions: ["Where are the tribal boundaries?", "Which neighborhoods are prone to flooding?"]
  },
  {
    icon: <Building2 className="text-blue-600" />,
    title: "Structures",
    description: "Physical buildings and infrastructure.",
    questions: ["Is the bridge safe for heavy trucks?", "Does the hospital have a backup generator?"]
  },
  {
    icon: <Zap className="text-amber-600" />,
    title: "Capabilities",
    description: "The ability of the local population to sustain itself.",
    questions: ["Can the local police maintain order?", "Is there enough wheat in the silos for winter?"]
  },
  {
    icon: <Users className="text-purple-600" />,
    title: "Organizations",
    description: "Groups that aren't part of the government.",
    questions: ["Which NGOs are active here?", "Who runs the local labor unions or religious councils?"]
  },
  {
    icon: <UserCircle className="text-rose-600" />,
    title: "People",
    description: "Key individuals and the general population.",
    questions: ["Who is the 'village elder' everyone actually listens to?", "What is the unemployment rate?"]
  },
  {
    icon: <Calendar className="text-indigo-600" />,
    title: "Events",
    description: "Significant occurrences (past, present, or future).",
    questions: ["When is the next election?", "Are there upcoming religious festivals?"]
  }
];

export const Framework = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <header className="bg-[#0f172a] py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              Operational Standards
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              The <span className="text-emerald-400">ASCOPE</span> <br />
              Framework
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              The "gold standard" for organizing civil data. It breaks down a complex society into six manageable categories to ensure nothing is missed during field assessments.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASCOPE_CATEGORIES.map((cat, idx) => (
            <Link key={cat.title} to="/framework/details">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-white/50 h-full group"
              >
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:bg-emerald-50 transition-colors">
                  {cat.icon}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{cat.title}</h3>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{cat.description}</p>
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Questions</div>
                  {cat.questions.map((q, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-500 italic">
                      <span className="text-emerald-500">•</span>
                      {q}
                    </div>
                  ))}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Integration Section */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Layers size={14} />
              Cross-Reference Analysis
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Combining ASCOPE with PMESII</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              To get the full "3D" view of a region, CIM systems cross-reference ASCOPE (civil) with PMESII (operational: Political, Military, Economic, Social, Information, and Infrastructure).
            </p>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 mt-1">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">ASCOPE (Structures)</div>
                  <div className="text-sm text-slate-500">Identifies the location of a power plant.</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">PMESII (Economic)</div>
                  <div className="text-sm text-slate-500">Indicates that the plant accounts for 80% of local jobs.</div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-4 items-center">
                <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                  <AlertCircle size={18} />
                </div>
                <div className="text-sm font-bold text-rose-600">
                  Result: System flags as "High-Value" civil site to prevent economic collapse.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                <Activity size={14} />
                The "Atmospherics" Layer
              </div>
              <h2 className="text-3xl font-bold mb-6">Tracking the "Vibe"</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Beyond hard data, CIM systems track qualitative Atmospherics. This is the first indicator of change before major events occur.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                  <span className="text-sm text-slate-300">Graffiti analysis: Pro vs Anti-government sentiment.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                  <span className="text-sm text-slate-300">Market activity: Are people out or are streets empty?</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                  <span className="text-sm text-slate-300">Visual cues: Shop hours, local council posters, etc.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* SITREP Example */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Field Report Example</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              How field data is structured for the Civil Information Management (CIM) system.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">SITREP: AL-RAFID</div>
                  <div className="text-sm">Sector Blue (City Center)</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Date</div>
                <div className="text-sm font-mono">18 FEB 2026</div>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> 1. ASCOPE Analysis
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-900">Areas:</span> Market District. High density of IDPs in Northern outskirts.
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-900">Structures:</span> Water Treatment Plant. <span className="text-amber-600 font-bold">Status: Yellow</span> (40% capacity).
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-900">People:</span> Sheikh Hamza. Primary influencer. Prioritizes water access.
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-900">Events:</span> Religious Festival (24 FEB). Expect 5,000+ people.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={16} /> 2. Civil Atmospherics
                  </h4>
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Sentiment</div>
                      <div className="text-slate-700">Moderate. Frustrated with water but appreciate security.</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Visual Cues</div>
                      <div className="text-slate-700">Shops staying open until 8:00 PM. Local council posters increasing.</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertCircle size={16} /> 3. CIM Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700">
                      <div className="font-bold">PRIORITY 1:</div>
                      <div>Source Pump Gasket (Model 44-B) for Water Plant.</div>
                    </div>
                    <div className="flex gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700">
                      <div className="font-bold">PRIORITY 2:</div>
                      <div>Alert Medical Officer to antibiotic shortfall at clinic.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-6">How the System Uses This</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="bg-white w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">1</div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Map Updates</span>
                    Water plant icon turns from Red to Yellow automatically.
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">2</div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Logistics Alert</span>
                    System flags specific part needed, triggering supply request.
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-rose-600 font-bold text-xs shrink-0">3</div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Conflict Avoidance</span>
                    Warns convoys of high pedestrian traffic during festival.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
