import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FAQHero = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex p-4 rounded-3xl bg-emerald-50 text-emerald-600 mb-6">
        <HelpCircle size={48} />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
      <p className="text-slate-500 text-lg">Everything you need to know about our coordination model and investment process.</p>
    </div>
  );
};
