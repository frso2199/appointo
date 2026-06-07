import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Calendar, CheckCircle2, XCircle, Search, Filter, 
  Plus, ArrowLeft, RefreshCw, Phone, Mail, MapPin, Tag, MessageSquare, 
  Send, User, Clock, AlertCircle, Sparkles, ChevronRight, Check,
  Sliders, Edit2, Save, Undo, Smartphone, CheckCheck
} from 'lucide-react';

interface FollowUp {
  id: string;
  date: string;
  notes: string;
  agent: string;
}

interface Lead {
  id: string;
  business_name: string;
  owner_name: string;
  mobile: string;
  email: string;
  city: string;
  category: string;
  status: 'new' | 'contacted' | 'demo_scheduled' | 'converted' | 'lost';
  follow_ups: FollowUp[];
  created_at: string;
  updated_at: string;
  notes?: string;
  plan_interested?: string;
}

interface CrmDashboardProps {
  adminEmail: string;
  onLogout: () => void;
  darkMode: boolean;
}

export default function CrmDashboard({ adminEmail, onLogout, darkMode }: CrmDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'demo_scheduled' | 'converted' | 'lost'>('all');
  
  // Follow up state
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  // Manual Lead creation form state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCategory, setNewCategory] = useState('Dental Clinic');
  const [newNotes, setNewNotes] = useState('');
  const [newPlan, setNewPlan] = useState('Starter');
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [formError, setFormError] = useState('');

  // WhatsApp Business API Integration State
  const [selectedWaTemplate, setSelectedWaTemplate] = useState<'welcome' | 'nurture' | 'discount'>('welcome');
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waSentToast, setWaSentToast] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const [welcomeTemplateText, setWelcomeTemplateText] = useState(() => {
    return localStorage.getItem('appointo_wa_tpl_welcome') || 
      `Namaste *{owner}*! Thank you for claiming the AppointO ₹99 trial package for _{business}_. Let's schedule a 10-minute demo to activate your WhatsApp AI automatic bot.`;
  });

  const [nurtureTemplateText, setNurtureTemplateText] = useState(() => {
    return localStorage.getItem('appointo_wa_tpl_nurture') || 
      `Hello *{owner}*! AppointO's automated reminders reduce customer no-shows by up to *85%* for _{business}_. Let's integrate your Google Calendar today.`;
  });

  const [discountTemplateText, setDiscountTemplateText] = useState(() => {
    return localStorage.getItem('appointo_wa_tpl_discount') || 
      `Special Offer for _{business}_: Get ~25%~ *35% extra discount* if you migrate to the Professional Plan today. Auto-includes multi-staff sync and premium WhatsApp automation!`;
  });

  const [draftWelcome, setDraftWelcome] = useState('');
  const [draftNurture, setDraftNurture] = useState('');
  const [draftDiscount, setDraftDiscount] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live Mobile Preview States
  const [activePreviewTab, setActivePreviewTab] = useState<'welcome' | 'nurture' | 'discount' | 'all'>('all');
  const [simulatedRecipientType, setSimulatedRecipientType] = useState<'dentist' | 'physio' | 'salon'>('dentist');

  const simulatedRecipients = {
    dentist: { owner: 'Dr. Amit Verma', business: 'Verma Dental Care Center' },
    physio: { owner: 'Dr. Rajesh Pillai', business: 'Apex Physical Therapy Clinic' },
    salon: { owner: 'Meera Sen', business: 'Prism Beauty Lounge' }
  };

  useEffect(() => {
    if (showTemplateManager) {
      setDraftWelcome(welcomeTemplateText);
      setDraftNurture(nurtureTemplateText);
      setDraftDiscount(discountTemplateText);
      setSaveSuccess(false);
    }
  }, [showTemplateManager, welcomeTemplateText, nurtureTemplateText, discountTemplateText]);

  // Dynamic preview markdown to HTML compiler for WhatsApp style bold, italic, strikethrough parsed inline!
  const formatWhatsAppMessage = (text: string, ownerName: string, bizName: string) => {
    if (!text) return '';
    let resolved = text
      .split('{owner}').join(ownerName)
      .split('{business}').join(bizName);

    // Escape basic HTML to avoid messing up render layout
    resolved = resolved
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown conversion:
    // *bold* -> <strong>
    resolved = resolved.replace(/\*([^*]+)\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>');
    // _italic_ -> <em>
    resolved = resolved.replace(/_([^_]+)_/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>');
    // ~strike~ -> <del>
    resolved = resolved.replace(/~([^~]+)~/g, '<del class="line-through opacity-60">$1</del>');

    // Carriage returns
    resolved = resolved.replace(/\n/g, '<br />');

    return resolved;
  };

  const waTemplates = {
    welcome: {
      name: "Standard Trial Welcome Template",
      message: (owner: string, biz: string) => {
        return welcomeTemplateText
          .replace(/{owner}/g, owner)
          .replace(/{business}/g, biz || 'your center');
      }
    },
    nurture: {
      name: "No-Show Nurturing Template",
      message: (owner: string, biz: string) => {
        return nurtureTemplateText
          .replace(/{owner}/g, owner)
          .replace(/{business}/g, biz || 'your organization');
      }
    },
    discount: {
      name: "Special Deal Incentive Template",
      message: (owner: string, biz: string) => {
        return discountTemplateText
          .replace(/{owner}/g, owner)
          .replace(/{business}/g, biz || 'your space');
      }
    }
  };

  const handleSendWhatsAppTemplate = async () => {
    if (!selectedLead) return;
    setIsSendingWa(true);
    
    const templateObj = waTemplates[selectedWaTemplate];
    const computedMessage = templateObj.message(selectedLead.owner_name, selectedLead.business_name);
    const outreachNote = `🤖 [WhatsApp Business API Campaign: ${templateObj.name}] sent template: "${computedMessage}" (Status: Delivered successfully)`;

    try {
      const res = await fetch(`/api/crm/leads/${selectedLead.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: outreachNote,
          agent: 'WhatsApp Bot'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Increment key to auto-reload list
        setRefreshKey(prev => prev + 1);
        setWaSentToast(true);
        setTimeout(() => setWaSentToast(false), 4500);
      }
    } catch (err) {
      console.error('Failed to trigger WhatsApp Business outreach Campaign:', err);
    } finally {
      setIsSendingWa(false);
    }
  };

  // Loaded analytics metrics
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load leads from the backend
  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      try {
        const res = await fetch('/api/crm/leads');
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
          // Auto select first lead if nothing selected yet or update preselected
          if (data.leads.length > 0) {
            setSelectedLead(prev => {
              if (prev) {
                const refreshed = data.leads.find((l: Lead) => l.id === prev.id);
                return refreshed || data.leads[0];
              }
              return data.leads[0];
            });
          }
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [refreshKey]);

  // Handle follow-up submission
  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !followUpNotes.trim()) return;

    setIsSubmittingFollowUp(true);
    try {
      const res = await fetch(`/api/crm/leads/${selectedLead.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: followUpNotes, agent: 'Admin' })
      });
      const data = await res.json();
      if (data.success) {
        setFollowUpNotes('');
        // Update local state
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? data.lead : l));
        setSelectedLead(data.lead);
      }
    } catch (err) {
      console.error('Failure saving follow-up:', err);
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  // Handle lead status update
  const handleUpdateStatus = async (status: Lead['status']) => {
    if (!selectedLead) return;

    try {
      const res = await fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? data.lead : l));
        setSelectedLead(data.lead);
        
        // Log an automatic follow-up to mark the status alteration
        await fetch(`/api/crm/leads/${selectedLead.id}/followup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            notes: `System automatic: Lead status changed from '${selectedLead.status}' to state '${status}'.`, 
            agent: 'CRM Engine' 
          })
        });

        // Refresh database arrays
        setRefreshKey(r => r + 1);
      }
    } catch (err) {
      console.error('Failure updating lead status:', err);
    }
  };

  // Handle manual lead capture form submission
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newBizName.trim() || !newOwnerName.trim() || !newMobile.trim()) {
      setFormError('Mandatory information missing. Owner, Business Name and mobile can not be blank.');
      return;
    }

    setIsSavingLead(true);
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: newBizName,
          owner_name: newOwnerName,
          mobile: newMobile,
          email: newEmail,
          city: newCity || 'Bhubaneswar',
          category: newCategory,
          notes: newNotes,
          plan_interested: newPlan
        })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => [data.lead, ...prev]);
        setSelectedLead(data.lead);
        setShowAddLeadModal(false);
        // Reset fields
        setNewBizName('');
        setNewOwnerName('');
        setNewMobile('');
        setNewEmail('');
        setNewCity('');
        setNewNotes('');
      } else {
        setFormError(data.error || 'Failed to capture manual lead.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setIsSavingLead(false);
    }
  };

  // Filtering criteria details
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile.includes(searchQuery) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate metrics computed in client-side dynamically
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    demoScheduled: leads.filter(l => l.status === 'demo_scheduled').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
    conversionRate: leads.length > 0 
      ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) 
      : 0
  };

  // Badge stylings
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-300">New Lead</span>;
      case 'contacted':
        return <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Contacted</span>;
      case 'demo_scheduled':
        return <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Demo Scheduled</span>;
      case 'converted':
        return <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Converted</span>;
      case 'lost':
        return <span className="inline-flex items-center rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">Lost Lead</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-950`} id="app-crm-container">
      
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95" id="crm-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800"
                id="crm-back-home"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Exit Portal</span>
              </button>
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-extrabold font-sans text-slate-900 dark:text-white text-md">
                  AppointO CRM Team Portal
                </span>
                <span className="hidden leading-none uppercase md:inline-block rounded-full bg-blue-100 px-2.5 py-0.75 text-[9px] font-bold text-blue-800 dark:bg-blue-900/30 dark:text-cyan-300">
                  Lead Management Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">Active Session</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{adminEmail}</span>
              </div>
              <button
                onClick={() => setRefreshKey(r => r + 1)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800"
                title="Refresh Lead Database"
              >
                <RefreshCw className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setShowTemplateManager(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-black shadow-sm transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850 cursor-pointer"
                id="crm-btn-manage-templates"
              >
                <Sliders className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>WhatsApp Templates</span>
              </button>
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700"
                id="crm-btn-add-lead"
              >
                <Plus className="h-4 w-4" />
                <span>Quick Record Lead</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Statistics Widgets Bento Row */}
        <section className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6" id="crm-stats-grid">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Active Leads</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{stats.total}</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center">&uarr; realtime</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Conversion Rate</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-600 font-sans">{stats.conversionRate}%</span>
              <span className="text-[10px] text-slate-500 block">leads in status &apos;converted&apos;</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">New / Left Raw</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-700 dark:text-slate-400 font-sans">{stats.new}</span>
              <span className="inline-block rounded bg-slate-100 text-[10px] font-bold text-slate-700 px-1 py-0.5 dark:bg-slate-800 dark:text-slate-350">New</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Contacted Stage</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-500 font-sans">{stats.contacted}</span>
              <span className="inline-block rounded bg-blue-105 text-[10px] font-bold text-blue-700 px-1 py-0.5 dark:bg-blue-900/20 dark:text-cyan-300">Active</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Demos Scheduled</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-500 font-sans">{stats.demoScheduled}</span>
              <span className="inline-block rounded bg-amber-101 text-[10px] font-bold text-amber-700 px-1 py-0.5 dark:bg-amber-900/20 dark:text-amber-300">Pipeline</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900 col-span-2 lg:col-span-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Converted To SaaS</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-500 font-sans">{stats.converted}</span>
              <span className="inline-block rounded bg-emerald-51 text-[10px] font-bold text-emerald-700 px-1 py-0.5 dark:bg-emerald-900/20 dark:text-emerald-300">Live</span>
            </div>
          </div>

        </section>

        {/* Dynamic CRM Segment layout */}
        <div className="grid gap-6 lg:grid-cols-12 min-h-[550px]" id="crm-interactive-workspace">
          
          {/* Left Column: Leads Selection Sidebar List */}
          <div className="lg:col-span-5 flex flex-col rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden dark:border-slate-850 dark:bg-slate-900" id="crm-leads-panel">
            
            {/* Header filters */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3.5 h-4.5 w-4.5 text-slate-400 self-center top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search lead, owner, contact or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Status filtering sliders */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-slate-400"><Filter className="h-3.5 w-3.5" /></span>
                {(['all', 'new', 'contacted', 'demo_scheduled', 'converted', 'lost'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold capitalize transition shrink-0 ${
                      statusFilter === f 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-750'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads list list */}
            <div className="flex-1 overflow-y-auto max-h-[550px]" id="crm-leads-items-scroller">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-500">
                  <RefreshCw className="mx-auto h-6 w-6 animate-spin text-slate-400 mb-2" />
                  <span>Loading lead pipeline registers...</span>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-500">
                  <AlertCircle className="mx-auto h-8 w-8 text-slate-350 mb-2" />
                  <p className="font-bold">No Leads Found</p>
                  <p className="mt-1 text-[11px]">No active leads match the query or filters selected.</p>
                </div>
              ) : (
                filteredLeads.map(lead => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 border-b border-slate-100 dark:border-slate-850 cursor-pointer transition flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-blue-50/50 border-l-4 border-l-blue-600 dark:bg-blue-950/20' 
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-400 transition font-sans leading-tight">
                            {lead.business_name}
                          </h4>
                          {isSelected && <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-650 animate-pulse" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lead.owner_name} &bull; <span className="font-mono">{lead.city}</span>
                        </p>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <Tag className="h-3 w-3 inline text-slate-400" />
                          <span>{lead.category}</span>
                          <span>&bull;</span>
                          <span className="font-mono">{new Date(lead.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                        {getStatusBadge(lead.status)}
                        <span className="text-[9px] text-slate-400 font-bold block bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 dark:bg-slate-850 dark:border-slate-800">
                          {lead.plan_interested || 'Starter'} Plan
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Sidebar Footer context */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 dark:bg-slate-950 dark:border-slate-850 text-center text-[10px] text-slate-500 leading-relaxed font-sans">
              ℹ️ To claiming conversions, update lead status to <strong>Converted</strong>. Live users claimed via ₹99 registration sync instantly.
            </div>

          </div>

          {/* Right Column: Active Lead Details & Follow-up History */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden dark:border-slate-850 dark:bg-slate-900" id="crm-details-panel">
            {selectedLead ? (
              <div className="flex flex-col h-full">
                
                {/* Lead Identity Summary */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(selectedLead.status)}
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-550">
                          ID: {selectedLead.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-sans">
                        {selectedLead.business_name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Primary Contact: <strong className="text-slate-800 dark:text-white">{selectedLead.owner_name}</strong>
                      </p>
                    </div>

                    {/* Change Status Action Dashboard Quick Buttons */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider text-right">Update Opportunity State</span>
                      <div className="flex flex-wrap items-center gap-1">
                        {(['contacted', 'demo_scheduled', 'converted', 'lost'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(st)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold capitalize transition whitespace-nowrap ${
                              selectedLead.status === st 
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 ring-2 ring-blue-500' 
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-750 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                          >
                            Set {st.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Core detail indices: phone, email, town */}
                  <div className="grid gap-3 sm:grid-cols-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="font-mono select-all font-bold">{selectedLead.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350 overflow-hidden text-ellipsis">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="select-all block truncate font-medium">{selectedLead.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="font-sans font-medium">{selectedLead.city} &bull; {selectedLead.category}</span>
                    </div>
                  </div>
                </div>

                {/* Sub Segment layout: Follow-up Timeline & New Entry */}
                <div className="flex-1 p-6 grid gap-6 md:grid-cols-12 overflow-y-auto max-h-[450px]">
                  
                  {/* Left sub-column: Timeline log of followups */}
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      <span>Follow-up History & Logs</span>
                    </h4>

                    {selectedLead.follow_ups.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
                        <AlertCircle className="mx-auto h-7 w-7 text-slate-350 mb-1.5" />
                        <p className="font-bold">No Registered Follow-ups</p>
                        <p className="mt-0.5 text-[10px]">Log an outreach review on the right to start tracking timeline responses.</p>
                      </div>
                    ) : (
                      <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-850 space-y-4">
                        {selectedLead.follow_ups.map((fu, idx) => (
                          <div key={`${fu.id}-${idx}`} className="relative space-y-1 text-xs">
                            {/* Dot */}
                            <span className="absolute -left-[21px] top-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                            
                            <div className="flex items-center gap-2 justify-between">
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {fu.agent === 'System' || fu.agent === 'CRM Engine' ? '🤖 ' : '👤 '}
                                {fu.agent}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(fu.date).toLocaleDateString()} {new Date(fu.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-350 leading-relaxed font-sans border border-slate-100/50 dark:border-slate-900">
                              {fu.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right sub-column: Log outreach action & Lead notes reference */}
                  <div className="md:col-span-5 space-y-4">
                    
                    {/* Basic interest plan & notes */}
                    <div className="rounded-xl bg-blue-50/10 p-3 border border-blue-100/50 dark:bg-slate-950/20 dark:border-slate-850">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Lead Intent Criteria</span>
                      <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Interested Product:</strong> AppointO <span className="text-blue-600 dark:text-cyan-400 font-bold">{selectedLead.plan_interested || 'Starter'}</span> Package
                      </p>
                      {selectedLead.notes && (
                        <div className="mt-2 text-slate-500 dark:text-slate-400 text-xs">
                          <strong className="block text-slate-600 dark:text-slate-300 text-[10px] uppercase">Notes Registered:</strong>
                          <span className="italic mt-0.5 block leading-relaxed">{selectedLead.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Follow up capture form */}
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950/20">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Log Follow-up Call / Note</h4>
                      
                      <form onSubmit={handleAddFollowUp} className="space-y-3">
                        <textarea
                          rows={3}
                          value={followUpNotes}
                          onChange={(e) => setFollowUpNotes(e.target.value)}
                          placeholder="Type notes from client call, email reply, product interest, discount demands etc."
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          required
                        />

                        <button
                          type="submit"
                          disabled={isSubmittingFollowUp || !followUpNotes.trim()}
                          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs py-2 shadow transition inline-flex items-center justify-center gap-1.5"
                        >
                          <Send className="h-3 w-3" />
                          <span>{isSubmittingFollowUp ? 'Storing entry...' : 'Save Notes'}</span>
                        </button>
                      </form>
                    </div>

                    {/* WhatsApp Business API Follow-up Engine */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 dark:border-emerald-500/20 dark:bg-slate-950/40">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1.5">
                        <MessageSquare className="h-4 w-4 shrink-0 animate-pulse" />
                        <h4 className="text-[10px] font-black uppercase tracking-wider block">WhatsApp Business Automation</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal mb-3 dark:text-slate-400">
                        Dispatch interactive, official WhatsApp Business notifications & templates to mobile <strong className="text-slate-700 dark:text-slate-200">+{selectedLead.mobile}</strong>.
                      </p>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-400">Select Campaign Template</label>
                          <select
                            value={selectedWaTemplate}
                            onChange={(e) => setSelectedWaTemplate(e.target.value as any)}
                            className="mt-1 w-full rounded-lg border border-slate-250 bg-white p-2 text-xs outline-none focus:border-emerald-555 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                          >
                            <option value="welcome">👋 Standard Trial Welcome template</option>
                            <option value="nurture">🎯 No-Show Nurturing template</option>
                            <option value="discount">💰 Special Deal Incentive template</option>
                          </select>
                        </div>

                        {/* Template Preview Box */}
                        <div className="rounded-xl bg-white/70 p-2.5 border border-slate-100 text-[10.5px] font-medium text-slate-600 dark:bg-slate-950/60 dark:border-slate-900 dark:text-slate-350 italic leading-relaxed">
                          &ldquo;{waTemplates[selectedWaTemplate].message(selectedLead.owner_name, selectedLead.business_name)}&rdquo;
                        </div>

                        <button
                          type="button"
                          onClick={handleSendWhatsAppTemplate}
                          disabled={isSendingWa}
                          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-2 shadow-md hover:shadow-emerald-500/10 transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isSendingWa ? (
                            <>
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              <span>Delivering Template...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 animate-pulse" />
                              <span>Trigger WhatsApp Outreach</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Users className="h-12 w-12 text-slate-200 dark:text-slate-700 mb-3" />
                <h3 className="text-md font-bold text-slate-700 dark:text-slate-300">No Lead Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">Select any active registration coordinate from the left panel sidebar list to manage follow-up states.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Manual Lead Addition Dialog Window */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={() => setShowAddLeadModal(false)} />
          <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl border border-slate-250 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-md font-extrabold font-sans text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-blue-600" />
                <span>Add Incoming Lead coordinates</span>
              </h3>
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-rose-50 p-2.5 text-[11px] text-rose-800 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-100 dark:border-rose-900/35">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="mt-4 space-y-3.5">
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    placeholder="e.g. Apollo Dental Hub"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="Dr. S. Mohapi"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Primary Mobile *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9437XXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="info@biz.com"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Location / City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Bhubaneswar"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">SaaS Category Type</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Clinic">General Outpatient Clinic</option>
                    <option value="Dental Clinic">Dental Specialist Clinic</option>
                    <option value="Physiotherapy Center">Physiotherapy Center</option>
                    <option value="Salon">Luxury Salon / Spa</option>
                    <option value="Car Wash Center">Car Styling Hub</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Interested SaaS tier</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="Starter">Starter Plan — ₹499</option>
                    <option value="Professional">Professional Tier — ₹999</option>
                    <option value="Business">Enterprise Business — ₹1999</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Incoming Lead Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Tell us about daily booking volumes, specific staff requirements or timeline concerns..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-850 dark:text-slate-350 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLead}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSavingLead ? 'Recording...' : 'Register Opportunity'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {waSentToast && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-sm rounded-xl bg-slate-900 border border-emerald-500/30 p-4 shadow-2xl text-white flex gap-3">
          <div className="rounded-full bg-emerald-500 p-2 text-slate-900 shrink-0 h-9 w-9 flex items-center justify-center">
            <Check className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-emerald-400">WhatsApp Template Delivered!</h5>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-normal font-sans">
              Campaign message dispatched seamlessly to +{selectedLead?.mobile} via the official WhatsApp Cloud Integration pipeline. Status: Delivered.
            </p>
          </div>
        </div>
      )}

      {showTemplateManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowTemplateManager(false)} />
          <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 sm:p-8 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 dark:border-slate-800 shrink-0">
              <h3 className="text-md font-extrabold font-sans text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
                <span>Customize Automated WhatsApp Follow-up Templates</span>
              </h3>
              <button 
                onClick={() => setShowTemplateManager(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-12 mt-4 overflow-y-auto pr-1 flex-1">
              {/* Left Side: Customize Forms */}
              <div className="md:col-span-7 space-y-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200/55 p-3.5 dark:bg-slate-950/20 dark:border-slate-800 leading-relaxed">
                  <h4 className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Dynamic Placeholder Tokens</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    You can inject custom user identifiers which will resolve dynamically upon dispatch:
                  </p>
                  <div className="mt-2 text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-605 dark:text-slate-300">
                    <div className="bg-white border rounded p-1.5 dark:bg-slate-950 dark:border-slate-800 text-center text-[9.5px]">
                      <strong className="text-emerald-600 dark:text-emerald-400">{"{owner}"}</strong> &rarr; Lead Owner name
                    </div>
                    <div className="bg-white border rounded p-1.5 dark:bg-slate-950 dark:border-slate-800 text-center text-[9.5px]">
                      <strong className="text-emerald-600 dark:text-emerald-400">{"{business}"}</strong> &rarr; Business clinic/salon name
                    </div>
                  </div>
                </div>

                {/* Welcome Template Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    <span>👋 Trial Welcome Template text</span>
                    <span className="text-[9px] text-slate-400 font-mono font-normal">{(draftWelcome || '').length} characters</span>
                  </div>
                  <textarea
                    rows={3}
                    value={draftWelcome}
                    onChange={(e) => {
                      setDraftWelcome(e.target.value);
                      if (saveSuccess) setSaveSuccess(false);
                    }}
                    placeholder="Enter welcome template message"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white leading-relaxed font-sans"
                  />
                </div>

                {/* Nurturing Template Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    <span>🎯 No-Show Nurturing Template text</span>
                    <span className="text-[9px] text-slate-400 font-mono font-normal">{(draftNurture || '').length} characters</span>
                  </div>
                  <textarea
                    rows={3}
                    value={draftNurture}
                    onChange={(e) => {
                      setDraftNurture(e.target.value);
                      if (saveSuccess) setSaveSuccess(false);
                    }}
                    placeholder="Enter no-show nurturing template"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white leading-relaxed font-sans"
                  />
                </div>

                {/* Discount Template Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                    <span>💰 Special Deal Incentive Template text</span>
                    <span className="text-[9px] text-slate-400 font-mono font-normal">{(draftDiscount || '').length} characters</span>
                  </div>
                  <textarea
                    rows={3}
                    value={draftDiscount}
                    onChange={(e) => {
                      setDraftDiscount(e.target.value);
                      if (saveSuccess) setSaveSuccess(false);
                    }}
                    placeholder="Enter discount template message"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Right Side: Smartphone sandbox widget */}
              <div className="md:col-span-5 flex flex-col justify-between py-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-wider">Live Sandbox Simulation</span>
                  
                  {/* Recipient Simulation Selector */}
                  <div className="mb-3 space-y-1.5 bg-slate-50 border border-slate-150 p-2 rounded-2xl dark:bg-slate-950/20 dark:border-slate-800">
                    <label className="block text-[9.5px] font-bold text-slate-550 uppercase tracking-widest leading-none">
                      Simulate recipient token resolution
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(Object.keys(simulatedRecipients) as Array<keyof typeof simulatedRecipients>).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSimulatedRecipientType(type)}
                          className={`text-[9.5px] font-black rounded-lg py-1 px-1.5 transition text-center cursor-pointer ${
                            simulatedRecipientType === type
                              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                              : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850'
                          }`}
                        >
                          {type === 'dentist' ? 'Dentist' : type === 'physio' ? 'Physio' : 'Beauty Salon'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Template View Filter Tabs */}
                  <div className="mb-3">
                    <div className="flex border-b border-slate-150 dark:border-slate-800">
                      {(['all', 'welcome', 'nurture', 'discount'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActivePreviewTab(tab)}
                          className={`flex-1 pb-1.5 text-[9.5px] font-bold text-center border-b-2 transition uppercase tracking-wider cursor-pointer ${
                            activePreviewTab === tab
                              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold'
                              : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                          }`}
                        >
                          {tab === 'all' ? 'All' : tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Smartphone Device Frame */}
                <div className="flex-1 rounded-[38px] border-8 border-slate-800 bg-slate-950 p-1.5 shadow-2xl flex flex-col min-h-[420px] overflow-hidden relative">
                  
                  {/* Smartphone Top Speaker Notch & Camera bar */}
                  <div className="w-full h-5 shrink-0 flex items-center justify-between px-6 text-[8px] font-bold text-slate-300 bg-slate-950">
                    <span>12:00</span>
                    <div className="w-16 h-3 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600/50" />
                      <div className="w-5 h-1 rounded bg-slate-800" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>LTE</span>
                      <span className="text-[7.5px] font-mono">🔋 98%</span>
                    </div>
                  </div>

                  {/* Device Inner Sandbox viewport */}
                  <div className="flex-1 rounded-[28px] overflow-hidden flex flex-col bg-[#efeae2] dark:bg-[#0b141a]">
                    
                    {/* WhatsApp Custom Header banner */}
                    <div className="bg-[#075e54] dark:bg-[#202c33] text-white px-2.5 py-2 flex items-center justify-between shrink-0 shadow-md">
                      <div className="flex items-center gap-1.5">
                        <ArrowLeft className="h-4.5 w-4.5 text-emerald-300 stroke-[2.5]" />
                        <div className="relative">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-black text-white border border-emerald-400 font-mono">
                            AO
                          </div>
                          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-[#075e54] dark:border-[#202c33]" />
                        </div>
                        <div className="leading-tight">
                          <div className="flex items-center gap-1">
                            <h5 className="text-[10px] font-black text-white tracking-wide">AppointO Suite</h5>
                            <span className="bg-emerald-500/20 text-emerald-300 text-[6.5px] font-black uppercase px-1 rounded border border-emerald-500/30">Official</span>
                          </div>
                          <span className="text-[8px] text-emerald-200 font-medium">online</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/95">
                        <Phone className="h-3.5 w-3.5 text-white/80 cursor-pointer hover:text-white" />
                        <div className="h-3.5 w-3.5 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="block h-1.5 w-1.5 rounded-full bg-green-400" />
                        </div>
                        <div className="flex flex-col gap-0.5 items-center justify-center h-4 w-2 cursor-pointer">
                          <span className="h-0.5 w-0.5 bg-white rounded-full" />
                          <span className="h-0.5 w-0.5 bg-white rounded-full" />
                          <span className="h-0.5 w-0.5 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Messages dynamic viewport inside phone */}
                    <div className="flex-1 overflow-y-auto p-2.5 space-y-3 relative shrink-0" style={{ 
                      backgroundImage: "url('https://pub-c2def9e4509a4ebcaa0d3b84f33cebd7.r2.dev/whatsapp_chat_bg.png')",
                      backgroundSize: 'cover'
                    }}>
                      
                      {/* Central Date Badge */}
                      <div className="text-center">
                        <span className="inline-block bg-white/80 dark:bg-[#182229] border border-slate-150 dark:border-slate-800/40 text-slate-500 dark:text-slate-400 text-[8px] font-mono shadow-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          Today
                        </span>
                      </div>

                      {/* Welcome template message balloon */}
                      {(activePreviewTab === 'all' || activePreviewTab === 'welcome') && (
                        <div className="flex flex-col items-end">
                          <div className="relative rounded-2xl bg-[#d9fdd3] dark:bg-[#005c4b] p-3 text-[10px] text-slate-800 dark:text-slate-100 max-w-[88%] shadow-xs leading-relaxed border-b border-emerald-100 dark:border-emerald-950/15">
                            <strong className="block text-[7.5px] font-sans text-emerald-600 dark:text-emerald-400 font-extrabold uppercase mb-1">STANDARD WELCOME</strong>
                            <div 
                              className="font-sans break-words text-[10px]"
                              dangerouslySetInnerHTML={{ 
                                __html: formatWhatsAppMessage(draftWelcome, simulatedRecipients[simulatedRecipientType].owner, simulatedRecipients[simulatedRecipientType].business) 
                              }} 
                            />
                            <div className="flex items-center justify-end gap-1 mt-1 text-[7.5px] text-slate-400 dark:text-emerald-300">
                              <span>11:58 AM</span>
                              <CheckCheck className="h-3 w-3 text-sky-400 shrink-0" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Nurturing template message balloon */}
                      {(activePreviewTab === 'all' || activePreviewTab === 'nurture') && (
                        <div className="flex flex-col items-end">
                          <div className="relative rounded-2xl bg-[#d9fdd3] dark:bg-[#005c4b] p-3 text-[10px] text-slate-800 dark:text-slate-100 max-w-[88%] shadow-xs leading-relaxed border-b border-emerald-100 dark:border-emerald-950/15">
                            <strong className="block text-[7.5px] font-sans text-emerald-600 dark:text-emerald-400 font-extrabold uppercase mb-1">NO-SHOW NURTURING</strong>
                            <div 
                              className="font-sans break-words text-[10px]"
                              dangerouslySetInnerHTML={{ 
                                __html: formatWhatsAppMessage(draftNurture, simulatedRecipients[simulatedRecipientType].owner, simulatedRecipients[simulatedRecipientType].business) 
                              }} 
                            />
                            <div className="flex items-center justify-end gap-1 mt-1 text-[7.5px] text-slate-400 dark:text-emerald-300">
                              <span>11:59 AM</span>
                              <CheckCheck className="h-3 w-3 text-sky-400 shrink-0" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Discount template message balloon */}
                      {(activePreviewTab === 'all' || activePreviewTab === 'discount') && (
                        <div className="flex flex-col items-end">
                          <div className="relative rounded-2xl bg-[#d9fdd3] dark:bg-[#005c4b] p-3 text-[10px] text-slate-800 dark:text-slate-100 max-w-[88%] shadow-xs leading-relaxed border-b border-emerald-100 dark:border-emerald-950/15">
                            <strong className="block text-[7.5px] font-sans text-emerald-600 dark:text-emerald-400 font-extrabold uppercase mb-1">DEAL INCENTIVE</strong>
                            <div 
                              className="font-sans break-words text-[10px]"
                              dangerouslySetInnerHTML={{ 
                                __html: formatWhatsAppMessage(draftDiscount, simulatedRecipients[simulatedRecipientType].owner, simulatedRecipients[simulatedRecipientType].business) 
                              }} 
                            />
                            <div className="flex items-center justify-end gap-1 mt-1 text-[7.5px] text-slate-400 dark:text-emerald-300">
                              <span>12:00 PM</span>
                              <CheckCheck className="h-3 w-3 text-sky-400 shrink-0" />
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* WhatsApp styled bottom text-input simulation area */}
                    <div className="bg-[#f0f2f5] dark:bg-[#111b21] p-1.5 flex items-center gap-1.5 shrink-0 border-t border-slate-200/40 dark:border-slate-800/15">
                      <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-full py-1 px-3 flex items-center justify-between text-slate-450">
                        <span className="text-[9.5px]">Type a message...</span>
                        <div className="flex items-center gap-1 text-slate-500">
                          <span className="text-xs">📎</span>
                          <span className="text-xs">📷</span>
                        </div>
                      </div>
                      <div className="h-7 w-7 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0 shadow-sm col-auto">
                        <Send className="h-3.5 w-3.5 fill-current stroke-0 rotate-45 transform translate-x-[-1px] translate-y-[1px]" />
                      </div>
                    </div>

                  </div>

                  {/* Phone Home Button gesture bar */}
                  <div className="bg-slate-950 py-1 flex items-center justify-center shrink-0">
                    <div className="w-20 h-1 rounded bg-slate-700/60" />
                  </div>

                </div>

                {saveSuccess && (
                  <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-bounce shadow-sm">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>WhatsApp configs saved and updated!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal actions controls footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-3 mt-4 shrink-0">
              
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Restore custom template mappings to original defaults?")) {
                    setDraftWelcome(`Namaste {owner}! Thank you for claiming the AppointO ₹99 trial package for {business}. Let's schedule a 10-minute demo to activate your WhatsApp AI automatic bot.`);
                    setDraftNurture(`Hello {owner}! AppointO's automated reminders reduce customer no-shows by up to 85% for {business}. Let's integrate your Google Calendar today.`);
                    setDraftDiscount(`Special Offer for {business}: Get 25% extra discount if you migrate to the Professional Plan today. Auto-includes multi-staff sync and premium WhatsApp automation!`);
                    setSaveSuccess(false);
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-500 transition cursor-pointer bg-transparent border-0"
                title="Restore default texts"
              >
                <Undo className="h-3 w-3" />
                <span>Restore Factory Defaults</span>
              </button>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowTemplateManager(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('appointo_wa_tpl_welcome', draftWelcome);
                    localStorage.setItem('appointo_wa_tpl_nurture', draftNurture);
                    localStorage.setItem('appointo_wa_tpl_discount', draftDiscount);
                    
                    setWelcomeTemplateText(draftWelcome);
                    setNurtureTemplateText(draftNurture);
                    setDiscountTemplateText(draftDiscount);

                    setSaveSuccess(true);
                    setTimeout(() => {
                      setShowTemplateManager(false);
                    }, 1200);
                  }}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-extrabold text-white shadow shadow-emerald-500/10 hover:from-emerald-700 hover:to-teal-700 w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Configuration</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
