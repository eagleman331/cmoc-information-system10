import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';

export const EnvDemo = () => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="text-emerald-600" size={24} />
        <h3 className="text-lg font-bold text-slate-900">Environment Configuration</h3>
      </div>

      <div className="space-y-4">
        {/* Cybersecurity Protection Demo */}
        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <ShieldCheck className="text-emerald-600 mt-1" size={20} />
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Cybersecurity Protection</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-white rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-700">HELMET (CSP)</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-700">RATE LIMITING</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-700">CORS POLICY</span>
              <span className="px-2 py-1 bg-white rounded-lg border border-emerald-200 text-[10px] font-bold text-emerald-700">PAYLOAD LIMITS</span>
            </div>
            <p className="text-[10px] text-emerald-600 mt-2 italic">
              * Basic protections active to prevent common web vulnerabilities (XSS, DoS, Brute Force).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
