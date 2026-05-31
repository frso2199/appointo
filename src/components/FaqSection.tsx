import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQS } from '../data';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-3" id="faq-accordion-section">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all dark:border-slate-800 dark:bg-slate-900/60"
            id={`faq-item-${faq.id}`}
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="flex w-full items-center justify-between p-5 text-left font-sans transition focus:outline-none"
              id={`faq-trigger-${faq.id}`}
            >
              <div className="flex gap-3 pr-4">
                <HelpCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {faq.question}
                </span>
              </div>
              <span className="rounded-xl bg-slate-100 p-1.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="border-t border-slate-100 p-5 pt-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-350 sm:text-sm">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
