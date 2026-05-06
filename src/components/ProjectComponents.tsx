import React from 'react';
import { Project, formatCurrency } from '../constants';
import { MapPin, Calendar, Target, TrendingUp, CheckCircle2, Clock, Construction } from 'lucide-react';
import { cn } from '../constants';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  isSelected?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, isSelected }) => {
  const statusConfig = {
    proposed: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Proposed' },
    ongoing: { icon: Construction, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Ongoing' },
    completed: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Completed' },
  };

  const config = statusConfig[project.status];
  const StatusIcon = config.icon;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "project-card p-5 cursor-pointer group",
        isSelected && "ring-2 ring-emerald-500 border-transparent"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5", config.bg, config.color, "border", config.border)}>
          <StatusIcon size={12} />
          {config.label}
        </span>
        <span className="text-xs font-mono text-slate-400">ID: {project.id}</span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {project.title}
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={14} className="text-slate-400" />
          {project.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          Started: {project.startDate}
        </div>
      </div>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4 italic">
        "{project.description}"
      </p>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Total Budget</div>
          <div className="text-sm font-mono font-bold text-slate-700">{formatCurrency(project.budget)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Investor Goal</div>
          <div className="text-sm font-mono font-bold text-emerald-600">{formatCurrency(project.investorGoal)}</div>
        </div>
      </div>
    </div>
  );
};

export const StatsSection: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: Target, color: 'text-slate-600' },
    { label: 'Proposed', value: projects.filter(p => p.status === 'proposed').length, icon: Clock, color: 'text-amber-600' },
    { label: 'Ongoing', value: projects.filter(p => p.status === 'ongoing').length, icon: Construction, color: 'text-blue-600' },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg bg-white shadow-sm", stat.color)}>
              <stat.icon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
