import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, Star, CheckCircle2, ChevronRight, Phone, Mail, 
  MapPin, Clock, Globe, Shield, Send, ArrowRight, Activity, 
  Scissors, Car, HeartPulse, Briefcase, Plus, Moon, Sun, Laptop, 
  Smile, UserCheck, Key, RefreshCcw, Landmark 
} from 'lucide-react';

import { INDUSTRIES, INITIAL_APPOINTMENTS } from './data';
import { Appointment } from './types';
import BookingDemoModal from './components/BookingDemoModal';
import DashboardMockup from './components/DashboardMockup';
import ExitIntentModal from './components/ExitIntentModal';
import FaqSection from './components/FaqSection';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import WhatsAppChat from './components/WhatsAppChat';
import SubPages from './components/SubPages';
import RazorpayCheckoutModal from './components/RazorpayCheckoutModal';

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoSelectedIndustry, setDemoSelectedIndustry] = useState('clinics');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'help' | 'privacy' | 'terms'>('home');
  
  // Razorpay Standard Checkout states
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{ name: string; price: number; billingCycle: string } | null>(null);

  // Helper trigger to kick off securely verified standard pricing payment checkout
  const handleOpenPaymentCheckout = (name: string, price: number, billingCycle: string) => {
    setSelectedPlanDetails({ name, price, billingCycle });
    setIsRazorpayOpen(true);
  };
  
  // Lead capture feedback states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  // Contact form submission state
  const [contactName, setContactName] = useState('');
  const [contactBusiness, setContactBusiness] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('clinics');
  const [contactCity, setContactCity] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [contactSuccessTimer, setContactSuccessTimer] = useState(0);

  // Sync dark mode class with HTML document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle appointment list updates
  const handleAddBooking = (newBooking: Appointment) => {
    setAppointments(prev => [newBooking, ...prev]);
  };

  const handleToggleStatus = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus: Appointment['status'] = a.status === 'confirmed' ? 'completed' : 'confirmed';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleDeleteBooking = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const triggerDemoWithIndustry = (indId: string) => {
    setDemoSelectedIndustry(indId);
    setIsDemoOpen(true);
  };

  // Helper for dynamic multi-page routing and smooth hash scrolling
  const handleNavClick = (page: 'home' | 'blog' | 'help' | 'privacy' | 'terms', sectionId?: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  // Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactBusiness) return;

    setIsContactSubmitted(true);
    // Simulate setup steps countdown
    setContactSuccessTimer(1);
    const interval = setInterval(() => {
      setContactSuccessTimer(t => {
        if (t >= 3) {
          clearInterval(interval);
          return 3;
        }
        return t + 1;
      });
    }, 1500);

    // Send real-time notification email using Resend proxy on Backend
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'frederic.soreng@gmail.com',
        subject: `AppointO Demo Request: ${contactBusiness} by ${contactName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e1e8ed; border-radius: 12px;">
            <div style="background-color: #2563EB; color: white; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="margin: 0;">AppointO Demo Setup Registered</h2>
            </div>
            <div style="padding: 20px;">
              <p>Hello AppointO Admin Desk,</p>
              <p>A new live demo setup registration has been submitted. Here are the credentials:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold; width: 140px;">Business Owner:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">${contactName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold;">Business Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">${contactBusiness}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold;">Contact Phone:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">${contactPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold;">Contact Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">${contactEmail || 'None provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold;">Target Industry:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; text-transform: capitalize;">${contactType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold;">Location/City:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">${contactCity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5; font-weight: bold;">Custom Notes:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">${contactMessage || 'No extra notes provided.'}</td>
                </tr>
              </table>
              <div style="margin-top: 30px; border-top: 1px solid #e1e8ed; padding-top: 20px; font-size: 11px; color: #8898aa;">
                🛡️ Transmitted securely by AppointO Resend Email integration engine powered by Innovatronix IT Solutions LLP.
              </div>
            </div>
          </div>
        `
      })
    })
    .then(r => r.json())
    .then(data => console.log('[Email Integration] Support contact notification result:', data))
    .catch(err => console.error('[Email Integration] Failed to submit support email notification:', err));
  };

  // Handle coupon trigger from Exit Intent or Offers
  const handleClaimOffer = (data: { name: string; business: string; phone: string }) => {
    // Populate variables so UI feels connected
    setContactName(data.name);
    setContactBusiness(data.business);
    setContactPhone(data.phone);
    
    // Add a specialized mock row to indicate success
    const claimBooking: Appointment = {
      id: `offer-${Date.now()}`,
      customerName: data.name,
      service: '⭐ Standard setup & trial',
      time: '12:00 PM',
      date: 'Next business day',
      status: 'pending',
      whatsappSent: true,
      phone: data.phone,
      industry: 'clinics',
      staffName: 'Onboarding Executive'
    };
    handleAddBooking(claimBooking);

    // Send instant trial claim notification via integrated Resend API
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'frederic.soreng@gmail.com',
        subject: `🎁 AppointO Coupon Activated: ₹1 Trial claimed by ${data.name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #ffd6a5; border-radius: 12px; background-color: #fffaf0;">
            <div style="background-color: #ff9f1c; color: white; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="margin: 0;">🎁 Exclusive ₹1 Trial Claimed!</h2>
            </div>
            <div style="padding: 20px;">
              <p>Hello AppointO Success desk,</p>
              <p>A customer has successfully claimed the <strong>₹1 AppointO Onboarding Trial offer</strong> via the Exit-Intent Promotion Overlay!</p>
              <div style="background: white; border: 1px solid #ffd6a5; padding: 16px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${data.name}</p>
                <p style="margin: 4px 0;"><strong>Clinic / Business Name:</strong> ${data.business}</p>
                <p style="margin: 4px 0;"><strong>Active WhatsApp Phone:</strong> ${data.phone}</p>
                <p style="margin: 4px 0;"><strong>Assigned Coupon Code:</strong> APPOINTO7752</p>
              </div>
              <p><em>An onboarding specialist must reach out to the customer on WhatsApp coordinate within 2 hours.</em></p>
              <div style="margin-top: 30px; border-top: 1px solid #ffd6a5; padding-top: 20px; font-size: 11px; color: #8898aa;">
                🔒 Compliant with standard service rules. Operated by Innovatronix IT Solutions LLP.
              </div>
            </div>
          </div>
        `
      })
    })
    .then(r => r.json())
    .then(data => console.log('[Email Integration] Claim offer notification dispatched:', data))
    .catch(err => console.error('[Email Integration] Failure to dispatch claim offer notification:', err));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-300 font-sans antialiased`} id="appointo-app-shell">
      
      {/* Sticky Navigation bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors" id="app-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer transition active:scale-95" onClick={() => handleNavClick('home', 'hero')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-500/20">
                <Sparkles className="h-5.5 w-5.5 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
                Appoint<span className="text-[#06B6D4]">O</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider text-slate-600 dark:text-slate-350 uppercase">
              <button onClick={() => handleNavClick('home', 'hero')} className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition cursor-pointer text-left">Home</button>
              <button onClick={() => handleNavClick('home', 'about')} className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition cursor-pointer text-left">About</button>
              <button onClick={() => handleNavClick('home', 'plans')} className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition cursor-pointer text-left">Plans</button>
              <button onClick={() => handleNavClick('home', 'contact')} className="hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition cursor-pointer text-left">Contact</button>
            </nav>

            {/* Actions (Premium Button, Toggle, Trial) */}
            <div className="flex items-center gap-3">
              {/* Dark mode switcher */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Toggle visual style"
                id="theme-toggler"
              >
                {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              <button
                onClick={() => triggerDemoWithIndustry('clinics')}
                className="hidden sm:inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-705 shadow-sm hover:border-[#2563EB] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#06B6D4]"
                id="nav-login-btn"
              >
                Login Desktop
              </button>

              <button
                onClick={() => handleNavClick('home', 'plans')}
                className="inline-flex rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 cursor-pointer"
                id="nav-trial-btn"
              >
                Start Trial @ ₹1
              </button>
            </div>
          </div>
        </div>
      </header>

      {currentPage === 'home' ? (
        <>
          {/* SECTION 1 – HERO / HOME */}
          <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 -left-16 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-blob-1 pointer-events-none"></div>
        <div className="absolute top-1/3 -right-20 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-3xl animate-blob-2 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB] border border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/30">
                <span className="flex h-2 w-2 rounded-full bg-[#2563EB] dark:bg-blue-400 animate-pulse"></span>
                ✨ AI-Powered Appointment Management
              </div>

              <h1 className="text-4xl font-black tracking-tight leading-none text-slate-900 dark:text-white sm:text-5xl lg:text-6.5xl">
                Never Miss A <br/>
                <span className="text-[#2563EB] dark:text-[#06B6D4] bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Booking Again</span>
              </h1>

              <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
                Automate appointments, reminders, follow-ups and customer management with AppointO’s AI-powered scheduling platform. Built for clinics, salons, dental centers, and growing service businesses.
              </p>

              {/* Feature bullet list */}
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {[
                  'WhatsApp Booking', 'AI Reminders & Alerts', 
                  'Staff Allocation', 'Online UPI Payments', 'Multi-Business Support'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA triggers */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <a
                  href="#plans"
                  className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-8 py-4 text-sm font-mono tracking-wider font-extrabold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-700"
                  id="hero-trial-btn"
                >
                  Start 30-Day Trial @ ₹1
                </a>
                <button
                  onClick={() => triggerDemoWithIndustry('clinics')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200/80 bg-white px-8 py-4 text-sm font-bold text-slate-707 shadow-sm transition hover:border-[#2563EB] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#06B6D4]"
                  id="hero-demo-btn"
                >
                  Book Free Demo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col gap-1 border-t border-slate-150 pt-5 dark:border-slate-900">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest leading-none">
                  ★★★★★ Trusted by Clinics, Salons & Service Businesses in India
                </p>
              </div>

            </div>

            {/* Right Interactive Dashboard Mockup Column */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Visual mesh borders background wrapper */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 blur-md dark:opacity-30"></div>
                
                <DashboardMockup
                  appointments={appointments}
                  onToggleStatus={handleToggleStatus}
                  onDeleteBooking={handleDeleteBooking}
                  onTriggerDemoModal={() => triggerDemoWithIndustry('clinics')}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 – ABOUT APPOINTO */}
      <section id="about" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Fully Automated Suite
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Why Businesses Choose AppointO
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-450 leading-relaxed">
              Everything you need to manage appointments, customers and staff from one powerful platform. Say goodbye to manual rosters, missed missed text pings and physical record sheets.
            </p>
          </div>

          {/* Grid Layout of 6 cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: '📅',
                title: 'Smart Appointment Scheduling',
                desc: 'Allow customers to book online 24/7. Your custom dashboard takes requests off-peak and allocates staff calendars smoothly.'
              },
              {
                emoji: '🤖',
                title: 'AI Powered Reminders',
                desc: 'Reduce no-shows through automated check-in triggers. Reminds visitors of set timing structures programmatically.'
              },
              {
                emoji: '💬',
                title: 'WhatsApp Integration',
                desc: 'Send confirmations, receipt PDFs, and scheduling alerts automatically from official Cloud API links.'
              },
              {
                emoji: '👥',
                title: 'Customer Management',
                desc: 'Maintain complete client cards, historic notes, vaccination charts, or skin-treatment histories in secure logs.'
              },
              {
                emoji: '📊',
                title: 'Reports & Analytics',
                desc: 'Track completed bookings, cash-in revenue metrics, and identify your absolute peak-retention weekdays at a single glance.'
              },
              {
                emoji: '🏢',
                title: 'Multi-Industry Solution',
                desc: 'Specifically pre-customized templates built for dental offices, general clinics, hairdressing spa centers, and auto services.'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition duration-250 hover:border-blue-500/30 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-500/30"
              >
                <div className="text-2xl mb-4">{card.emoji}</div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-sans group-hover:text-blue-600 dark:group-hover:text-cyan-400">
                  {card.title}
                </h4>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* BELOW FEATURES: Interactive Industry Cards with illustration */}
          <div className="mt-16 border-t border-slate-100 pt-16 dark:border-slate-800">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
                Configure Custom Workspaces for Your Industry
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                Click your industry block to pre-test the live scheduling assistant customized for your operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => triggerDemoWithIndustry(ind.id)}
                  className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center transition duration-200 hover:scale-105 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                  id={`industry-launch-${ind.id}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-xl font-bold text-blue-600 transition group-hover:from-blue-600 group-hover:to-cyan-400 group-hover:text-white dark:text-cyan-400">
                    {ind.emoji}
                  </div>
                  <h4 className="mt-3.5 text-xs font-extrabold text-slate-800 dark:text-white pointer-events-none">
                    {ind.name}
                  </h4>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition dark:text-[#06B6D4]">
                    Launch Demo &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS INTERACTIVE CAROUSEL */}
      <section className="py-16 bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#22C55E]">
              Success Stories
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Trusted by 12,000+ Business Owners
            </h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* SECTION 3 – PLANS & PRICING */}
      <section id="plans" className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#F8FAFC]/5 to-transparent dark:from-slate-950/5"></div>
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-white/5 blur-2xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-14">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#06B6D4]">
              TRANSPARENT PLANS
            </span>
            <h2 className="text-3.5xl font-black tracking-tight sm:text-5xl">
              Simple Pricing. Powerful Features.
            </h2>
            <p className="text-sm font-medium text-blue-100 max-w-xl mx-auto">
              Start for just ₹1 and scale as your business grows. No hidden cloud setup costs, no contracts, cancel at any time.
            </p>
          </div>

          {/* Pricing cards grid */}
          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
            
            {/* PLAN 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between" id="price-starter">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-200">Starter</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black">₹499</span>
                  <span className="text-xs text-blue-200">/month</span>
                </div>
                <p className="mt-2 text-xs text-blue-100 font-semibold">Great for independent specialists and local micro-salons.</p>
                
                <div className="mt-6 border-t border-white/10 pt-6">
                  <ul className="space-y-3.5 text-xs text-slate-100 font-semibold">
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Online Booking Link</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> WhatsApp Notifications</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> SMS Reminders</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Customer Visit Records</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Single Location Access</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleOpenPaymentCheckout('Starter', 499, 'Billing: Monthly Plan')}
                  className="block w-full rounded-xl bg-white text-center py-3 text-xs font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 cursor-pointer"
                  id="starter-cta"
                >
                  Buy Now @ ₹499
                </button>
              </div>
            </div>

            {/* PLAN 2 (FEATURED) */}
            <div className="relative rounded-2xl bg-white p-7 text-slate-900 shadow-2xl flex flex-col justify-between scale-102 lg:scale-105 border-2 border-cyan-400" id="price-professional">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-md leading-none">
                POPULAR CHOICE
              </span>
              
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-600">Professional</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-xs text-slate-505">/month</span>
                </div>
                <p className="mt-2 text-xs text-slate-500 font-semibold">Ideal for clinics, hair salons, and physical therapy hubs.</p>
                
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ul className="space-y-3.5 text-xs text-slate-705 font-semibold">
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-[#2563EB]/10 text-blue-600 rounded shrink-0" /> <strong className="text-slate-900">Everything in Starter</strong></li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-[#2563EB]/10 text-blue-600 rounded shrink-0" /> AI Scheduling Assistant</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-[#2563EB]/10 text-blue-600 rounded shrink-0" /> Automated Staff Allocation</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-[#2563EB]/10 text-blue-600 rounded shrink-0" /> Full Analytics KPI Dashboard</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-[#2563EB]/10 text-blue-600 rounded shrink-0" /> Advanced CRM Suite</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-[#2563EB]/10 text-blue-600 rounded shrink-0" /> Razorpay Unified Payments</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleOpenPaymentCheckout('Professional', 999, 'Billing: Monthly Plan')}
                  className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-center py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/10 transition hover:from-blue-700 hover:to-cyan-600 cursor-pointer"
                  id="pro-cta"
                >
                  Buy Now @ ₹999
                </button>
              </div>
            </div>

            {/* PLAN 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between" id="price-business">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-200">Business</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black">₹1,999</span>
                  <span className="text-xs text-blue-200">/month</span>
                </div>
                <p className="mt-2 text-xs text-blue-100 font-semibold">Built for established hospitals, multi-chair franchises & networks.</p>
                
                <div className="mt-6 border-t border-white/10 pt-6">
                  <ul className="space-y-3.5 text-xs text-slate-100 font-semibold">
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> <strong className="text-white">Everything in Professional</strong></li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Multi-Branch Syncing</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Advanced Financial Reports</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Custom App White-label</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Priority WhatsApp Support</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-white/10 text-cyan-300 rounded shrink-0" /> Scheduling Cloud API access</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleOpenPaymentCheckout('Business', 1999, 'Billing: Monthly Plan')}
                  className="block w-full rounded-xl border border-white/30 text-center py-3 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                  id="business-cta"
                >
                  Buy Now @ ₹1,999
                </button>
              </div>
            </div>

          </div>

          {/* BELOW PRICING FEATURE BLOCK BANNER */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#06B6D4]/30 to-emerald-500/20 border border-white/10 p-5 sm:p-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="inline-flex rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  🎉 Limited Time Flagship Offer
                </span>
                <h3 className="text-xl font-bold font-sans">Get Your Dedicated Onboarding @ ₹1 Only</h3>
                <p className="text-xs text-blue-105 font-semibold">
                  Includes: Free QR Code designs, Hands-on staff walk-throughs, and free WhatsApp Sandbox configurations.
                </p>
                
                {/* Visual support tags */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[11px] text-[#22C55E] font-bold">
                  <span>✓ Free Setup</span>
                  <span>✓ Free Local Language Training</span>
                  <span>✓ Free Business Subdomain Website</span>
                  <span>✓ Free WhatsApp Automation</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenPaymentCheckout('Onboarding Setup', 1, 'Billing: 30-Day Active Trial Deposit')}
                className="whitespace-nowrap rounded-xl bg-[#22C55E] px-6 py-3.5 text-xs font-extrabold text-[#022C22] shadow-lg transition hover:bg-emerald-400 cursor-pointer"
                id="pricing-claim-banner-btn"
              >
                Claim ₹1 Special Offer Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-[#06B6D4]">
              Clear Doubts
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* SECTION 4 – CONTACT US */}
      <section id="contact" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Left Contact Coordinates Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#06B6D4]">
                  Grow With AppointO
                </span>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Let’s Grow Your Business Together
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Have questions about custom WhatsApp message triggers, billing structures, or multi-location synchronization? Fill out the demo coordinates, and our onboarding division in Tier-2/3 centers will verify within 2 hours.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                
                {/* Card Call */}
                <div className="flex gap-4 rounded-2xl border border-slate-150 bg-white p-4.5 dark:border-slate-900 dark:bg-slate-900/50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white block uppercase tracking-wider">Call Us Help</h4>
                    <p className="text-xs font-semibold text-[#2563EB] dark:text-[#06B6D4] mt-0.5">+91 8104530286</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supported in English, Hindi, and local languages</p>
                  </div>
                </div>

                {/* Card Email */}
                <div className="flex gap-4 rounded-2xl border border-slate-150 bg-white p-4.5 dark:border-slate-900 dark:bg-slate-900/50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-405">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white block uppercase tracking-wider">Email Customer Support</h4>
                    <p className="text-xs font-semibold text-[#2563EB] dark:text-[#06B6D4] mt-0.5">success@appointo.online</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Replies generated instantly within 3 hours</p>
                  </div>
                </div>

                {/* Card Location */}
                <div className="flex gap-4 rounded-2xl border border-slate-150 bg-white p-4.5 dark:border-slate-900 dark:bg-slate-900/50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white block uppercase tracking-wider">Office Address</h4>
                    <p className="text-xs font-semibold text-[#2563EB] dark:text-[#06B6D4] mt-0.5">Innovatronix IT Solutions LLP</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">N3-IRC Village, Nayapali, Bhubaneswar, Odisha-751015</p>
                  </div>
                </div>

              </div>

              {/* Social Icons matching request */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">Follow AppointO Updates</span>
                <div className="flex gap-2 text-slate-405 dark:text-slate-400">
                  {['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'WhatsApp'].map((social) => (
                    <button
                      key={social}
                      onClick={() => alert(`Redirecting to AppointO official ${social} account (Simulation)`)}
                      className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-705 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-[#06B6D4]"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Interactive Contact / Demo Coordinates Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-205 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 relative overflow-hidden" id="demo-form-box">
                {isContactSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="relative mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-pulse">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                    </div>
                    
                    <span className="rounded bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-slate-950 dark:text-emerald-300 uppercase">
                      Demo Order Created
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
                      Thank You, {contactName}!
                    </h3>
                    <p className="mt-2 text-xs text-slate-505 dark:text-slate-400 max-w-md leading-normal">
                      We registered your clinic/salon onboarding parameters for <strong className="text-slate-800 dark:text-white">{contactBusiness}</strong>. Our service specialists are checking slot availability in <strong className="text-slate-800 dark:text-white">{contactCity || 'your city'}</strong>.
                    </p>

                    {/* Simulation Pipeline animation stages */}
                    <div className="mt-6 w-full max-w-sm rounded-xl bg-slate-50 border border-slate-100 p-4 text-left space-y-3 dark:bg-slate-950 dark:border-slate-900">
                      <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">Setup Configuration Stages</span>
                      
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">✓</span>
                        <span className="text-xs text-slate-700 dark:text-slate-200">Registered Mobile {contactPhone}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${contactSuccessTimer >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600 animate-pulse'}`}>
                          {contactSuccessTimer >= 2 ? '✓' : '2'}
                        </span>
                        <span className={`text-xs ${contactSuccessTimer >= 2 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>Assigned Onboarding Expert Agent</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${contactSuccessTimer >= 3 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {contactSuccessTimer >= 3 ? '✓' : '3'}
                        </span>
                        <span className={`text-xs ${contactSuccessTimer >= 3 ? 'text-slate-700 dark:text-slate-200 font-bold' : 'text-slate-400'}`}>WhatsApp sandbox triggers online</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsContactSubmitted(false);
                        setContactName('');
                        setContactBusiness('');
                        setContactPhone('');
                      }}
                      className="mt-8 rounded-xl bg-slate-100 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-white"
                      id="reset-form-btn"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                        Request Free Onboarding Demo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Let us show you how AppointO can scale your customer bookings.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Dr. Anand Deshmukh"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                          Business / Clinic Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactBusiness}
                          onChange={(e) => setContactBusiness(e.target.value)}
                          placeholder="e.g. Dental Care Center"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                          WhatsApp Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="e.g. 98765 43210 (with country code)"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="anand@gmail.com"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                          Business Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={contactType}
                          onChange={(e) => setContactType(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                        >
                          <option value="clinics">🏥 Clinic / Medical</option>
                          <option value="dental">🦷 Dental Practice</option>
                          <option value="salons">💇 Hair Stylist / Salon</option>
                          <option value="carwash">🚗 Car Wash Center</option>
                          <option value="physio">🩺 Physiotherapy Unit</option>
                          <option value="consultants">👨‍💼 Business Consultant</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactCity}
                          onChange={(e) => setContactCity(e.target.value)}
                          placeholder="e.g. Nagpur / Patna"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                        Message / Custom Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Tell us about daily booking volume, staff count, language choices etc."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-blue-500/10 transition hover:from-blue-700 hover:to-cyan-650"
                      id="contact-form-submit"
                    >
                      Request Free Demo Setup
                    </button>

                    <p className="text-center text-[10px] text-slate-400">
                      Our onboarding division will contact you within 24 hours.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
        </>
      ) : (
        <SubPages initialPage={currentPage} onNavigate={(p) => handleNavClick(p)} darkMode={darkMode} />
      )}

      {/* SECTION 5 – FOOTER */}
      <footer className="bg-slate-900 text-slate-300 dark:bg-slate-980 border-t border-slate-800 font-sans" id="app-footer">
        
        {/* Top footer subscription */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 border-b border-slate-800 pb-12">
            
            {/* Logo/Coordinates block */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                  <Sparkles className="h-4.5 w-4.5 fill-white" />
                </div>
                <span className="text-base font-black tracking-tight text-white">
                  Appoint<span className="text-[#06B6D4]">O</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                AppointO is an automated AI-powered scheduling assistant built to reduce clinics and salons customer no-shows by 85% with official WhatsApp API channels.
              </p>
              <p className="text-xs font-bold text-slate-350 tracking-wide uppercase">
                🚀 AI Powered Appointment Scheduling for Growing Businesses.
              </p>
            </div>

            {/* Links Column 1: Company */}
            <div className="grid grid-cols-3 gap-4 lg:col-span-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Company</h4>
                <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
                  <li><button onClick={() => handleNavClick('home', 'hero')} className="hover:text-blue-400 text-left cursor-pointer">About</button></li>
                  <li><button onClick={() => handleNavClick('home', 'about')} className="hover:text-blue-400 text-left cursor-pointer">Features</button></li>
                  <li><button onClick={() => handleNavClick('home', 'plans')} className="hover:text-blue-400 text-left cursor-pointer">Pricing</button></li>
                  <li><button onClick={() => handleNavClick('home', 'contact')} className="hover:text-blue-400 text-left cursor-pointer">Contact</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Solutions</h4>
                <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
                  <li><button onClick={() => { handleNavClick('home', 'hero'); triggerDemoWithIndustry('clinics'); }} className="hover:text-cyan-400 text-left cursor-pointer">Clinics</button></li>
                  <li><button onClick={() => { handleNavClick('home', 'hero'); triggerDemoWithIndustry('dental'); }} className="hover:text-cyan-400 text-left cursor-pointer">Dental Clinics</button></li>
                  <li><button onClick={() => { handleNavClick('home', 'hero'); triggerDemoWithIndustry('salons'); }} className="hover:text-cyan-400 text-left cursor-pointer">Salons</button></li>
                  <li><button onClick={() => { handleNavClick('home', 'hero'); triggerDemoWithIndustry('carwash'); }} className="hover:text-cyan-400 text-left cursor-pointer">Car Wash</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white">Resources</h4>
                <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
                  <li><button onClick={() => handleNavClick('blog')} className="hover:text-blue-400 text-left cursor-pointer">Blog</button></li>
                  <li><button onClick={() => handleNavClick('help')} className="hover:text-blue-400 text-left cursor-pointer">Help Center</button></li>
                  <li><button onClick={() => handleNavClick('privacy')} className="hover:text-blue-400 text-left cursor-pointer">Privacy Policy</button></li>
                  <li><button onClick={() => handleNavClick('terms')} className="hover:text-blue-400 text-left cursor-pointer">Terms</button></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription column */}
            <div className="lg:col-span-3 space-y-3" id="newsletter-form-box">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Grow Your Salon/Clinic</h4>
              <p className="text-xs text-slate-400">Receive weekly AI scheduler marketing hacks and off-peak optimizations.</p>
              
              {newsletterSuccess ? (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-[11px] text-emerald-400 font-bold">
                  ✓ Successfully subscribed email parameters.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setNewsletterSuccess(true);
                  }}
                  className="flex gap-1.5"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter Business Email"
                    className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-blue-600"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p>© 2026 AppointO. All Rights Reserved. Designed for clinic, salon, and consultancy scheduling.</p>
            <div className="flex gap-2">
              <span className="flex items-center gap-1">🌐 India Edition</span>
              <span>•</span>
              <span className="flex items-center gap-1">🛡️ SSL Encrypted</span>
            </div>
          </div>

        </div>
      </footer>

      {/* FLOAT HOVER INTERACTIVE ELEMENTS */}
      
      {/* Floating interactive WhatsApp Chat Widget Widget */}
      <WhatsAppChat onTriggerDemo={() => triggerDemoWithIndustry('clinics')} />

      {/* Exit Intent Modal Popup */}
      <ExitIntentModal onClaimOffer={handleClaimOffer} />

      {/* Live scheduling simulator demo popup */}
      <BookingDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onBookingSuccess={handleAddBooking}
        defaultIndustryId={demoSelectedIndustry}
      />

      {/* Razorpay Standard Web Checkout gateway modal overlay */}
      <RazorpayCheckoutModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        selectedPlan={selectedPlanDetails}
        darkMode={darkMode}
      />

    </div>
  );
}
