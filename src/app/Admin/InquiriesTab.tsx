import React, { useState, useEffect } from 'react';
import { Mail, Globe, Building2, User, MessageSquare, Calendar, CheckCircle2, Loader2, Briefcase } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, doc, updateDoc, handleFirestoreError, OperationType } from '../../lib/firebase';

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  country: string;
  organization: string;
  proposedContribution: string;
  date: string;
  status: 'new' | 'read' | 'contacted';
  projectTitle?: string;
}

export const InquiriesTab = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'message_inquiries'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const inquiriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Inquiry));
      setInquiries(inquiriesData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'message_inquiries');
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'message_inquiries', id), { status: 'read' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `message_inquiries/${id}`);
    }
  };

  const handleContacted = async (id: string) => {
    try {
      await updateDoc(doc(db, 'message_inquiries', id), { status: 'contacted' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `message_inquiries/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={40} className="text-emerald-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Inquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Message Inquiries</h2>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
          {inquiries.filter(i => i.status === 'new').length} New Inquiries
        </span>
      </div>

      <div className="grid gap-4">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div 
              key={inquiry.id}
              className={`bg-white p-6 rounded-3xl border transition-all group ${
                inquiry.status === 'new' ? 'border-emerald-100 shadow-sm' : 'border-slate-100 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      inquiry.status === 'new' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{inquiry.fullName}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={12} />
                        {inquiry.date}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {inquiry.status === 'new' && (
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                      {inquiry.status === 'read' && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Read
                        </span>
                      )}
                      {inquiry.status === 'contacted' && (
                        <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={10} /> Contacted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={16} className="text-slate-400" />
                      {inquiry.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Globe size={16} className="text-slate-400" />
                      {inquiry.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 size={16} className="text-slate-400" />
                      {inquiry.organization}
                    </div>
                  </div>

                  {inquiry.projectTitle && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                      <Briefcase size={14} />
                      Project: {inquiry.projectTitle}
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <MessageSquare size={14} />
                      Proposed Contribution
                    </div>
                    <p className="text-slate-700 font-medium">
                      {inquiry.proposedContribution}
                    </p>
                  </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-2">
                  <button 
                    onClick={() => handleContacted(inquiry.id)}
                    disabled={inquiry.status === 'contacted'}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      inquiry.status === 'contacted' 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    Contact Investor
                  </button>
                  <button 
                    onClick={() => handleMarkAsRead(inquiry.id)}
                    disabled={inquiry.status !== 'new'}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      inquiry.status !== 'new'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {inquiry.status === 'new' ? 'Mark as Read' : 'Read'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-slate-100 rounded-3xl">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Inquiries Found</h3>
            <p className="text-slate-500">New investor inquiries will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
