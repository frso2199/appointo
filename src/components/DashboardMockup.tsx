import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar as CalendarIcon, TrendingUp, Bell, Search, Send, 
  MessageSquare, Sparkles, CheckSquare, RefreshCw, Smartphone, 
  Clock, Award, BookOpen, AlertCircle, ShoppingCart, Plus,
  CreditCard, ShieldCheck, CheckCircle2, ChevronRight, User, Mail, Download, Layers, MapPin, Building
} from 'lucide-react';
import { Appointment, Message } from '../types';

interface DashboardMockupProps {
  appointments: Appointment[];
  onToggleStatus: (id: string) => void;
  onDeleteBooking: (id: string) => void;
  onTriggerDemoModal: () => void;
  activeSubscription?: any;
  onRefreshSubscription?: () => void;
}

export default function DashboardMockup({
  appointments,
  onToggleStatus,
  onDeleteBooking,
  onTriggerDemoModal,
  activeSubscription,
  onRefreshSubscription
}: DashboardMockupProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'ai-assistant' | 'analytics' | 'billing'>('today');
  
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

  // SaaS Billing States
  const [localSub, setLocalSub] = useState<any>(null);
  const [localPayments, setLocalPayments] = useState<any[]>([]);
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [billingFeedback, setBillingFeedback] = useState({ type: 'success', message: '' });

  // Update card state
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cardLast4, setCardLast4] = useState('4242');
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);

  // Invoices printer state
  const [printingInvoice, setPrintingInvoice] = useState<any>(null);

  // Stats calculate
  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => {
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

  // Fetch local user subscription parameters and SaaS analytics
  const fetchBillingData = async () => {
    setIsBillingLoading(true);
    try {
      // Fetch active subscriber detail
      const resStatus = await fetch('/api/subscription-status');
      const statusData = await resStatus.json();
      if (resStatus.ok && statusData.success) {
        setLocalSub(statusData.subscription);
        setLocalPayments(statusData.payments || []);
        setLocalProfile(statusData.profile);
      }

      // Fetch dynamic aggregated SaaS analytics
      const resAnalytics = await fetch('/api/subscription-analytics');
      const analyticData = await resAnalytics.json();
      if (resAnalytics.ok && analyticData.success) {
        setAnalytics(analyticData.metrics);
      }
    } catch (err) {
      console.error('[Dashboard GUI] Error fetching billing metrics:', err);
    } finally {
      setIsBillingLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, [activeTab, activeSubscription]);

  const handleSendChat = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: `chat-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      sender: 'user',
      text: messageText,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

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
        id: `chat-${Date.now() + 1}-${Math.floor(Math.random() * 100000)}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now'
      }]);
      setIsTyping(false);
    }, 1200);
  };

  // Upgrades
  const handleUpgrade = async (tier: 'Professional' | 'Business') => {
    setBillingFeedback({ type: 'success', message: '' });
    try {
      const res = await fetch('/api/subscription-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlan: tier, updateType: 'immediate' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBillingFeedback({ type: 'success', message: `🚀 Successfully upgraded to ${tier} Plan! Prorated invoice generated.` });
        if (onRefreshSubscription) onRefreshSubscription();
        fetchBillingData();
      } else {
        setBillingFeedback({ type: 'failed', message: data.error || 'Failed to complete upgrade' });
      }
    } catch (err: any) {
      setBillingFeedback({ type: 'failed', message: err.message });
    }
  };

  // Downgrade
  const handleDowngrade = async (tier: 'Starter' | 'Professional') => {
    setBillingFeedback({ type: 'success', message: '' });
    try {
      const res = await fetch('/api/subscription-downgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlan: tier })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBillingFeedback({ type: 'success', message: `⬇️ Downgrade scheduled to ${tier} Plan. Applies commencing next billing date.` });
        if (onRefreshSubscription) onRefreshSubscription();
        fetchBillingData();
      } else {
        setBillingFeedback({ type: 'failed', message: data.error || 'Downgrade failed' });
      }
    } catch (err: any) {
      setBillingFeedback({ type: 'failed', message: err.message });
    }
  };

  // Cancel subscription
  const handleCancelSub = async () => {
    setBillingFeedback({ type: 'success', message: '' });
    if (!window.confirm('Are you absolutely sure you want to cancel your AppointO Subscription? Benefit tiers will remain active until end of transition billing cycle.')) {
      return;
    }
    try {
      const res = await fetch('/api/subscription-cancel', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setBillingFeedback({ type: 'success', message: '⚠️ Subscription cancelled. Benefit access will terminate soon.' });
        if (onRefreshSubscription) onRefreshSubscription();
        fetchBillingData();
      } else {
        setBillingFeedback({ type: 'failed', message: data.error || 'Cancel failed' });
      }
    } catch (err: any) {
      setBillingFeedback({ type: 'failed', message: err.message });
    }
  };

  // Update card payment method
  const handleUpdatePaymentCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingCard(true);
    setBillingFeedback({ type: 'success', message: '' });
    try {
      const res = await fetch('/api/subscription-update-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardBrand, last4: cardLast4 })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBillingFeedback({ type: 'success', message: `💳 Card elements successfully updated to ${cardBrand} *${cardLast4}` });
        fetchBillingData();
      } else {
        setBillingFeedback({ type: 'failed', message: data.error || 'Failed to update payment method.' });
      }
    } catch (err: any) {
      setBillingFeedback({ type: 'failed', message: err.message });
    } finally {
      setIsUpdatingCard(false);
    }
  };

  // Dynamic Trial Days remaining calculator
  const getTrialDaysRemaining = () => {
    if (!localSub || localSub.status !== 'TRIAL') return 0;
    const end = new Date(localSub.trial_end_date).getTime();
    const diff = end - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const trialDaysLeft = getTrialDaysRemaining();

  return (
    <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-slate-205 bg-white p-3 sm:p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950" id="hero-dashboard">
      
      {/* Mesh Backdrops */}
      <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      {/* Interactive Top Header */}
      <div className="flex flex-col gap-3 border-b border-slate-150 pb-4 dark:border-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Live Sandbox Platform</span>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans">
              AppointO Workspace Clinic/Salon v2.6
            </h4>
          </div>
        </div>
        
        {/* Quick billing status pill */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto sm:justify-end">
          {localSub && (
            <span 
              onClick={() => setActiveTab('billing')}
              className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest cursor-pointer hover:opacity-80 transition flex items-center gap-1 shrink-0 ${
                localSub.status === 'TRIAL' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400'
                  : localSub.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-rose-100 text-rose-850 dark:bg-rose-950/40 dark:text-rose-450'
              }`}
            >
              <Award className="h-3 w-3" />
              {localSub.status} Plan: {localSub.plan_name}
            </span>
          )}

          <button 
            onClick={onTriggerDemoModal}
            className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-extrabold text-white transition hover:bg-blue-700 hover:shadow-lg w-auto shrink-0"
            id="dash-add-booking-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            Simulate Slot
          </button>
        </div>
      </div>

      {/* Main SaaS Quick Stats Counters */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2.5">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-1.5 sm:p-2.5 dark:border-slate-900 dark:bg-slate-900/50">
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <TrendingUp className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-500 shrink-0" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider truncate">Revenue</span>
          </div>
          <p className="mt-0.5 sm:mt-1 text-xs font-extrabold text-slate-800 dark:text-white sm:text-base">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>
 
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-1.5 sm:p-2.5 dark:border-blue-900/30 dark:bg-blue-950/20">
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Users className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-blue-500 shrink-0" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider truncate">Pending</span>
          </div>
          <p className="mt-0.5 sm:mt-1 text-xs font-extrabold text-blue-700 dark:text-blue-300 sm:text-base">
            {pendingCount} sls
          </p>
        </div>
 
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-1.5 sm:p-2.5 dark:border-slate-900 dark:bg-slate-900/50">
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <Smartphone className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-400 shrink-0" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider truncate">WhatsApp</span>
          </div>
          <p className="mt-0.5 sm:mt-1 text-xs font-extrabold text-green-600 dark:text-green-400 sm:text-base">
            {whatsappTriggers} snt
          </p>
        </div>
      </div>

      {/* Tabs list (added SaaS Billing Dashboard tab) */}
      <div className="mt-4 flex border-b border-slate-100 dark:border-slate-900 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-bold transition whitespace-nowrap shrink-0 ${
            activeTab === 'today'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-today-bookings"
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Today's Slots ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-bold transition relative whitespace-nowrap shrink-0 ${
            activeTab === 'ai-assistant'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-ai-assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          AI Chat Agent
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-bold transition whitespace-nowrap shrink-0 ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-analytics"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Revenue Mix
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-bold transition whitespace-nowrap shrink-0 ${
            activeTab === 'billing'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          id="tab-billing-dashboard"
        >
          <CreditCard className="h-3.5 w-3.5 text-blue-500" />
          SaaS Billing & CRM Stats
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-3 min-h-[300px]">
        {activeTab === 'today' && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
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
                    className={`relative flex items-center justify-between rounded-xl border p-2.5 transition ${
                      app.status === 'confirmed' 
                        ? 'border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20' 
                        : app.status === 'completed'
                        ? 'border-slate-150 bg-slate-50/40 dark:border-slate-800/10'
                        : 'border-yellow-101 bg-yellow-50/10 dark:border-yellow-950/20'
                    }`}
                    id={`appt-row-${app.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleStatus(app.id)}
                        className={`flex h-5 w-5 items-center justify-center rounded-lg border transition ${
                          app.status === 'confirmed' || app.status === 'completed'
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-300 hover:border-blue-500 bg-white dark:bg-slate-900'
                        }`}
                        title="Click to toggle check-in status"
                        id={`toggle-status-${app.id}`}
                      >
                        {(app.status === 'confirmed' || app.status === 'completed') && <CheckSquare className="h-3 w-3" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-[11.5px] font-bold text-slate-850 dark:text-slate-100 font-sans">{app.customerName}</h5>
                          {app.whatsappSent && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[8.5px] font-bold text-green-600 dark:bg-emerald-950/40 dark:text-green-400">
                              💬 SMS sent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[9.5px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-350">{app.service}</span>
                          <span>•</span>
                          <span>{app.staffName || 'Any Specialist'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[9.5px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                          <Clock className="h-2.5 w-2.5" />
                          {app.time}
                        </span>
                        <div className="mt-0.5 text-[8.5px] text-slate-450">
                          {app.date}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteBooking(app.id)}
                        className="rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        title="Cancel reservation"
                        id={`delete-booking-${app.id}`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* AI Assistant Chat view */}
        {activeTab === 'ai-assistant' && (
          <div className="flex flex-col h-[300px] rounded-xl border border-slate-100 bg-slate-50/30 p-2 dark:border-slate-900 dark:bg-slate-950/40">
            <div className="flex-1 overflow-y-auto space-y-2 p-2" id="chat-messages-container">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-semibold'
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
                  <div className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 border border-slate-100 dark:bg-slate-850 dark:border-slate-700">
                    <span className="animate-pulse">Bot processing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-1 border-t border-slate-100 dark:border-slate-900">
              <span className="text-[8.5px] font-bold text-slate-400 block mb-1 uppercase">Instant AI Queries:</span>
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {suggestChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChat(chip.text)}
                    className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 cursor-pointer"
                  >
                    💡 {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(userInput);
              }}
              className="mt-1 flex gap-1 items-center border-t border-slate-100 pt-1.5 dark:border-slate-900"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask AppointO AI to automate reminders..."
                className="flex-1 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-905 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Standard Analytical Revenue mix */}
        {activeTab === 'analytics' && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-slate-900 dark:bg-slate-950/40 flex flex-col justify-between h-[300px] animate-fadeIn">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dashboard Report</span>
              <h5 className="text-xs font-bold text-slate-800 dark:text-white mt-1">Multi-Channel Reservation Optimization Mix</h5>
              <p className="text-[10px] text-slate-550 mt-1 font-medium leading-relaxed">Automated WhatsApp outreach boosts slot booking capacity by an average of 34% in Tier-2 and Tier-3 cities.</p>
            </div>

            <div className="space-y-2.5 my-3">
              <div>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Direct Web & QR Link Bookings
                  </span>
                  <span>45%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    WhatsApp Conversational Bot Scheduling
                  </span>
                  <span>40%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Offline Walks-Ins queue logs
                  </span>
                  <span>15%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 p-2 text-[10px] text-[#2563EB] font-bold dark:bg-blue-950/20 dark:border-slate-900 dark:text-blue-400 flex items-center gap-1">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span>AI analytics predicts Sunday mornings might see a 24% dental seat overbook. Staff notifications fired.</span>
            </div>
          </div>
        )}

        {/* 🏢 SaaS Billing Dashboard panel */}
        {activeTab === 'billing' && (
          <div className="animate-fadeIn space-y-4 max-h-[300px] overflow-y-auto pr-1">
            
            {/* Feedback alert messages */}
            {billingFeedback.message && (
              <div 
                className={`p-3 rounded-xl border text-xs font-semibold leading-tight flex items-start gap-1.5 ${
                  billingFeedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/25 dark:border-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/25 dark:border-rose-900/30 dark:text-rose-450'
                }`}
              >
                <div className="shrink-0">&#9679;</div>
                <span>{billingFeedback.message}</span>
              </div>
            )}

            {!localSub ? (
              <div className="text-center py-10 space-y-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <CreditCard className="h-10 w-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h5 className="text-xs font-extrabold text-slate-850 dark:text-white">SaaS Evaluation Sandbox Unit</h5>
                  <p className="text-[10px] text-slate-400 max-w-sm mx-auto font-medium">
                    No active premium workspace found. Buy monthly scheduling license to leverage AI WhatsApp engines, calendar integrations and custom SMS features!
                  </p>
                </div>
                <button
                  onClick={onTriggerDemoModal}
                  className="rounded-lg bg-[#2563EB] hover:bg-blue-650 font-bold px-3 py-1.5 text-[10.5px] uppercase tracking-wider text-white transition shrink-0 cursor-pointer"
                >
                  🚀 Activate 30-Day Trial Offer
                </button>
              </div>
            ) : (
              /* ACTIVE BILLING PANEL */
              <div className="space-y-4">
                
                {/* 1. Subscription Profile Summary card */}
                <div className="rounded-xl border border-slate-150 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                    <div>
                      <span className="text-[9px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest block">Active Workspace</span>
                      <h4 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wide">
                        {localProfile?.business_name || 'My Clinic/Salon Workspace'}
                      </h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">
                        Category: {localProfile?.category || 'Clinic'} • Owner: {localProfile?.owner_name || 'Sandbox Admin'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex rounded-full bg-blue-600/15 border border-blue-600/30 px-2 py-0.5 text-[8.5px] font-black tracking-widest text-[#2563EB] uppercase">
                        {localSub.plan_name} PLAN
                      </span>
                      <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">
                        Status: <strong className="text-emerald-500 uppercase">{localSub.status}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Pricing and TRIAL calculations */}
                  <div className="grid grid-cols-2 gap-3.5 text-[10.5px]">
                    <div className="space-y-0.5 font-semibold">
                      <span className="text-[8.5px] font-bold text-slate-405 uppercase block">Evaluation Status</span>
                      {localSub.status === 'TRIAL' ? (
                        <p className="text-[#D97706] font-extrabold flex items-center gap-1">
                          <span>⏳ {trialDaysLeft} Days Left inside Free Trial</span>
                        </p>
                      ) : (
                        <p className="text-emerald-600 font-extrabold">✓ Full Premium Subscription Active</p>
                      )}
                    </div>

                    <div className="space-y-0.5 font-semibold">
                      <span className="text-[8.5px] font-bold text-slate-405 uppercase block">First Billing Date</span>
                      <p className="text-slate-800 dark:text-white font-bold">
                        {new Date(localSub.next_billing_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Unified Upgrades / Downgrades Options Table */}
                <div className="rounded-xl border border-slate-150 p-3 dark:border-slate-800">
                  <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-blue-500" />
                    Modify Plan Tier / Subscription Actions
                  </h5>

                  <div className="space-y-2">
                    {[
                      { name: 'Starter' as const, price: 499, text: 'Upgrade/Downgrade to Starter' },
                      { name: 'Professional' as const, price: 999, text: 'Upgrade/Downgrade to Professional' },
                      { name: 'Business' as const, price: 1999, text: 'Upgrade/Downgrade to Business' }
                    ].map((plan) => {
                      const isCurrent = localSub.plan_name === plan.name;
                      const planWeight = { Starter: 1, Professional: 2, Business: 3 };
                      const isUpgrade = planWeight[plan.name] > planWeight[localSub.plan_name as 'Starter' | 'Professional' | 'Business'];

                      return (
                        <div key={plan.name} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-[10.5px]">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-white">{plan.name} Package</span>
                            <span className="text-slate-400 ml-1.5">(₹{plan.price}/month)</span>
                          </div>

                          {isCurrent ? (
                            <span className="rounded bg-slate-100 text-slate-700 font-extrabold px-2 py-0.5 text-[8.5px] uppercase dark:bg-slate-800 dark:text-slate-350">
                              Active Plan
                            </span>
                          ) : (
                            <button
                              onClick={() => isUpgrade ? handleUpgrade(plan.name as any) : handleDowngrade(plan.name as any)}
                              className={`rounded font-bold px-2.5 py-1 text-[9px] uppercase tracking-wide cursor-pointer transition shrink-0 ${
                                isUpgrade 
                                  ? 'bg-[#2563EB] text-white hover:bg-blue-600' 
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100 hover:opacity-80'
                              }`}
                            >
                              {isUpgrade ? `Upgrade Now (Prorated)` : `Downgrade (Next Cycle)`}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Manage Methods & Cancel */}
                <div className="grid sm:grid-cols-2 gap-3">
                  
                  {/* Card update block */}
                  <form onSubmit={handleUpdatePaymentCard} className="rounded-xl border border-slate-150 p-3 dark:border-slate-800 space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Update Payment Method</span>
                    
                    <div className="flex gap-2.5">
                      <select 
                        value={cardBrand}
                        onChange={(e) => setCardBrand(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-[10px] outline-none max-w-[100px] dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="Rupay">Rupay</option>
                        <option value="Amex">Amex</option>
                      </select>

                      <input 
                        type="text" 
                        required
                        maxLength={4}
                        minLength={4}
                        value={cardLast4}
                        onChange={(e) => setCardLast4(e.target.value.replace(/\D/g,''))}
                        placeholder="Last 4"
                        className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-[10px] outline-none flex-1 min-w-0 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingCard}
                      className="w-full text-center rounded-lg bg-slate-900 hover:bg-slate-800 font-bold py-1.5 text-[9px] uppercase tracking-wide text-white transition cursor-pointer dark:bg-white dark:text-slate-950"
                    >
                      {isUpdatingCard ? 'Updating card...' : '💳 Update Card details'}
                    </button>
                  </form>

                  {/* Cancel subscription block */}
                  <div className="rounded-xl border border-slate-150 p-3 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Cancel AppointO benefits</span>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1 leading-normal">
                        Soft cancelling avoids instant cutoff, retaining evaluation perks until your 30-day billing cycle completes.
                      </p>
                    </div>

                    <button
                      onClick={handleCancelSub}
                      disabled={localSub.status === 'CANCELLED'}
                      className={`w-full text-center rounded-lg font-bold py-1.5 text-[9px] uppercase tracking-wide transition cursor-pointer ${
                        localSub.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-500 border border-rose-200 shrink-0 cursor-not-allowed opacity-60'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40'
                      }`}
                    >
                      {localSub.status === 'CANCELLED' ? '⚠️ Subscription Cancelled' : 'Cancel Scheduling Plan'}
                    </button>
                  </div>
                </div>

                {/* 4. Invoices Simulation and Payment Ledger */}
                <div className="rounded-xl border border-slate-150 p-3 dark:border-slate-800">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Captured Receipts & Invoice History
                  </span>

                  <div className="space-y-1.5">
                    {localPayments.length === 0 ? (
                      <p className="text-[10px] text-slate-400 font-medium">No transacted invoices captured.</p>
                    ) : (
                      localPayments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg text-[10px] dark:bg-slate-900/50 dark:border-slate-850">
                          <div className="font-semibold space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="rounded bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 text-[7px] font-black uppercase">Captured</span>
                              <span className="text-slate-850 dark:text-white">Amt: ₹{p.amount}.00</span>
                            </div>
                            <p className="text-[8px] text-slate-405">Code: {p.razorpay_payment_id}</p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] text-slate-400 font-bold">{new Date(p.created_at).toLocaleDateString()}</span>
                            <button
                              onClick={() => setPrintingInvoice(p)}
                              className="rounded bg-white border border-slate-200 hover:border-blue-500 p-1 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition cursor-pointer"
                              title="Download PDF Invoice"
                            >
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 5. Live SaaS Analytics KPI section */}
                {analytics && (
                  <div className="rounded-xl border-t-2 border-t-blue-600 border border-slate-150 bg-blue-50/10 p-3 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400 uppercase tracking-widest block">
                        Platform SaaS Analytics Panel (Admin View)
                      </span>
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">Active Subs</span>
                        <strong className="text-sm text-slate-850 dark:text-white font-mono uppercase font-black">
                          {analytics.activeSubscribers}
                        </strong>
                      </div>

                      <div className="p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">Monthly MRR</span>
                        <strong className="text-sm text-slate-850 dark:text-white font-mono uppercase font-black">
                          ₹{analytics.mrr}
                        </strong>
                      </div>

                      <div className="p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">Annual ARR</span>
                        <strong className="text-sm text-blue-600 dark:text-cyan-400 font-mono uppercase font-black">
                          ₹{analytics.arr}
                        </strong>
                      </div>

                      <div className="p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-bold">LTV Metric</span>
                        <strong className="text-sm text-slate-850 dark:text-white font-mono uppercase font-black">
                          ₹{analytics.clv}
                        </strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-950 p-2 rounded-xl border dark:border-slate-850">
                      <div>
                        <span className="text-[8.5px] text-slate-400 block font-bold">Trial Conversion</span>
                        <span className="font-extrabold text-slate-800 dark:text-white font-mono">{analytics.trialConversionRate}%</span>
                      </div>
                      <div>
                        <span className="text-[8.5px] text-slate-400 block font-bold">Churn Ratio</span>
                        <span className="font-extrabold text-slate-850 dark:text-white font-mono">{analytics.churnRate}%</span>
                      </div>
                      <div>
                        <span className="text-[8.5px] text-slate-400 block font-bold">Failed Collections</span>
                        <span className="font-extrabold text-rose-500 font-mono">{analytics.failedPaymentsCount} logs</span>
                      </div>
                    </div>

                    <div className="text-[9px] text-left text-slate-405 leading-normal bg-blue-50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-105/20 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-[#2563EB]" />
                      <span>SaaS revenue calculations are updated in real-time by mining localized database layers and active payment entities.</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating alert within mockup cards */}
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
              <p className="text-[10px] font-black text-slate-800 dark:text-white leading-tight">AppointO Notify</p>
              <p className="mt-0.5 text-[9px] text-slate-500 line-clamp-2 leading-snug">SaaS engine synced. Scheduling triggers linked successfully.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gorgeous Invoice PDF modal mock overlay */}
      <AnimatePresence>
        {printingInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70" onClick={() => setPrintingInvoice(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border text-slate-800 dark:text-slate-100"
            >
              <div className="border-b border-dashed pb-3 space-y-1 text-center">
                <h4 className="text-sm font-black uppercase text-[#2563EB] tracking-widest">AppointO Systems India</h4>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Standard SaaS Billing Receipt</p>
                <p className="text-[10px] text-slate-500 font-mono">Invoice Reference: INV-{printingInvoice.id}</p>
              </div>

              <div className="py-4 space-y-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Merchant Address:</span>
                  <span className="text-slate-800 dark:text-white text-right">AppointO Software LLP<br/>Pune, Maharashtra</span>
                </div>
                <div className="flex justify-between">
                  <span>Subscriber Entity:</span>
                  <strong className="text-slate-850 dark:text-white">{localProfile?.business_name || 'Standard Client'}</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Transacted ID:</span>
                  <span>{printingInvoice.razorpay_payment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Type:</span>
                  <span className="rounded bg-blue-105/30 px-1.5 py-0.5 text-[9px] font-black text-blue-600 uppercase">
                    {printingInvoice.payment_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Captured On:</span>
                  <span>{new Date(printingInvoice.created_at).toLocaleString()}</span>
                </div>

                <div className="border-t border-dashed pt-2 flex justify-between text-lg font-black text-[#2563EB] dark:text-cyan-400">
                  <span>TOTAL CAPTURED:</span>
                  <span>INR {printingInvoice.amount}.00</span>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-405 leading-relaxed py-2 border-t font-semibold">
                This secure receipt acts as tax-compliant GST documentation. Activated via digital Razorpay integration.
              </div>

              <button
                onClick={() => setPrintingInvoice(null)}
                className="w-full mt-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white py-1.5 text-xs font-bold transition uppercase tracking-wide cursor-pointer dark:bg-white dark:text-slate-950"
              >
                Close Receipt View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
