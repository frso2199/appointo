import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Gift, HelpCircle } from 'lucide-react';

interface ExitIntentModalProps {
  onClaimOffer: (formData: { name: string; business: string; phone: string }) => void;
}

export default function ExitIntentModal({ onClaimOffer }: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Detect mouse leave viewport (exit intent)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !business) return;

    setIsSubmitted(true);
    onClaimOffer({ name, business, phone });
    
    // Auto close after 3 seconds of success animation
    setTimeout(() => {
      setIsOpen(false);
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          id="exit-backdrop"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-lg overflow-visible rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-amber-300/30"
          id="exit-intent-modal"
        >
          {/* Animated decorative tag/ribbon */}
          <div className="absolute -top-3 right-12 rounded-b-xl bg-orange-500 px-4 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-md animate-bounce z-10">
            ⏰ Offer Expiring Today
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            id="close-exit-intent"
          >
            <X className="h-5 w-5" />
          </button>

          {!isSubmitted ? (
            <div>
              <div className="flex items-center gap-2 text-amber-500">
                <Gift className="h-6 w-6 animate-pulse" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-orange-500">Wait! Exclusive First-Time Gift</h3>
              </div>

              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900 dark:text-white font-sans sm:text-3xl">
                Claim 30-Day AppointO Trial For <span className="underline decoration-orange-500 text-orange-600">₹1 Only</span>!
              </h2>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Reduce patient or customer no-shows, collect online pre-payments instantly, and completely automate scheduling on busy WhatsApp channels. Get fully customized setup and hands-on staff training absolutely free of cost.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Anand Deshmukh"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                      Clinic / Business Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder="e.g. Dental Care Center"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                      WhatsApp Phone Number:
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-3 text-xs font-bold text-white shadow-xl shadow-orange-500/10 transition hover:from-orange-600 hover:to-amber-700"
                  id="claim-exclusive-btn"
                >
                  🎁 Claim 30-Day AppointO Trial @ ₹1 Now!
                </button>
              </form>

              <div className="mt-4 flex items-center justify-around border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">&#128737; SECURE TRANSACTION</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">• FREE CANCELLATION</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">• 1-CLICK REFUND</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="mb-4 rounded-full bg-green-500 p-4 text-white animate-bounce shadow-md">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">₹1 Trial Offer Claimed!</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-normal">
                Congratulations <strong className="text-slate-800 dark:text-white">{name}</strong>, we registered your coupon code.
                An AppointO Success Desk Expert will text you on WhatsApp <strong className="text-slate-800 dark:text-white">{phone}</strong> within 2 hours to confirm your free set up and training schedules.
              </p>
              <div className="mt-6 rounded-lg bg-emerald-50 p-2 text-[10px] text-emerald-800 font-bold dark:bg-slate-950 dark:text-emerald-400">
                🔍 Coupon Code APPOINTO7752 is active in your browser.
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
