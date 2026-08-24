import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';
import { FAQS } from '../data/agencyData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-6 sm:py-8 relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Operational Clarifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Everything you need to know about our execution matrix, pricing standards, and pan-India workflows.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#141624] border-amber-500/40 shadow-md shadow-amber-500/5'
                    : 'bg-[#0e1018] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-amber-500 text-black' : ''
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-zinc-800/60 animate-in fade-in duration-150">
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-6 p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Have a unique question not covered here?</span>
          </div>
          <a
            href="tel:+918276825128"
            className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Call Founder Hotline Directly</span>
            <span className="font-mono">(+91 8276825128)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
