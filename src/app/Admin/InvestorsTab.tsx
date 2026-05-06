import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { cn, Investor } from '../../constants';

interface InvestorsTabProps {
  investors: Investor[];
  onSelectInvestor: (investor: Investor) => void;
  onEditInvestor: (investor: Investor) => void;
  onDeleteInvestor: (investor: Investor) => void;
}

export const InvestorsTab: React.FC<InvestorsTabProps> = ({ 
  investors, 
  onSelectInvestor, 
  onEditInvestor,
  onDeleteInvestor
}) => {
  const [investorToDelete, setInvestorToDelete] = useState<Investor | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investors.map((inv) => (
        <div 
          key={inv.id} 
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group relative"
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEditInvestor(inv);
              }}
              className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setInvestorToDelete(inv);
              }}
              className="p-2 bg-slate-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div onClick={() => onSelectInvestor(inv)}>
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                {inv.image ? (
                  <img src={inv.image} alt={inv.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  inv.name[0]
                )}
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                inv.status === 'verified' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {inv.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{inv.name}</h3>
            <p className="text-slate-500 text-sm mb-6">{inv.sector}</p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Invested</div>
                <div className="font-mono font-bold text-slate-900">{inv.totalInvested}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projects</div>
                <div className="font-mono font-bold text-slate-900">{inv.projectsCount}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {investorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Investor?</h3>
            <p className="text-slate-500 mb-8">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{investorToDelete.name}"</span>? 
              This will submit a deletion request for approval.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setInvestorToDelete(null)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteInvestor(investorToDelete);
                  setInvestorToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
