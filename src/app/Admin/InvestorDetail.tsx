import React, { useState } from 'react';
import { ArrowLeft, Building2, Globe, TrendingUp, Calendar, Edit2, User } from 'lucide-react';
import { Investor, Project, cn } from '../../constants';
import { EditInvestorModal } from './EditInvestorModal';

interface InvestorDetailProps {
  investor: Investor;
  onBack: () => void;
  projects: Project[];
  onUpdateInvestor: (updatedInvestor: Investor) => void;
}

export const InvestorDetail: React.FC<InvestorDetailProps> = ({ investor, onBack, projects, onUpdateInvestor }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use investor.investments if available, otherwise fallback to project-based filtering
  const displayInvestments = investor.investments || (projects || [])
    .filter(project => project.investors?.some(inv => inv.name === investor.name))
    .map(project => {
      const contribution = project.investors?.find(inv => inv.name === investor.name);
      return {
        projectId: project.id,
        projectName: project.title,
        status: project.status,
        amount: contribution?.amount || '0',
        date: contribution?.date || 'N/A'
      };
    });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Investors
        </button>
        
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <Edit2 size={16} /> Update Investor
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-48 bg-emerald-600 relative">
          <div className="absolute -bottom-12 left-8 w-32 h-32 rounded-3xl border-4 border-white bg-white shadow-lg overflow-hidden">
            {investor.image ? (
              <img src={investor.image} alt={investor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-4xl font-bold">
                {investor.name[0]}
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{investor.name}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Building2 size={14} /> {investor.sector}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Globe size={14} /> {investor.country}
                </span>
                {investor.headOfCompany && (
                  <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <User size={14} /> {investor.headOfCompany}
                  </span>
                )}
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  investor.status === 'verified' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {investor.status}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-6 py-3 bg-slate-50 rounded-2xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Invested</div>
                <div className="text-xl font-mono font-bold text-emerald-600">{investor.totalInvested}</div>
              </div>
              <div className="text-center px-6 py-3 bg-slate-50 rounded-2xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projects</div>
                <div className="text-xl font-mono font-bold text-slate-900">{investor.projectsCount}</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {investor.headOfCompany && (
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Head of Company</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                      {investor.headOfCompanyPhoto ? (
                        <img src={investor.headOfCompanyPhoto} alt={investor.headOfCompany} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{investor.headOfCompany}</div>
                      <div className="text-xs text-slate-500">Chief Executive Officer</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Background</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {investor.background}
                </p>
              </div>
              
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <h4 className="text-emerald-900 font-bold mb-2 flex items-center gap-2">
                  <TrendingUp size={18} /> Investment Impact
                </h4>
                <p className="text-emerald-700 text-xs leading-relaxed">
                  This investor has contributed significantly to regional stability and economic growth through their strategic partnerships.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Invested Projects</h3>
              <div className="space-y-4">
                {displayInvestments.length > 0 ? (
                  displayInvestments.map((inv, idx) => {
                    return (
                      <div key={inv.projectId || idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                          <Building2 size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{inv.projectName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <TrendingUp size={12} /> ₱{inv.amount}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar size={12} /> {inv.date}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          inv.status === 'ongoing' ? "bg-blue-100 text-blue-700" : 
                          inv.status === 'completed' ? "bg-emerald-100 text-emerald-700" : 
                          inv.status === 'postponed' ? "bg-red-100 text-red-700" :
                          inv.status === 'on hold' ? "bg-slate-100 text-slate-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {inv.status}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm italic">No project data available for this investor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditInvestorModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        investor={investor}
        onUpdate={onUpdateInvestor}
        projects={projects}
      />
    </div>
  );
};
