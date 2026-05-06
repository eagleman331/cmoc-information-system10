import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { Project, cn, formatCurrency } from '../../constants';
import { EnvDemo } from '../../components/EnvDemo';

interface OverviewTabProps {
  projects: Project[];
  investors: any[];
  stats: any[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ projects, investors, stats }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Project Updates</h3>
          <div className="space-y-6">
            {projects.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  {p.status === 'completed' ? <CheckCircle2 size={20} className="text-emerald-500" /> : 
                   p.status === 'ongoing' ? <Clock size={20} className="text-blue-500" /> : 
                   <AlertCircle size={20} className="text-amber-500" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.location} • <span className={cn(
                    "font-bold uppercase tracking-wider",
                    p.status === 'completed' ? "text-emerald-600" :
                    p.status === 'ongoing' ? "text-blue-600" :
                    p.status === 'postponed' ? "text-red-600" :
                    p.status === 'on hold' ? "text-slate-600" :
                    "text-amber-600"
                  )}>{p.status}</span></div>
                </div>
                <div className="text-sm font-mono font-bold text-slate-400">{formatCurrency(p.budget)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Investor Activity</h3>
          <div className="space-y-6">
            {investors.map((inv, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                  {inv.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{inv.name}</div>
                  <div className="text-xs text-slate-500">{inv.projectsCount} Projects • {inv.status}</div>
                </div>
                <div className="text-sm font-mono font-bold text-emerald-600">{inv.totalInvested}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EnvDemo />
    </div>
  );
};
