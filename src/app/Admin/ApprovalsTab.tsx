import React from 'react';
import { CheckCircle2, XCircle, Clock, ArrowRight, User } from 'lucide-react';
import { PendingUpdate, cn } from '../../constants';

interface ApprovalsTabProps {
  updates: any[];
  onApprove: (approval: any) => void;
  onReject: (id: string) => void;
}

const DataPreview: React.FC<{ data: any }> = ({ data }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const jsonString = JSON.stringify(data, null, 2);
  const isLong = jsonString.length > 300;
  const displayString = isExpanded || !isLong ? jsonString : `${jsonString.slice(0, 300)}...`;

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg font-mono overflow-auto max-h-64">
        <pre className="whitespace-pre-wrap break-all">{displayString}</pre>
      </div>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export const ApprovalsTab: React.FC<ApprovalsTabProps> = ({ updates, onApprove, onReject }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Update Approvals</h3>
          <p className="text-slate-500 text-sm">Review and approve data updates submitted by encoders.</p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {updates.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No pending updates to review.</p>
            </div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{update.requestedBy}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock size={12} />
                          {update.requestedAt?.toDate().toLocaleString() || 'Just now'}
                        </div>
                      </div>
                      <div className="ml-auto lg:ml-4 flex-shrink-0">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          (update.type || '').includes('PROJECT') ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {(update.type || '').replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <div className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        Target: <span className="text-emerald-600 truncate">{update.data?.name || update.data?.title || update.targetId || 'New Entry'}</span>
                      </div>
                      <div className="space-y-3">
                        <DataPreview data={update.data} />
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 lg:sticky lg:top-0 flex-shrink-0">
                    <button 
                      onClick={() => onApprove(update)}
                      className="flex-1 lg:w-32 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <CheckCircle2 size={18} />
                      Approve
                    </button>
                    <button 
                      onClick={() => onReject(update.id)}
                      className="flex-1 lg:w-32 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
