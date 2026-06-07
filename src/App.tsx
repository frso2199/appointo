import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Check, Star, CheckCircle2, ChevronRight, Phone, Mail, 
  MapPin, Clock, Globe, Shield, Send, ArrowRight, Activity, 
  Scissors, Car, HeartPulse, Briefcase, Plus, Moon, Sun, Laptop, 
  Smile, UserCheck, Key, RefreshCcw, Landmark, Home, CreditCard, HelpCircle,
  Calendar, Bot, MessageSquare, Users, BarChart3, Building2, X, Megaphone
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
import EricChatbot from './components/EricChatbot';
import AdminLoginModal from './components/AdminLoginModal';
import CrmDashboard from './components/CrmDashboard';
import confetti from 'canvas-confetti';

const parseResponse = async (r: Response) => {
  const contentType = r.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return r.json();
  }
  const text = await r.text();
  console.warn('[Network] Received non-JSON response from server:', text);
  return { success: false, error: text || 'Non-JSON server response' };
};

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoSelectedIndustry, setDemoSelectedIndustry] = useState('clinics');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'help' | 'privacy' | 'terms' | 'refunds' | 'shipping' | 'crm'>('home');
  
  // Admin Login and CRM State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  
  // Razorpay Subscriptions state hooks
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{ name: string; price: number; billingCycle: string } | null>(null);
  const [razorpayPrefill, setRazorpayPrefill] = useState<{ name: string; business: string; phone: string } | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription-status');
      const data = await res.json();
      if (res.ok && data.success) {
        setUserSubscription(data.subscription);
      }
    } catch (err) {
      console.error('[App Server Sync] Error synchronizing client/server subscription indexes:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

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

  // Geolocation storage for automated country flag displays
  const [detectedCountry, setDetectedCountry] = useState<{ code: string; flag: string } | null>(null);

  // IP-based geolocation check upon the initial load of #demo-form-box
  useEffect(() => {
    const detectInferredRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const info = await response.json();
          if (info) {
            // Map 2-letter country code to flag emojis
            const flagMap: Record<string, string> = {
              US: '🇺🇸', CA: '🇨🇦', GB: '🇬🇧', IN: '🇮🇳', AE: '🇦🇪', SG: '🇸🇬', AU: '🇦🇺',
              FR: '🇫🇷', DE: '🇩🇪', JP: '🇯🇵', BR: '🇧🇷', ZA: '🇿🇦', RU: '🇷🇺', ES: '🇪🇸',
              IT: '🇮🇹', CH: '🇨🇭', NL: '🇳🇱', SE: '🇸🇪', NO: '🇳🇴', FI: '🇫🇮', DK: '🇩🇰',
              BE: '🇧🇪', IE: '🇮🇪', NZ: '🇳🇿', MX: '🇲🇽', SA: '🇸🇦', CO: '🇨🇴', ID: '🇮🇩',
              MY: '🇲🇾', TH: '🇹🇭', VN: '🇻🇳', PH: '🇵🇭', TR: '🇹🇷', KR: '🇰🇷', UA: '🇺🇦'
            };

            const code = info.country_code || 'IN';
            const flag = flagMap[code] || '🌐';

            setDetectedCountry({ code, flag });

            // Auto-populate the input field's country prefix if empty
            if (info.country_calling_code) {
              setContactPhone(prev => {
                if (!prev || prev.trim() === '') {
                  return `${info.country_calling_code} `;
                }
                return prev;
              });
            }

            // Auto-populate the city as well to delight the user
            if (info.city) {
              setContactCity(prev => {
                if (!prev || prev.trim() === '') {
                  return info.city;
                }
                return prev;
              });
            }
          }
        }
      } catch (err) {
        console.warn('Geolocation IP-based region lookup could not resolve or was blocked/rate-limited:', err);
      }
    };
    detectInferredRegion();
  }, []);

  // Real-time validation states
  const [contactErrors, setContactErrors] = useState<{
    name?: string;
    business?: string;
    phone?: string;
    email?: string;
    city?: string;
  }>({});

  const [touchedFields, setTouchedFields] = useState<{
    name?: boolean;
    business?: boolean;
    phone?: boolean;
    email?: boolean;
    city?: boolean;
  }>({});

  // Dynamic status of form completion for required fields
  const getFormProgress = () => {
    let completed = 0;
    const requirements = [
      contactName.trim().length >= 2 && /^[A-Za-z\s.\-']+$/.test(contactName.trim()),
      contactBusiness.trim().length >= 2,
      (/^\+?[0-9]{10,15}$/.test(contactPhone.replace(/[\s\-()]/g, ''))),
      contactCity.trim().length >= 2
    ];
    requirements.forEach(req => {
      if (req) completed++;
    });
    return Math.round((completed / requirements.length) * 100);
  };

  // High-performance Confetti activation state for 100% form completion
  const [hasPlayedConfetti, setHasPlayedConfetti] = useState(false);
  const currentProgress = getFormProgress();

  useEffect(() => {
    if (currentProgress === 100) {
      if (!hasPlayedConfetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.75 }
        });
        setHasPlayedConfetti(true);
      }
    } else {
      setHasPlayedConfetti(false);
    }
  }, [currentProgress, hasPlayedConfetti]);

  // Real-time validation engine
  useEffect(() => {
    const errors: typeof contactErrors = {};

    // Name Validation
    if (touchedFields.name) {
      if (!contactName.trim()) {
        errors.name = 'Full Name is required.';
      } else if (contactName.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters.';
      } else if (!/^[A-Za-z\s.\-']+$/.test(contactName.trim())) {
        errors.name = 'Name can only contain letters, spaces, dots, or hyphens.';
      }
    }

    // Business Name Validation
    if (touchedFields.business) {
      if (!contactBusiness.trim()) {
        errors.business = 'Business / Clinic Name is required.';
      } else if (contactBusiness.trim().length < 2) {
        errors.business = 'Business Name must be at least 2 characters.';
      }
    }

    // Phone Validation
    if (touchedFields.phone) {
      if (!contactPhone.trim()) {
        errors.phone = 'WhatsApp number is required.';
      } else {
        const cleaned = contactPhone.replace(/[\s\-()]/g, '');
        // Require 10 to 15 digits including optional plus prefix
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(cleaned)) {
          errors.phone = 'Please enter a valid 10-15 digit WhatsApp number with optional country code (e.g., 919876543210).';
        }
      }
    }

    // Email Validation (optional but validated if filled)
    if (touchedFields.email && contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    // City Validation
    if (touchedFields.city) {
      if (!contactCity.trim()) {
        errors.city = 'City is required.';
      } else if (contactCity.trim().length < 2) {
        errors.city = 'City must be at least 2 characters.';
      }
    }

    setContactErrors(errors);
  }, [contactName, contactBusiness, contactPhone, contactEmail, contactCity, touchedFields]);

  // Real-time touched handlers
  const handleNameChange = (val: string) => {
    setContactName(val);
    setTouchedFields(prev => ({ ...prev, name: true }));
  };

  const handleBusinessChange = (val: string) => {
    setContactBusiness(val);
    setTouchedFields(prev => ({ ...prev, business: true }));
  };

  const handlePhoneChange = (val: string) => {
    // Save cursor/backspace context by looking at digit patterns
    const digitsOnly = val.replace(/\D/g, '');
    let formatted = val;

    if (val.startsWith('+')) {
      // Keep explicit +
      if (digitsOnly.startsWith('91')) {
        const rest = digitsOnly.substring(2);
        if (rest.length === 0) {
          formatted = '+91 ';
        } else if (rest.length <= 5) {
          formatted = `+91 ${rest}`;
        } else {
          formatted = `+91 ${rest.substring(0, 5)} ${rest.substring(5, 10)}`;
        }
      } else {
        // general format for other custom country codes (+XXX XXX XXX)
        if (digitsOnly.length <= 3) {
          formatted = `+${digitsOnly}`;
        } else if (digitsOnly.length <= 7) {
          formatted = `+${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3)}`;
        } else {
          formatted = `+${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 7)} ${digitsOnly.substring(7, 12)}`;
        }
      }
    } else {
      // No explicit + sign entered
      if (digitsOnly.length === 0) {
        formatted = '';
      } else if (digitsOnly.length === 10) {
        // When exactly 10 digits are inputted, auto-format with country prefix +91
        formatted = `+91 ${digitsOnly.substring(0, 5)} ${digitsOnly.substring(5, 10)}`;
      } else if (digitsOnly.length > 10) {
        if (digitsOnly.startsWith('91')) {
          const rest = digitsOnly.substring(2);
          formatted = `+91 ${rest.substring(0, 5)} ${rest.substring(5, 10)}`;
        } else {
          formatted = `+${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 8)} ${digitsOnly.substring(8, 13)}`;
        }
      } else {
        // Simple spaces as typing progresses
        if (digitsOnly.length <= 5) {
          formatted = digitsOnly;
        } else {
          formatted = `${digitsOnly.substring(0, 5)} ${digitsOnly.substring(5)}`;
        }
      }
    }

    setContactPhone(formatted);
    setTouchedFields(prev => ({ ...prev, phone: true }));
  };

  const handleEmailChange = (val: string) => {
    setContactEmail(val);
    setTouchedFields(prev => ({ ...prev, email: true }));
  };

  const handleCityChange = (val: string) => {
    setContactCity(val);
    setTouchedFields(prev => ({ ...prev, city: true }));
  };


  // Sync dark mode class with HTML document element and set the tab title
  useEffect(() => {
    document.title = 'AppointO';
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
  const handleNavClick = (page: 'home' | 'blog' | 'help' | 'privacy' | 'terms' | 'refunds' | 'shipping' | 'crm', sectionId?: string) => {
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
    
    // Mark all fields as touched to trigger any real-time feedback visible to the user
    setTouchedFields({
      name: true,
      business: true,
      phone: true,
      email: true,
      city: true
    });

    const isNameValid = contactName.trim().length >= 2 && /^[A-Za-z\s.\-']+$/.test(contactName.trim());
    const isBusinessValid = contactBusiness.trim().length >= 2;
    const isPhoneValid = /^\+?[0-9]{10,15}$/.test(contactPhone.replace(/[\s\-()]/g, ''));
    const isEmailValid = !contactEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());
    const isCityValid = contactCity.trim().length >= 2;

    if (!isNameValid || !isBusinessValid || !isPhoneValid || !isEmailValid || !isCityValid) {
      // Prevent submission if the user has invalid values
      return;
    }

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
        to: 'success@appointo.online',
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
                🛡️ Transmitted securely by AppointO Resend Email integration engine powered by Innovationix IT Solutions LLP.
              </div>
            </div>
          </div>
        `
      })
    })
    .then(parseResponse)
    .then(data => console.log('[Email Integration] Support contact notification result:', data))
    .catch(err => console.error('[Email Integration] Failed to submit support email notification:', err));

    // Sync contact form submission to CRM Leads DB
    fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_name: contactBusiness,
        owner_name: contactName,
        mobile: contactPhone,
        email: contactEmail || '',
        city: contactCity || 'Bhubaneswar',
        category: contactType || 'Clinic',
        notes: contactMessage || 'Demo Setup Contact Request Form',
        plan_interested: 'Starter'
      })
    })
    .then(parseResponse)
    .then(leadsData => console.log('[CRM Integration] Contact request lead synchronization result:', leadsData))
    .catch(leadsErr => console.error('[CRM Integration] Failed to sync contact request as CRM Lead:', leadsErr));
  };

  // Handle coupon trigger from Exit Intent or Offers
  const handleClaimOffer = (data: { name: string; business: string; phone: string }) => {
    // Populate variables so UI feels connected
    setContactName(data.name);
    setContactBusiness(data.business);
    setContactPhone(data.phone);
    
    // Smooth Integration: Link claim modal directly with Razorpay Checkout modal
    setRazorpayPrefill(data);
    setSelectedPlanDetails({
      name: 'Starter',
      price: 499,
      billingCycle: 'monthly'
    });
    setIsRazorpayOpen(true);

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
        to: 'success@appointo.online',
        subject: 'New Lead',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #ffd6a5; border-radius: 12px; background-color: #fffaf0;">
            <div style="background-color: #ff9f1c; color: white; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="margin: 0;">🎁 Exclusive ₹99 Trial Claimed!</h2>
            </div>
            <div style="padding: 20px;">
              <p>Hello AppointO Success desk,</p>
              <p>A customer has successfully claimed the <strong>₹99 AppointO Onboarding Trial offer</strong> via the Exit-Intent Promotion Overlay!</p>
              <div style="background: white; border: 1px solid #ffd6a5; padding: 16px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${data.name}</p>
                <p style="margin: 4px 0;"><strong>Clinic / Business Name:</strong> ${data.business}</p>
                <p style="margin: 4px 0;"><strong>Active WhatsApp Phone:</strong> ${data.phone}</p>
                <p style="margin: 4px 0;"><strong>Assigned Coupon Code:</strong> APPOINTO7752</p>
              </div>
              <p><em>An onboarding specialist must reach out to the customer on WhatsApp coordinate within 2 hours.</em></p>
              <div style="margin-top: 30px; border-top: 1px solid #ffd6a5; padding-top: 20px; font-size: 11px; color: #8898aa;">
                🔒 Compliant with standard service rules. Operated by Innovationix IT Solutions LLP.
              </div>
            </div>
          </div>
        `
      })
    })
    .then(parseResponse)
    .then(data => console.log('[Email Integration] Claim offer notification dispatched:', data))
    .catch(err => console.error('[Email Integration] Failure to dispatch claim offer notification:', err));
  };

  if (currentPage === 'crm' && adminUser) {
    return (
      <CrmDashboard
        adminEmail={adminUser.email}
        onLogout={() => {
          setAdminUser(null);
          setCurrentPage('home');
        }}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full overflow-x-hidden pb-16 md:pb-0 relative ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-300 font-sans antialiased`} id="appointo-app-shell">
      
      {/* Sticky Navigation bar */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800" id="app-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer transition active:scale-95" onClick={() => handleNavClick('home', 'hero')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md">
                <Sparkles className="h-5.5 w-5.5 fill-white text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-sans text-white">
                Appoint<span className="text-white">O</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider text-slate-205 uppercase">
              <button onClick={() => handleNavClick('home', 'hero')} className="hover:text-blue-400 text-slate-300 transition cursor-pointer text-left">Home</button>
              <button onClick={() => handleNavClick('home', 'about')} className="hover:text-blue-400 text-slate-300 transition cursor-pointer text-left">About</button>
              <button onClick={() => handleNavClick('home', 'plans')} className="hover:text-blue-400 text-slate-300 transition cursor-pointer text-left">Plans</button>
              <button onClick={() => handleNavClick('home', 'contact')} className="hover:text-blue-400 text-slate-300 transition cursor-pointer text-left">Contact</button>
            </nav>

            {/* Actions (Premium Button, Toggle, Trial) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Dark mode switcher */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-1.5 sm:p-2 text-white hover:bg-slate-900"
                title="Toggle visual style"
                id="theme-toggler"
              >
                {darkMode ? <Sun className="h-4.5 w-4.5 text-white" /> : <Moon className="h-4.5 w-4.5 text-white" />}
              </button>

              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="hidden sm:inline-flex rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition hover:bg-blue-700 hover:border-blue-700"
                id="nav-login-btn"
              >
                Admin Login
              </button>

              <button
                onClick={() => handleNavClick('home', 'plans')}
                className="inline-flex rounded-xl bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-slate-950 transition hover:bg-slate-200 cursor-pointer whitespace-nowrap"
                id="nav-trial-btn"
              >
                Start Trial @ ₹99
              </button>
            </div>
          </div>
        </div>
      </header>

      {userSubscription && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white text-center py-2.5 px-4 text-xs font-bold tracking-wider flex flex-col sm:flex-row items-center justify-center gap-2 animate-fadeIn shadow-sm border-b border-indigo-800" id="subscription-alert-ribbon">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            {userSubscription.status === 'TRIAL' ? (
              <span>🛡️ <strong>Trial Active</strong>: You have <strong>{Math.max(0, Math.ceil((new Date(userSubscription.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining</strong> inside your free evaluation period! Accessing AppointO {userSubscription.plan_name} license. Mode: <strong>SANDBOX</strong></span>
            ) : userSubscription.status === 'ACTIVE' ? (
              <span>✓ <strong>Full License Active</strong>: AppointO {userSubscription.plan_name} active monthly plan has been verified. Mode: <strong>LIVE</strong></span>
            ) : (
              <span>⚠️ <strong>Subscription Status</strong>: {userSubscription.status}. Update billing coordinates inside your workspace.</span>
            )}
          </span>
          <button
            onClick={() => {
              const doc = document.getElementById('tab-billing-dashboard');
              if (doc) doc.click();
              const sc = document.getElementById('hero-dashboard');
              if (sc) sc.scrollIntoView({ behavior: 'smooth' });
            }}
            className="sm:ml-3 underline hover:text-cyan-200 text-[10px] font-black uppercase tracking-wider cursor-pointer bg-white/10 px-2 py-0.5 rounded transition hover:bg-white/20"
            id="manage-billing-scroll-btn"
          >
            Manage Subscription &rarr;
          </button>
        </div>
      )}

      {currentPage === 'home' ? (
        <>
          {/* SECTION 1 – HERO / HOME */}
          <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-slate-950 text-white border-b border-slate-800">
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 -left-16 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-blob-1 pointer-events-none"></div>
        <div className="absolute top-1/3 -right-20 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-3xl animate-blob-2 pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 w-full max-w-full overflow-hidden">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-800/50" id="hero-badge-pill">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                ✨ AI-Powered Appointment Management
              </div>

              <h1 className="text-4xl font-black tracking-tight leading-tight text-white sm:text-5xl lg:text-6.5xl">
                Never miss a <br/>
                <span className="text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">booking again.</span>
              </h1>

              <p className="max-w-xl text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
                Automate appointments, reminders, follow-ups and customer management with AppointO’s AI-powered scheduling platform. Built for clinics, salons, dental centers, and growing service businesses.
              </p>

              {/* Interactive Virtual Chatbot 'Eric' */}
              <div className="py-2 w-full max-w-full overflow-hidden">
                <div className="w-full max-w-full overflow-hidden">
                  <EricChatbot />
                </div>
              </div>

              {/* Feature bullet list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg">
                {[
                  'WhatsApp Booking', 'AI Reminders & Alerts', 
                  'Staff Allocation', 'Online UPI Payments', 'Multi-Business Support'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-400">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA triggers */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full max-w-full sm:max-w-none">
                <a
                  href="#plans"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-sm font-mono tracking-tight sm:tracking-wider font-extrabold text-slate-950 shadow-xl transition hover:bg-slate-200 text-center w-full sm:w-auto"
                  id="hero-trial-btn"
                >
                  Start 30-Day Trial @ ₹99
                </a>
                <button
                  onClick={() => handleNavClick('home', 'contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-blue-600 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 hover:border-blue-700 text-center w-full sm:w-auto"
                  id="hero-demo-btn"
                >
                  Book Free Demo
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col gap-1 border-t border-slate-800 pt-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                     <Star key={`hero-star-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wide sm:tracking-widest leading-snug sm:leading-none">
                  ★★★★★ Trusted by Clinics, Salons & Services
                </p>
              </div>

            </div>

            {/* Right Interactive Dashboard Mockup Column */}
            <div className="lg:col-span-6 w-full max-w-full overflow-hidden">
              <div className="relative w-full">
                {/* Visual mesh borders background wrapper */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 blur-md dark:opacity-30"></div>
                
                <div className="w-full max-w-full overflow-hidden rounded-2xl">
                  <DashboardMockup
                    appointments={appointments}
                    onToggleStatus={handleToggleStatus}
                    onDeleteBooking={handleDeleteBooking}
                    onTriggerDemoModal={() => triggerDemoWithIndustry('clinics')}
                    activeSubscription={userSubscription}
                    onRefreshSubscription={fetchSubscriptionStatus}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 – ABOUT APPOINTO */}
      <section id="about" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-950 dark:text-slate-200">
              Fully Automated Suite
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Why Businesses Choose AppointO
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Everything you need to manage appointments, customers and staff from one powerful platform. Say goodbye to manual rosters, missed missed text pings and physical record sheets.
            </p>
          </div>

          {/* Grid Layout of 6 cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Smart Appointment Scheduling',
                desc: 'Allow customers to book online 24/7. Your custom dashboard takes requests off-peak and allocates staff calendars smoothly.'
              },
              {
                icon: Bot,
                title: 'AI Powered Reminders',
                desc: 'Reduce no-shows through automated check-in triggers. Reminds visitors of set timing structures programmatically.'
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp Integration',
                desc: 'Send confirmations, receipt PDFs, and scheduling alerts automatically from official Cloud API links.'
              },
              {
                icon: Phone,
                title: 'Voice Calls for Follow-up',
                desc: 'Connect with your clients through interactive voice calls for automated feedback and confirmations. A better way of communication.'
              },
              {
                icon: Globe,
                title: 'Website (Bundled)',
                desc: 'Enjoy an immediate online presence with your own customized brand page, integrated booking flows, and detailed service offerings.'
              },
              {
                icon: Megaphone,
                title: 'Digital Marketing',
                desc: 'Deploy smart target campaigns and lead generation templates built directly into AppointO to gain high-quality leads for your business.'
              },
              {
                icon: Users,
                title: 'Customer Management',
                desc: 'Maintain complete client cards, historic notes, vaccination charts, or skin-treatment histories in secure logs.'
              },
              {
                icon: BarChart3,
                title: 'Reports & Analytics',
                desc: 'Track completed bookings, cash-in revenue metrics, and identify your absolute peak-retention weekdays at a single glance.'
              },
              {
                icon: Building2,
                title: 'Multi-Industry Solution',
                desc: 'Specifically pre-customized templates built for dental offices, general clinics, hairdressing spa centers, and auto services.'
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900 to-black p-6 transition duration-300 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="mb-4 inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <card.icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-white font-sans">
                  {card.title}
                </h4>
                <p className="mt-2 text-xs font-medium leading-relaxed text-blue-100/90">
                  {card.desc}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl"></div>
              </motion.div>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-400/5 text-xl font-bold text-slate-950 transition group-hover:from-slate-950 group-hover:to-slate-900 group-hover:text-white dark:text-white dark:group-hover:text-slate-200">
                    {ind.emoji}
                  </div>
                  <h4 className="mt-3.5 text-xs font-extrabold text-slate-800 dark:text-white pointer-events-none">
                    {ind.name}
                  </h4>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300 opacity-0 group-hover:opacity-100 transition" id={`industry-launch-demo-${ind.id}`}>
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
              Start for just ₹99 and scale as your business grows. No hidden cloud setup costs, no contracts, cancel at any time.
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
                  className="block w-full rounded-xl bg-white text-center py-3 text-xs font-bold text-slate-950 shadow-lg transition hover:bg-blue-50 cursor-pointer"
                  id="starter-cta"
                >
                  Buy Now @ ₹499
                </button>
              </div>
            </div>

            {/* PLAN 2 (FEATURED) */}
            <div className="relative rounded-2xl bg-white p-7 text-slate-900 shadow-2xl flex flex-col justify-between scale-100 lg:scale-105 hover:scale-102 lg:hover:scale-107 transform transition duration-300 border border-slate-100 dark:border-slate-800" id="price-professional">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-md leading-none">
                POPULAR CHOICE
              </span>
              
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-950">Professional</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <p className="mt-2 text-xs text-slate-500 font-semibold">Ideal for clinics, hair salons, and physical therapy hubs.</p>
                
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ul className="space-y-3.5 text-xs text-slate-700 font-semibold">
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-slate-900/10 text-slate-950 rounded shrink-0" /> <strong className="text-slate-900">Everything in Starter</strong></li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-slate-900/10 text-slate-950 rounded shrink-0" /> AI Scheduling Assistant</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-slate-900/10 text-slate-950 rounded shrink-0" /> Automated Staff Allocation</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-slate-900/10 text-slate-950 rounded shrink-0" /> Full Analytics KPI Dashboard</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-slate-900/10 text-slate-950 rounded shrink-0" /> Advanced CRM Suite</li>
                    <li className="flex gap-2"><Check className="h-4 p-0.5 bg-slate-900/10 text-slate-950 rounded shrink-0" /> Razorpay Unified Payments</li>
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
                <h3 className="text-xl font-bold font-sans">Get Your Dedicated Onboarding @ ₹99 Only</h3>
                <p className="text-xs text-blue-105 font-semibold">
                  Includes: Free QR Code designs, Hands-on staff walk-throughs, and free WhatsApp Sandbox configurations.
                </p>
                
                {/* Visual support tags */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[11px] text-[#22C55E] font-bold">
                  <span>✓ Premium Setup</span>
                  <span>✓ Free Local Language Training</span>
                  <span>✓ Free Business Subdomain Website</span>
                  <span>✓ Free WhatsApp Automation</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenPaymentCheckout('Onboarding Setup', 99, 'Billing: 30-Day Active Trial Deposit')}
                className="rounded-xl bg-[#22C55E] px-5 sm:px-6 py-3.5 text-xs font-extrabold text-[#022C22] shadow-lg transition hover:bg-emerald-400 cursor-pointer w-full sm:w-auto text-center sm:whitespace-nowrap whitespace-normal"
                id="pricing-claim-banner-btn"
              >
                Claim ₹99 Special Offer Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
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
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  Grow With AppointO
                </span>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Let’s Grow Your Business Together
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Have questions about custom WhatsApp message triggers, billing structures, or multi-location synchronization? Fill out the demo coordinates, and our onboarding division in Tier-2/3 centers will verify within 2 hours.
                </p>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                
                {/* Card Call */}
                <div className="flex gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900/50 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-905 dark:text-white">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-350 block uppercase tracking-wider">Call Us Help</h4>
                    <p className="text-xs font-sans font-extrabold text-slate-900 dark:text-white mt-0.5 break-all select-all">+91 8104530286</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Supported in English, Hindi, and local languages</p>
                  </div>
                </div>

                {/* Card Email */}
                <div className="flex gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900/50 shadow-sm border border-slate-100 dark:border-slate-800 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-905 dark:text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-350 block uppercase tracking-wider">Email Support</h4>
                    <p className="text-xs font-sans font-extrabold text-slate-900 dark:text-white mt-0.5 break-all select-all">success@appointo.online</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Replies generated instantly within 3 hours</p>
                  </div>
                </div>

                {/* Card Location */}
                <div className="flex gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900/50 shadow-sm border border-slate-100 dark:border-slate-800 col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-905 dark:text-white">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-350 block uppercase tracking-wider">Office Address</h4>
                    <p className="text-xs font-sans font-extrabold text-slate-900 dark:text-white mt-0.5">Innovationix IT Solutions LLP</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">N3-IRC Village, Nayapali, Bhubaneswar, Odisha-751015</p>
                  </div>
                </div>

              </div>

              {/* Social Icons matching request */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-widest">Follow AppointO Updates</span>
                <div className="flex flex-wrap gap-2 text-slate-500 dark:text-slate-400">
                  {['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'WhatsApp'].map((social) => (
                    <button
                      key={social}
                      onClick={() => alert(`Redirecting to AppointO official ${social} account (Simulation)`)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Interactive Contact / Demo Coordinates Form */}
            <div className="lg:col-span-7 w-full max-w-full overflow-hidden">
              <div className="rounded-3xl bg-white p-4 sm:p-8 shadow-xl dark:bg-slate-900 relative overflow-hidden" id="demo-form-box">

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
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-md leading-normal">
                      We registered your clinic/salon onboarding parameters for <strong className="text-slate-800 dark:text-white">{contactBusiness}</strong>. Our service specialists are checking slot availability in <strong className="text-slate-800 dark:text-white">{contactCity || 'your city'}</strong>.
                    </p>

                    {/* Simulation Pipeline animation stages */}
                    <div className="mt-6 w-full max-w-sm rounded-xl bg-slate-50 p-4 text-left space-y-3 dark:bg-slate-950">
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
                        <span className={`text-xs ${contactSuccessTimer >= 3 ? 'text-slate-700 dark:text-slate-250 font-bold' : 'text-slate-400'}`}>WhatsApp sandbox triggers online</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsContactSubmitted(false);
                        setContactName('');
                        setContactBusiness('');
                        setContactPhone('');
                        setContactEmail('');
                        setContactCity('');
                        setContactMessage('');
                        setTouchedFields({});
                        setContactErrors({});
                      }}
                      className="mt-8 rounded-xl bg-slate-100 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-white"
                      id="reset-form-btn"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 w-full">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                        Request Free Onboarding Demo
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Let us show you how AppointO can scale your customer bookings.
                      </p>

                      {/* Subtle Form Completion Progress Bar */}
                      <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800/60" id="form-progress-indicator">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            </span>
                            <span>Setup Profile Progress</span>
                          </div>
                          <span className="font-mono text-xs text-blue-600 dark:text-cyan-400">
                            {getFormProgress()}% Complete
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${getFormProgress()}%` }}
                            animate={{ width: `${getFormProgress()}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                        {getFormProgress() === 100 ? (
                          <p className="text-[10.5px] font-semibold text-emerald-600 mt-2 flex items-center gap-1 leading-normal">
                            <span>🎉 All required fields successfully filled! You are ready to request your custom sandbox.</span>
                          </p>
                        ) : (
                          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between font-medium">
                            <span>Please fill in Name, Business Name, WhatsApp, and City.</span>
                            <span className="font-semibold text-slate-500 dark:text-slate-300 font-mono">
                              {4 - Math.round(getFormProgress() / 25)} left
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. Dr. Anand Deshmukh"
                            className={`w-full rounded-xl border px-4 py-4.5 pr-20 text-xs outline-none transition-colors ${
                              contactErrors.name
                                ? 'border-red-500 bg-rose-50/50 text-red-900 focus:border-red-650 dark:bg-rose-950/20 dark:text-rose-250 dark:border-rose-900'
                                : 'border-slate-200 bg-white focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {contactName && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContactName('');
                                  setTouchedFields(prev => ({ ...prev, name: false }));
                                }}
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded focus:outline-none"
                              >
                                Clear
                              </button>
                            )}
                            {touchedFields.name && (
                              <div className="flex items-center justify-center pointer-events-none">
                                {contactErrors.name ? (
                                  <X className="w-4 h-4 text-red-500 shrink-0" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {contactErrors.name && (
                          <p className="mt-1 text-[10px] font-semibold text-red-600 dark:text-rose-400 leading-tight">
                            ⚠️ {contactErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                          Business / Clinic Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={contactBusiness}
                            onChange={(e) => handleBusinessChange(e.target.value)}
                            placeholder="e.g. Dental Care Center"
                            className={`w-full rounded-xl border px-4 py-4.5 pr-20 text-xs outline-none transition-colors ${
                              contactErrors.business
                                ? 'border-red-500 bg-rose-50/50 text-red-900 focus:border-red-650 dark:bg-rose-950/20 dark:text-rose-250 dark:border-rose-900'
                                : 'border-slate-200 bg-white focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {contactBusiness && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContactBusiness('');
                                  setTouchedFields(prev => ({ ...prev, business: false }));
                                }}
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded focus:outline-none"
                              >
                                Clear
                              </button>
                            )}
                            {touchedFields.business && (
                              <div className="flex items-center justify-center pointer-events-none">
                                {contactErrors.business ? (
                                  <X className="w-4 h-4 text-red-500 shrink-0" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {contactErrors.business && (
                          <p className="mt-1 text-[10px] font-semibold text-red-600 dark:text-rose-400 leading-tight">
                            ⚠️ {contactErrors.business}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                          WhatsApp Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          {(() => {
                            const stripped = contactPhone.replace(/\D/g, '');
                            let flag = '🇮🇳';
                            let label = 'IN';
                            if (contactPhone.startsWith('+')) {
                              if (stripped.startsWith('1')) { flag = '🇺🇸'; label = 'US'; }
                              else if (stripped.startsWith('44')) { flag = '🇬🇧'; label = 'UK'; }
                              else if (stripped.startsWith('971')) { flag = '🇦🇪'; label = 'AE'; }
                              else if (stripped.startsWith('65')) { flag = '🇸🇬'; label = 'SG'; }
                              else if (stripped.startsWith('61')) { flag = '🇦🇺'; label = 'AU'; }
                              else if (stripped.startsWith('91')) { flag = '🇮🇳'; label = 'IN'; }
                              else if (detectedCountry) { flag = detectedCountry.flag; label = detectedCountry.code; }
                              else if (stripped.length > 0) { flag = '🌐'; label = 'INT'; }
                            } else if (stripped.startsWith('91')) {
                              flag = '🇮🇳'; label = 'IN';
                            } else if (detectedCountry) {
                              flag = detectedCountry.flag;
                              label = detectedCountry.code;
                            }
                            return (
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 dark:bg-slate-800/80 dark:border-slate-700/60 pl-1.5 pr-2 py-1 rounded-lg select-none pointer-events-none text-xs font-bold text-slate-500 dark:text-slate-400">
                                <span className="text-sm leading-none">{flag}</span>
                                <span className="text-[9px] tracking-wider font-extrabold leading-none text-slate-400 dark:text-slate-500">{label}</span>
                              </div>
                            );
                          })()}
                          <input
                            type="tel"
                            required
                            value={contactPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="e.g. 98765 43210"
                            className={`w-full rounded-xl border pl-15 py-4.5 pr-20 text-xs outline-none transition-colors ${
                              contactErrors.phone
                                ? 'border-red-500 bg-rose-50/50 text-red-900 focus:border-red-650 dark:bg-rose-950/20 dark:text-rose-250 dark:border-rose-900'
                                : 'border-slate-200 bg-white focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {contactPhone && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContactPhone('');
                                  setTouchedFields(prev => ({ ...prev, phone: false }));
                                }}
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded focus:outline-none"
                              >
                                Clear
                              </button>
                            )}
                            {touchedFields.phone && (
                              <div className="flex items-center justify-center pointer-events-none">
                                {contactErrors.phone ? (
                                  <X className="w-4 h-4 text-red-500 shrink-0" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {contactErrors.phone && (
                          <p className="mt-1 text-[10px] font-semibold text-red-600 dark:text-rose-400 leading-tight">
                            ⚠️ {contactErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            placeholder="anand@gmail.com"
                            className={`w-full rounded-xl border px-4 py-4.5 pr-20 text-xs outline-none transition-colors ${
                              contactErrors.email
                                ? 'border-red-500 bg-rose-50/50 text-red-900 focus:border-red-650 dark:bg-rose-950/20 dark:text-rose-250 dark:border-rose-900'
                                : 'border-slate-200 bg-white focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {contactEmail && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContactEmail('');
                                  setTouchedFields(prev => ({ ...prev, email: false }));
                                }}
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded focus:outline-none"
                              >
                                Clear
                              </button>
                            )}
                            {touchedFields.email && (
                              <div className="flex items-center justify-center pointer-events-none">
                                {contactErrors.email ? (
                                  <X className="w-4 h-4 text-red-500 shrink-0" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {contactErrors.email && (
                          <p className="mt-1 text-[10px] font-semibold text-red-600 dark:text-rose-400 leading-tight">
                            ⚠️ {contactErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div>
                        <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                          Business Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={contactType}
                          onChange={(e) => setContactType(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                        <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={contactCity}
                            onChange={(e) => handleCityChange(e.target.value)}
                            placeholder="e.g. Nagpur / Patna"
                            className={`w-full rounded-xl border px-4 py-4.5 pr-20 text-xs outline-none transition-colors ${
                              contactErrors.city
                                ? 'border-red-500 bg-rose-50/50 text-red-900 focus:border-red-650 dark:bg-rose-950/20 dark:text-rose-250 dark:border-rose-900'
                                : 'border-slate-200 bg-white focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {contactCity && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContactCity('');
                                  setTouchedFields(prev => ({ ...prev, city: false }));
                                }}
                                className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded focus:outline-none"
                              >
                                Clear
                              </button>
                            )}
                            {touchedFields.city && (
                              <div className="flex items-center justify-center pointer-events-none">
                                {contactErrors.city ? (
                                  <X className="w-4 h-4 text-red-500 shrink-0" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {contactErrors.city && (
                          <p className="mt-1 text-[10px] font-semibold text-red-600 dark:text-rose-400 leading-tight">
                            ⚠️ {contactErrors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13.5px] sm:text-sm font-extrabold text-slate-800 dark:text-slate-350 mb-1 leading-snug">
                        Message / Custom Requirements
                      </label>
                      <div className="relative">
                        <textarea
                          rows={3}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tell us about daily booking volume, staff count, language choices etc."
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-16 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                        />
                        {contactMessage && (
                          <div className="absolute right-4 top-3.5">
                            <button
                              type="button"
                              onClick={() => setContactMessage('')}
                              className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded focus:outline-none"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4.5 text-xs font-extrabold text-white shadow-lg shadow-blue-500/10 transition hover:from-blue-700 hover:to-cyan-650"
                      id="contact-form-submit"
                    >
                      Request Free Demo Setup
                    </button>

                    <p className="text-center text-[10px] text-slate-500 font-semibold">
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
        <SubPages initialPage={currentPage} onNavigate={(p, s) => handleNavClick(p, s)} darkMode={darkMode} />
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
                  <li><button onClick={() => handleNavClick('terms')} className="hover:text-blue-400 text-left cursor-pointer">Terms & Conditions</button></li>
                  <li><button onClick={() => handleNavClick('refunds')} className="hover:text-blue-400 text-left cursor-pointer">Refunds & Cancellations</button></li>
                  <li><button onClick={() => handleNavClick('shipping')} className="hover:text-blue-400 text-left cursor-pointer">Shipping & Digital Delivery</button></li>
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
        onSubscriptionActivated={fetchSubscriptionStatus}
        prefillData={razorpayPrefill}
      />

      {/* Admin Login Modal Portal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(data) => {
          setAdminUser(data);
          setCurrentPage('crm');
        }}
      />

      {/* PWA-style Bottom Navigation Bar for Mobile */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-md border-t border-slate-800 px-4 py-2 pb-safe shadow-2xl"
        id="pwa-mobile-nav"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Home Tab */}
          <button 
            onClick={() => handleNavClick('home', 'hero')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentPage === 'home' 
                ? 'text-blue-400 font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-white'
            }`}
            id="mobile-tab-home"
          >
            <Home className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] tracking-wide uppercase">Home</span>
          </button>

          {/* Simulate Book / Demo Tab (Action Center) */}
          <button 
            onClick={() => triggerDemoWithIndustry('clinics')}
            className="flex flex-col items-center justify-center flex-1 py-1"
            id="mobile-tab-demo"
          >
            <div className="relative flex items-center justify-center h-10 w-10 -mt-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/20 active:scale-90 transition transform duration-155 border-4 border-slate-900 dark:border-slate-950">
              <Sparkles className="h-4.5 w-4.5 fill-white text-white animate-pulse" />
            </div>
            <span className="text-[10px] tracking-wide uppercase font-extrabold text-blue-400 dark:text-cyan-400">Demo</span>
          </button>

          {/* Plans Tab */}
          <button 
            onClick={() => handleNavClick('home', 'plans')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentPage === 'home' && window.location.hash === '#plans'
                ? 'text-blue-400 font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-white'
            }`}
            id="mobile-tab-plans"
          >
            <CreditCard className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] tracking-wide uppercase">Plans</span>
          </button>

          {/* Admin CRM Tab */}
          <button 
            onClick={() => {
              if (adminUser) {
                setCurrentPage('crm');
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentPage === 'crm' 
                ? 'text-blue-400 font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-white'
            }`}
            id="mobile-tab-admin"
          >
            <Key className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] tracking-wide uppercase">Admin</span>
          </button>

          {/* Support Tab */}
          <button 
            onClick={() => handleNavClick('help')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentPage === 'help' || currentPage === 'privacy' || currentPage === 'terms' || currentPage === 'refunds' || currentPage === 'shipping'
                ? 'text-blue-400 font-extrabold scale-105' 
                : 'text-slate-400 dark:text-slate-500 hover:text-white font-bold'
            }`}
            id="mobile-tab-support"
          >
            <HelpCircle className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] tracking-wide uppercase">Support</span>
          </button>
        </div>
      </div>

    </div>
  );
}
