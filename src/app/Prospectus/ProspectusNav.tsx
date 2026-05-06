import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ProspectusNavProps {
  id: string;
}

export const ProspectusNav = ({ id }: ProspectusNavProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to={`/project/${id}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft size={20} />
          <span>Back to Project Brief</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
          <span className="font-bold tracking-tight text-slate-900">CMIMS</span>
        </div>
      </div>
    </nav>
  );
};
