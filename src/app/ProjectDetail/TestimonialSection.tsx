import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { Project } from '../../constants';

interface TestimonialSectionProps {
  project: Project;
}

export const TestimonialSection = ({ project }: TestimonialSectionProps) => {
  const majorTestimonial = project.testimonials?.find(t => t.voiceType === 'major');

  if (!majorTestimonial) {
    return (
      <section className="bg-emerald-600 p-12 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquare size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-yellow-400"
              >
                ★
              </motion.span>
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 italic">
            "The coordination between the CMOC and our local development board has been seamless. This project isn't just about concrete and steel; it's about restoring hope and stability to a region that has felt forgotten for decades."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center font-bold text-xl uppercase">
              JD
            </div>
            <div>
              <div className="font-bold text-lg">Gov. Jose Dela Cruz</div>
              <div className="text-emerald-200 text-sm">Provincial Governor & Development Partner</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-emerald-600 p-12 rounded-[3rem] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <MessageSquare size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.span 
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-yellow-400"
            >
              ★
            </motion.span>
          ))}
        </div>
        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 italic">
          "{majorTestimonial.statement}"
        </blockquote>
        <div className="flex items-center gap-4">
          {majorTestimonial.photo ? (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 shadow-sm">
              <img src={majorTestimonial.photo} alt={majorTestimonial.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center font-bold text-xl uppercase">
              {majorTestimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
          <div>
            <div className="font-bold text-lg">{majorTestimonial.name}</div>
            <div className="text-emerald-200 text-sm">{majorTestimonial.position}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
