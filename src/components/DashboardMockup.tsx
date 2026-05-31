import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar as CalendarIcon, TrendingUp, Bell, Search, Send, 
  MessageSquare, Sparkles, CheckSquare, RefreshCw, Smartphone, 
  Clock, Award, BookOpen, AlertCircle, ShoppingCart, Plus 
} from 'lucide-react';
import { Appointment, Message } from '../types';

interface DashboardMockupProps {
  appointments: Appointment[];
  onToggleStatus: (id: string) => void;
  onDeleteBooking: (id: string) => void;
  onTriggerDemoModal: () => void;
}

export default function DashboardMockup({
  appointments,
  onToggleStatus,
  onDeleteBooking,
  onTriggerDemoModal
}: DashboardMockupProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'ai-assistant' | 'analytics'>('today');
  
  // Local states for AI chat widget
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "👋 Hello! I am AppointO's Scheduling AI. I manage slots, broadcast multilingual WhatsApp alerts, and handle booking queries. Ask me anything or tap a shortcut below!",
      timestamp: 'Just now'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Stats calculate
  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => {
      // Custom estimated revenue per industry type
      const priceMap: Record<string, number> = {
        dental: 1200,
        clinics: 600,
        salons: 800,
        carwash: 450,
        physio: 1500,
        consultants: 3000
      };
      return sum + (priceMap[a.industry] || 500);
    }, 0);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const whatsappTriggers = appointments.filter(a => a.whatsappSent).length;

  const suggestChips = [
    { label: "Analyze business peak hours", text: "What are my busiest days and hours?" },
    { label: "Check Rajesh's status", text: "Did Rajesh Malhotra receive the WhatsApp appointment confirmation?" },
    { label: "Schedule promo blast", text: "Send a reminder with a 15% discount for off-peak Tuesday salon slots" }
  ];

  const handleSendChat = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // AI smart response simulations based on keyword analysis
    setTimeout(() => {
      let aiResponseText = "";
      const text = messageText.toLowerCase();

      if (text.includes('peak') || text.includes('hour') || text.includes('busiest') || text.includes('analyze')) {
        aiResponseText = "📈 **AppointO Automation Alert:** From analyzing your salon/clinic history, **Tuesday and Wednesday mornings (11:00 AM - 1:00 PM)** have the lowest traffic. AppointO is automated to send auto-discount chips to clients, boosting off-peak reservations by **34%**! 🚀";
      } else if (text.includes('rajesh') || text.includes('receive') || text.includes('status')) {
        aiResponseText = "🍏 **API Status verified:** Patient **Rajesh Malhotra** is booked for Root Canal Therapy at 11:00 AM today. The official WhatsApp notification was successfully delivered to his phone (+91 98xxx xx210) with 1-click confirm or reschedule links.";
      } else if (text.includes('promo') || text.includes('discount') || text.includes('blast')) {
        aiResponseText = "💬 **WhatsApp Blast Ready:** AppointO can auto-target 42 past salon customers who haven't visited in 30 days. Shall I launch a campaign for 'Tuesday Special 15% Off Haircut' via WhatsApp API? (This will cost 0 extra setup fees!)";
      } else {
        aiResponseText = `🤖 **AppointO Assistant:** Fascinating query! As a core scheduling AI, I can certainly automate that for you. In a live system, this manages Google Calendar integrations, triggers multi-channel WhatsApp updates, and helps Tier 2 & Tier 3 clinics and salons run completely on autopilot! Try simulating a demo booking to see its core logic.`;
      }

      setChatMessages(prev => [...prev, {
        id: `chat-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now'
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:p-5" id="hero-dashboard">
      
      {/* Mesh/Gradient Backdrop highlights */}
      <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      {/* Embedded Top Panel: Interactive SaaS Mockup Header */}
      <div className="flex flex-col gap-3 border-b border-slate-150 pb-4 dark:border-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Live Sandbox Platform</span>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans">AppointO Workspace Clinic/Salon v2.6</h4>
          </div>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button 
            onClick={onTriggerDemoModal}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20"
            id="dash-add-booking-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            Simulate Booking
          </button>
        </div>
      </div>

      {/* Main SaaS Quick Stats Counters */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 dark:border-slate-900 dark:bg-slate-900/50">
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Revenue</span>
          </div>
          <p className="mt-1 text-base font-extrabold text-slate-800 dark:text-white sm:text-lg">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 dark:border-slate-900 dark:bg-slate-900/50">
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
          </div>
          <p className="mt-1 text-base font-extrabold text-slate-805 dark:text-white sm:text-lg">
            {pendingCount} appointments
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 dark:border-slate-900 dark:bg-slate-900/50">
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Sent</span>
          </div>
          <p className="mt-1 text-base font-extrabold text-green-600 dark:text-green-400 sm:text-lg">
            {whatsappTriggers} alerts
          </p>
        </div>
      </div>

      {/* Internal Tabs: Today's Bookings, AI Scheduling Bot, Historical Analysis */}
      <div className="mt-4 flex border-b border-slate-100 dark:border-slate-900">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
            activeTab === 'today'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-today-bookings"
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Today's Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition relative ${
            activeTab === 'ai-assistant'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-ai-assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          AI Scheduler Bot
          <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-purple-500"></span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-analytics"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Revenue Mix
        </button>
      </div>

      {/* Container holding each tab content */}
      <div className="mt-3 min-h-[290px]">
        {activeTab === 'today' && (
          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-xs font-semibold text-slate-400">All columns clear. Try simulating scheduling above!</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {appointments.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative flex items-center justify-between rounded-xl border p-3 transition ${
                      app.status === 'confirmed' 
                        ? 'border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20' 
                        : app.status === 'completed'
                        ? 'border-slate-100 bg-slate-50/40 dark:border-slate-800/10'
                        : 'border-yellow-101 bg-yellow-50/10 dark:border-yellow-950/20'
                    }`}
                    id={`appt-row-${app.id}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Interactive toggle of state */}
                      <button
                        onClick={() => onToggleStatus(app.id)}
                        className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                          app.status === 'confirmed' || app.status === 'completed'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-300 hover:border-blue-500 bg-white dark:bg-slate-900'
                        }`}
                        title="Click to toggle check-in status"
                        id={`toggle-status-${app.id}`}
                      >
                        {(app.status === 'confirmed' || app.status === 'completed') && <CheckSquare className="h-3.5 w-3.5" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">{app.customerName}</h5>
                          {app.whatsappSent && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[9px] font-bold text-green-600 dark:bg-emerald-950/40 dark:text-green-400">
                              💬 WhatsApp Sent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{app.service}</span>
                          <span>•</span>
                          <span>{app.staffName || 'Any Specialist'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                          <Clock className="h-2.5 w-2.5" />
                          {app.time}
                        </span>
                        <div className="mt-0.5 text-[9px] text-slate-400">
                          {app.date}
                        </div>
                      </div>

                      {/* Delete icon */}
                      <button
                        onClick={() => onDeleteBooking(app.id)}
                        className="rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        title="Cancel reservation"
                        id={`delete-booking-${app.id}`}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          <div className="flex flex-col h-[290px] rounded-xl border border-slate-100 bg-slate-50/30 p-2 dark:border-slate-900 dark:bg-slate-950/40">
            {/* Chat message box log */}
            <div className="flex-1 overflow-y-auto space-y-2 p-2" id="chat-messages-container">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <span className="animate-pulse">AppointO AI Agent typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Chips Action */}
            <div className="p-1 border-t border-slate-100 dark:border-slate-900">
              <span className="text-[9px] font-bold text-slate-400 block mb-1">Click a dynamic AI template prompt:</span>
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {suggestChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChat(chip.text)}
                    className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                    id={`chip-prompt-${idx}`}
                  >
                    💡 {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom text form input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(userInput);
              }}
              className="mt-1 flex gap-1 items-center border-t border-slate-100 pt-2 dark:border-slate-900"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask AppointO AI to reschedule, draft text..."
                className="flex-1 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                id="ai-widget-input"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                id="ai-widget-send-btn"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-slate-900 dark:bg-slate-950/40 flex flex-col justify-between h-[290px] animate-fadeIn">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dashboard Report</span>
              <h5 className="text-xs font-bold text-slate-850 dark:text-white mt-1">Multi-Channel Reservation Optimization Mix</h5>
              <p className="text-[11px] text-slate-500 mt-1">Automated WhatsApp outreach boosts slot booking capacity by an average of 34% in Tier-2 and Tier-3 cities.</p>
            </div>

            {/* Stylized visual indicators */}
            <div className="space-y-3 my-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Direct Web & QR Link Bookings
                  </span>
                  <span>45%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    WhatsApp Conversational Bot Scheduling
                  </span>
                  <span>40%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Offline Walks-Ins queue logs
                  </span>
                  <span>15%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50/50 p-2 text-[10px] text-blue-700 font-bold dark:bg-blue-950/20 dark:text-blue-400 flex items-center gap-1">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span>AI analytics predicts Sunday mornings might see a 24% dental seat overbook. Staff notifications fired.</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Elements simulated within card boundaries */}
      <div className="absolute -right-3 bottom-12 hidden md:block select-none pointer-events-none transform translate-x-2">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-3 shadow-lg dark:bg-slate-900 max-w-[190px]"
        >
          <div className="flex gap-2">
            <span className="mt-0.5 flex h-4 w-4 bg-green-500 text-white rounded-full items-center justify-center text-[10px]">&#10003;</span>
            <div>
              <p className="text-[10px] font-bold text-slate-800 dark:text-white leading-tight">WhatsApp Notification</p>
              <p className="mt-0.5 text-[9px] text-slate-500 line-clamp-2">Alert sent successfully: Hi Rajesh! Booking verified.</p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
