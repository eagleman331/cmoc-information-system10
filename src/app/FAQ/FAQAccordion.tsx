import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQS, cn } from '../../constants';

export const FAQAccordion = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {FAQS.map((faq, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-emerald-200 transition-colors">
          <button 
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full p-8 text-left flex justify-between items-center group"
          >
            <span className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">{faq.question}</span>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              openFaq === i ? "bg-emerald-600 text-white rotate-180" : "bg-slate-100 text-slate-400"
            )}>
              <ChevronDown size={18} />
            </div>
          </button>
          <AnimatePresence>
            {openFaq === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 pt-0 text-slate-600 leading-relaxed text-lg border-t border-slate-50">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
