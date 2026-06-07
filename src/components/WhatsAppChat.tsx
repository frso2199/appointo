import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Check, Image, Sparkles } from 'lucide-react';

interface WhatsAppChatProps {
  onTriggerDemo: () => void;
}

export default function WhatsAppChat({ onTriggerDemo }: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'bot' | 'system'; text: string; time: string }>>([
    {
      id: 'w1',
      sender: 'bot',
      text: "👋 Namaste! I am AppointO's WhatsApp AI scheduling assistant. I help clinics, salons, and physiotherapy centers automate bookings, take cancellations, and collect prepayments on autopilot.",
      time: '11:15'
    },
    {
      id: 'w2',
      sender: 'system',
      text: "⚡ Try selecting a smart quick reply button below to see me scheduling interactive slots programmatically!",
      time: '11:15'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Clear unread badge when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `wuser-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      sender: 'user' as const,
      text: text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsBotTyping(true);

    // AI simulated response
    setTimeout(() => {
      let botResponse = "";
      const query = text.toLowerCase();

      if (query.includes('schedule') || query.includes('book') || query.includes('sim')) {
        botResponse = "📅 **Great!** I am opening the AppointO interactive scheduling modal for you. You can try selecting a live staff workspace, date, and mock mobile to see my automated WhatsApp trigger firing!";
        setTimeout(() => {
          onTriggerDemo();
          setIsOpen(false);
        }, 1500);
      } else if (query.includes('price') || query.includes('cost') || query.includes('plan') || query.includes('trial')) {
        botResponse = "💰 **AppointO Plans:** Our starter tier cost is only ₹499/month, while our Professional featured plan is ₹999/month. You can start with our **30-Day Trial for only ₹99**! No hidden setup fees, cancel anytime.";
      } else if (query.includes('hindi') || query.includes('language') || query.includes('bhasha')) {
        botResponse = "🗣️ **Multi-Language Automation:** Yes, AppointO AI chatbot seamlessly converses in Hindi, English, Tamil, Telugu, Marathi, Bengali, and Gujarati. This ensures high accessibility for tier 2 & tier 3 business customers!";
      } else {
        botResponse = "🤖 **AppointO bot:** Understood! In a live setup, customers can text this WhatsApp number to query current queues, inspect open slots, or pay via UPI. Tell me your business type and I can simulate custom slots.";
      }

      setMessages(prev => [...prev, {
        id: `wbot-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        sender: 'bot' as const,
        text: botResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      }]);
      setIsBotTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 md:bottom-6 z-[60] select-none">
      
      {/* Floating Green WhatsApp Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        id="whatsapp-floating-trigger"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>

        {/* Dynamic Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            className="absolute bottom-16 -right-1.5 w-[calc(100vw-32px)] max-w-[340px] sm:max-w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:-right-2 sm:w-[360px]"
            id="whatsapp-sim-chat"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white dark:bg-emerald-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                      OA
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-emerald-600"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wider text-emerald-100 uppercase">Interactive simulation</h4>
                    <h3 className="text-sm font-bold font-sans">AppointO WhatsApp AI</h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-700/50"
                  id="close-whatsapp-chat"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Body messages area */}
            <div className="h-[260px] overflow-y-auto p-4 space-y-3" id="whatsapp-scroll-area">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.sender === 'system' ? (
                    <div className="flex justify-center text-center my-1.5">
                      <span className="rounded bg-emerald-100/60 px-2 py-0.5 text-[10px] text-emerald-800 font-bold dark:bg-slate-800 dark:text-emerald-400">
                        {msg.text}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-2.5 text-xs shadow-sm leading-normal ${
                          msg.sender === 'user'
                            ? 'bg-emerald-500 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="block text-right text-[8px] text-slate-400 mt-1 font-mono font-bold uppercase">
                          {msg.time} {msg.sender === 'user' && '✓✓'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-3 py-1.5 text-xs text-slate-400 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <span className="animate-pulse">AI Agent typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies Chips triggers */}
            <div className="px-3 py-2 border-t border-slate-200/40 bg-white/70 backdrop-blur-sm dark:bg-slate-900/60">
              <span className="text-[10px] font-bold text-slate-500 block mb-1">Quick Select Reply:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => handleSendMessage("📅 Book a trial slot")}
                  className="whitespace-nowrap rounded-full border border-emerald-500 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  ⚡ Start Booking Demo
                </button>
                <button
                  onClick={() => handleSendMessage("💡 Explain ₹99 trial details")}
                  className="whitespace-nowrap rounded-full border border-slate-250 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                >
                  ₹99 Trial Details
                </button>
                <button
                  onClick={() => handleSendMessage("🗣️ Hindi language test")}
                  className="whitespace-nowrap rounded-full border border-slate-250 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                >
                  Hindi Support
                </button>
              </div>
            </div>

            {/* Typing box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-1 bg-white p-2.5 border-t border-slate-150 dark:bg-slate-900 dark:border-slate-800"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a whatsapp reply..."
                className="flex-1 rounded-xl bg-slate-50 border border-slate-150 px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-emerald-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                id="whatsapp-sim-input"
              />
              <button
                type="submit"
                className="rounded-full bg-emerald-500 p-2 text-white hover:bg-emerald-600"
                id="whatsapp-sim-send"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
