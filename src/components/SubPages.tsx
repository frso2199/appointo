import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, HelpCircle, Shield, FileText, ArrowLeft, Search, 
  ChevronDown, ChevronRight, MessageSquare, Clock, ArrowRight, CheckCircle2,
  DollarSign, RefreshCw, Truck
} from 'lucide-react';

interface SubPagesProps {
  initialPage: 'blog' | 'help' | 'privacy' | 'terms' | 'refunds' | 'shipping';
  onNavigate: (page: 'home' | 'blog' | 'help' | 'privacy' | 'terms' | 'refunds' | 'shipping', sectionId?: string) => void;
  darkMode: boolean;
}

export default function SubPages({ initialPage, onNavigate, darkMode }: SubPagesProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'help' | 'privacy' | 'terms' | 'refunds' | 'shipping'>(initialPage as any);

  React.useEffect(() => {
    setActiveTab(initialPage as any);
  }, [initialPage]);

  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');

  // Interactive Blog Data
  const blogPosts = [
    {
      id: 1,
      title: 'How Dr. Anand Deshmukh Reduced Clinic No-Shows by 88% Using WhatsApp',
      excerpt: 'Discover the exact step-by-step automated workflow used to remind dental patients 24 hours prior without manual calling campaigns.',
      category: 'Case Study',
      readTime: '4 min read',
      date: 'May 28, 2026',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'The Blueprint to High-Converting Booking Flows for Premium Salons',
      excerpt: 'Why 1-click self-scheduling outperforms traditional phone bookings by 3x and boosts weekend staff utilization.',
      category: 'Pro Tips',
      readTime: '6 min read',
      date: 'May 22, 2026',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: '5 Crucial Compliance Audits for Online Appointment Gateways',
      excerpt: 'Ensure your booking framework meets Razorpay, Stripe, and banking authentication mandates for zero-leak merchant statuses.',
      category: 'Security',
      readTime: '5 min read',
      date: 'May 15, 2026',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    }
  ];

  // Interactive FAQs Dataset (Help Center)
  const faqCategories = ['All', 'WhatsApp Integration', 'Bookings & Cancellations', 'Billing & Setup'];
  
  const faqItems = [
    {
      id: 1,
      category: 'WhatsApp Integration',
      question: 'Do patients/customers need to install any app to receive reminders?',
      answer: 'No, absolutely not! Your clients receive standard, official WhatsApp messages from your business handle with fully interactive buttons like "Confirm", "Reschedule", or "Cancel". They can confirm with a single click, which instantly updates your dashboard.'
    },
    {
      id: 2,
      category: 'WhatsApp Integration',
      question: 'Is it fully compliant with Meta official WhatsApp policies?',
      answer: 'Yes. AppointO works directly with the official Meta Cloud WhatsApp API credentials. We handle prompt approvals of your customized message templates so you have zero risk of spam filters or business verification issues.'
    },
    {
      id: 3,
      category: 'Bookings & Cancellations',
      question: 'How do automated cancellations and rescheduling loops work?',
      answer: 'You can configure your custom cooling-off periods (e.g., "no rescheduling 2 hours before target booking"). If a customer cancels via a WhatsApp confirmation template button, the slot is instantly freed, or they are auto-redirected to pick an off-peak opening.'
    },
    {
      id: 4,
      category: 'Billing & Setup',
      question: 'What is included in the ₹99 Onboarding Trial?',
      answer: 'Our ₹99 first-month package includes: official Meta WhatsApp API setup help, 1-on-1 staff video training, custom CSS styling for your booking links, and integration with your CRM or Google Calendars. No hidden setup fees, cancel anytime.'
    },
    {
      id: 5,
      category: 'Billing & Setup',
      question: 'How do you collect secure prepayments for bookings?',
      answer: 'AppointO integrates directly with major standard gateways like Razorpay, UPI, PayU, and Stripe. You can choose to enforce full online prepayment, a fixed holding deposit, or simple pay-at-venue schedules.'
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = selectedFaqCategory === 'All' || item.category === selectedFaqCategory;
    const matchesSearch = item.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} pb-16`}>
      
      {/* Dynamic Subpage Hero Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          
          {/* Back Home Navigation */}
          <button 
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold tracking-wider uppercase bg-slate-800/40 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition mb-6"
            id="back-home-button"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#06B6D4] uppercase block mb-1">APPOINTO PORTAL</span>
              <h1 className="text-3xl font-extrabold tracking-tight font-sans sm:text-4xl">
                {activeTab === 'blog' && 'Resources & Business Blog'}
                {activeTab === 'help' && 'AppointO Help Center'}
                {activeTab === 'privacy' && 'Privacy & Compliance Standards'}
                {activeTab === 'terms' && 'Platform Service Terms'}
                {activeTab === 'refunds' && 'Refunds & Cancellations Policy'}
                {activeTab === 'shipping' && 'Shipping & Digital Delivery'}
              </h1>
              <p className="mt-2 text-xs text-slate-400 max-w-xl">
                {activeTab === 'blog' && 'Expert optimization, conversion tips, and customer success templates for local clinics and salons.'}
                {activeTab === 'help' && 'Find official setup guides, developer documents, and answers to your WhatsApp system questions.'}
                {activeTab === 'privacy' && 'Compliant customer storage, patient records safety policies, and parent company rights.'}
                {activeTab === 'terms' && 'Clear online service booking agreements, parent company rights, and service guidelines.'}
                {activeTab === 'refunds' && 'Complete refund processing window, bank credits, and cancellation terms.'}
                {activeTab === 'shipping' && 'Minimum and Maximum digital activation delivery timelines for our SaaS platforms.'}
              </p>
            </div>

            {/* Quick mini switcher */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50 max-w-full shrink-0">
              <button 
                onClick={() => setActiveTab('blog')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'blog' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <BookOpen className="h-3.5 w-3.5" /> Blog
              </button>
              <button 
                onClick={() => setActiveTab('help')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'help' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <HelpCircle className="h-3.5 w-3.5" /> Help
              </button>
              <button 
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'privacy' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Shield className="h-3.5 w-3.5" /> Privacy
              </button>
              <button 
                onClick={() => setActiveTab('terms')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'terms' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <FileText className="h-3.5 w-3.5" /> Terms
              </button>
              <button 
                onClick={() => setActiveTab('refunds')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'refunds' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refunds
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'shipping' ? 'bg-[#2563EB] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Truck className="h-3.5 w-3.5" /> Delivery Policy
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* =======================================
            TAB COMPONENT 1: COMPREHENSIVE BLOG
            ======================================= */}
        {activeTab === 'blog' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
            id="blog-section-container"
          >
            {/* Main Featured Article */}
            <div className="grid md:grid-cols-12 gap-6 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm">
              <div className="md:col-span-7 h-64 md:h-full min-h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Modern Clinic" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-center space-y-4">
                <span className="self-start text-[10px] font-black bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-200/20">
                  Featured Case Study
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  The Complete Meta WhatsApp Scheduling Integration Guide (2026 Edition)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  How automation pipelines manage client registrations, verify OTP coordinates, and trigger personalized follow-ups without paying premium agency retainers.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-bold">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 8 min read</span>
                  <span>•</span>
                  <span>May 30, 2026</span>
                </div>
                <button 
                  onClick={() => alert("Deep Blog Post reading mode: Our full case study document is loaded in support. Dynamic PDF download of templates enabled.")}
                  className="group self-start inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-cyan-400 hover:underline uppercase tracking-wide"
                >
                  Read Complete Article <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Grid layout for Articles */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Trending Research & Resources</h3>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map(post => (
                  <article 
                    key={post.id}
                    className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-800 transition hover:shadow-lg shadow-sm"
                  >
                    <div className="h-44 overflow-hidden bg-slate-100">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">{post.category}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{post.readTime}</span>
                        </div>
                        <h4 className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{post.date}</span>
                        <button 
                          onClick={() => alert(`Opening "${post.title}" optimization resource file...`)}
                          className="text-[11px] font-extrabold text-blue-600 dark:text-cyan-400 hover:underline hover:text-blue-700"
                        >
                          Read Post →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            
            {/* Call to action */}
            <div className="rounded-3xl bg-blue-500/5 border border-blue-500/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-sm font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">Get Optimization Hacks</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                  Join 1,200+ dental experts, cosmetic clinics, and studio salons. We send real, actionable automated chat flows once every two weeks.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('home', 'contact')} 
                className="rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 text-xs font-bold shadow-md shadow-blue-500/15 text-center"
              >
                Register For A Free Demo Setup
              </button>
            </div>
          </motion.div>
        )}

        {/* =======================================
            TAB COMPONENT 2: INTERACTIVE HELP CENTER & FAQS
            ======================================= */}
        {activeTab === 'help' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            id="help-section-container"
          >
            {/* Live Search & Categories Box */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                <input 
                  type="text"
                  placeholder="Search questions (e.g., Trial, WhatsApp, Refund)"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-500 dark:text-white"
                />
              </div>

              {/* FAQ Categories select */}
              <div className="flex flex-wrap gap-1">
                {faqCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFaqCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${selectedFaqCategory === cat ? 'bg-slate-900 border border-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/50 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 dark:border-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-3.5">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaq === index;
                  return (
                    <div 
                      key={faq.id}
                      className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 overflow-hidden rounded-xl transition hover:border-blue-500/40"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : index)}
                        className="w-full text-left p-4.5 sm:p-5 flex items-center justify-between gap-4 select-none"
                      >
                        <div className="flex items-start gap-3">
                          <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded bg-blue-50/50 text-[#2563EB] font-bold text-[10px] mt-0.5 dark:bg-blue-950 dark:text-blue-400">
                            FAQ
                          </span>
                          <div>
                            <span className="text-[9px] font-black tracking-widest text-[#06B6D4] uppercase block">{faq.category}</span>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block leading-tight">{faq.question}</span>
                          </div>
                        </div>
                        <div className="shrink-0 p-1 rounded-lg bg-slate-50 dark:bg-slate-950">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500 rotate-180 transition-transform" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1.5 border-t border-slate-100/60 dark:border-slate-800/40">
                          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                  <HelpCircle className="h-8 w-8 text-slate-400 mx-auto animate-pulse" />
                  <p className="mt-2 text-xs font-bold text-slate-500">No matched FAQs found for "{faqSearch}".</p>
                  <button 
                    onClick={() => { setFaqSearch(''); setSelectedFaqCategory('All'); }}
                    className="mt-2.5 text-xs text-blue-600 font-extrabold hover:underline uppercase"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Standard contact support section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 opacity-10 font-black text-9xl">?</div>
              <div className="relative space-y-4">
                <h4 className="text-xl font-black">Still have unsolved questions?</h4>
                <p className="text-xs text-blue-50/80 max-w-xl">
                  Contact AppointO support team instantly. We respond within 3 hours. Our engineers can guide you through dental CRM, Twilio parameters, or local offline configurations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a 
                    href="mailto:success@appointo.online"
                    className="rounded-xl bg-white px-5 py-2.5 text-xs font-extrabold text-[#2563EB] shadow-md shadow-black/10 inline-flex items-center gap-1.5 justify-center hover:bg-slate-55"
                  >
                    💌 Email Support: success@appointo.online
                  </a>
                  <a 
                    href="tel:+918104530286"
                    className="rounded-xl border border-white/60 hover:bg-white/10 px-5 py-2.5 text-xs font-extrabold text-white text-center inline-flex items-center gap-1.5 justify-center"
                  >
                    📞 Ring support desk: +91 8104530286
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =======================================
            TAB COMPONENT 3: ONLINE BOOKING PRIVACY POLICY
            ======================================= */}
        {activeTab === 'privacy' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-12 gap-8"
            id="privacy-section-container"
          >
            <div className="md:col-span-4">
              <div className="sticky top-20 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Privacy Quick Guide</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Our customer compliance parameters are designed according to India IT Act rules and standard data safety protocols.</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> Patient HIPAA compliant options
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> 100% Secure SSL & Tokenization
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> Opt-out of active WhatsApp triggers inside chat
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 text-blue-600 border border-blue-500/10 rounded-xl text-left">
                  <h5 className="text-[10px] font-black uppercase tracking-wider">Parent Organization Rights</h5>
                  <p className="text-[10px] mt-1 text-slate-500 leading-normal">
                    <strong>Innovationix IT Solutions LLP</strong> owns all the rights, trademarks, patents, and core codebase of the three underlying strategic SaaS platforms (AppointO, SalonO, and ClinicO).
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-6 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
              <h3 className="text-base font-extrabold text-[#2563EB] dark:text-cyan-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Online Service Booking Privacy Policy</h3>
              <p className="text-[10px] text-slate-400">Last updated: June 3, 2026</p>
              
              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">1. Corporate Stewardship & Intellectual Property Holdings</h4>
                <p>
                  This Privacy Policy is governed and administered by <strong>Innovationix IT Solutions LLP</strong>, the parent organization which owns all structural, trademark, licensing, and database intellectual property rights across our suite of three (3) active SaaS scheduling platforms:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-1 text-slate-500 dark:text-slate-400 font-medium">
                  <li><strong className="text-slate-800 dark:text-slate-200">AppointO Suite:</strong> Automated appointment booking links, multi-calendar visualizers, and conversational Meta Cloud WhatsApp triggers.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">SalonO Suite:</strong> Premium salon reservation, beauty professional desk allocator, and team slot dashboard.</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">ClinicO Suite:</strong> HIPAA-compliant clinical queue assistants, patient electronic intake records, and automated doctor checkouts.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">2. Collected Coordinates & Onboarding Data</h4>
                <p>
                  When you utilize AppointO, SalonO, or ClinicO Technologies to manage appointments, handle client files, or configure custom WhatsApp notification campaigns, we collect necessary validation parameters. This includes client names, mobile numbers (mandatory for instant WhatsApp delivery pipelines), corporate GST credentials, and payment processor transaction tokens.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">3. Automated Reminders and WhatsApp Policy</h4>
                <p>
                  As an official Meta Cloud WhatsApp BSP provider, our systems issue notifications only for active schedule updates. By onboarding your clinical, beauty salon, or service firm workspace, you guarantee that you have established an opt-out pathway for customers. We do not use user credentials for unsolicited third-party advertising.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">4. Banking & Transaction Security</h4>
                <p>
                  Our SaaS subscription plans and integrated prepayment widgets link directly to RBI-authorized gateways like Razorpay, Stripe, and UPI. No financial card PINs, passwords, or CVV digits are stored on the parent company's local servers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">5. Deletion & Data Retention Rights</h4>
                <p>
                  At any point, administrators can request complete data purged inside AppointO database directories. File a delete request coordinates by writing to our security officer at <strong className="text-blue-600 dark:text-cyan-400 font-bold">success@appointo.online</strong>.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* =======================================
            TAB COMPONENT 4: PLATFORM TERMS OF SERVICE
            ======================================= */}
        {activeTab === 'terms' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-12 gap-8"
            id="terms-section-container"
          >
            <div className="md:col-span-4">
              <div className="sticky top-20 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Service Highlights</h4>
                <p className="text-[11px] text-slate-500">
                  By executing booking services via AppointO, SalonO, or ClinicO, you subscribe completely to the standard terms administered by Innovationix IT Solutions LLP.
                </p>
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800 space-y-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <p>✓ Limit of 1 active demo workspace per verified local business link.</p>
                  <p>✓ All payments processed are subject to the standard salon/clinic refund window settings.</p>
                  <p>✓ Prohibited configuration of spam campaigns or unapproved promotional alerts.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-6 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
              <h3 className="text-base font-extrabold text-[#2563EB] dark:text-cyan-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Platform Terms & Conditions</h3>
              <p className="text-[10px] text-slate-400">Last updated: June 3, 2026</p>

              <p>
                Welcome to AppointO. By accessing our platform, utilizing the scheduling widgets, sandboxing with clinic booking modules, or testing the WhatsApp live automated dashboard, you are agreeing to the following platform guidelines:
              </p>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">1. Trademark Ownership & Parent Company Stewardship</h4>
                <p>
                  <strong>Innovationix IT Solutions LLP</strong> owns all statutory, common law, trademark, copyright, database repository, and technical operational rights over the three parent-authorized SaaS scheduling configurations represented and distributed through this framework:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-500 dark:text-slate-400">
                  <li><strong className="text-slate-700 dark:text-white">AppointO:</strong> General SaaS scheduler and official Meta Cloud WhatsApp Automation manager.</li>
                  <li><strong className="text-slate-700 dark:text-white">SalonO:</strong> Salon reservation, beauty professional desk allocator, and team slot dashboard.</li>
                  <li><strong className="text-slate-700 dark:text-white">ClinicO:</strong> Clinic token generator, digital medical receptionist queue assistant, and record-keeping widget.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">2. Enterprise Software & Pricing</h4>
                <p>
                  Subscriptions are billed recurringly as per the chosen Starter (₹499/monthly), Professional (₹999/monthly), or Enterprise/Business (₹1,999/monthly) options. Payments are processed securely via external Indian banking gateways. Price changes are notified with a minimum 30-day notice.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">3. Trial Use and Registration Limits</h4>
                <p>
                  The ₹99 Onboarding Trial is configured exclusively for single-clinic, single-salon, or individual professional entities. Scraping or registering multiple slots with fraudulent WhatsApp numbers to bypass standard verification limits will trigger auto-termination of the sandbox environment.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">4. Refund Rules and Customer Cancellations</h4>
                <p>
                  Cancellations initiated through AppointO, SalonO, or ClinicO widgets are authorized and delivered to your respective business parameters. Businesses are legally liable for configuring correct cancellation windows and initiating prompt payouts or credit options through our integrations where appropriate. Approved refund processing follows the unified banking window of <strong>5-7 working days</strong>.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">5. Acceptable Use Policy</h4>
                <p>
                  You are strictly prohibited from transmitting message templates of a purely unsolicited promotional, betting, or financial marketing nature. AppointO templates must be used strictly for bookings, cancellations, service logs, client updates, and feedback collection.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase font-sans">6. Legal Jurisdiction & Office Operations</h4>
                <p>
                  These Terms of Service are governed by laws of Republic of India. Any litigation, conflicts or service escalations must be directed to our home of operations at:
                  <br />
                  <strong className="text-slate-800 dark:text-white block mt-1.5 font-bold">
                    Innovationix IT Solutions LLP, N3-IRC Village, Nayapali, Bhubaneswar, Odisha-751015
                  </strong>
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* =======================================
            TAB COMPONENT 5: REFUNDS AND CANCELLATIONS
            ======================================= */}
        {activeTab === 'refunds' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-12 gap-8"
            id="refunds-section-container"
          >
            <div className="md:col-span-4">
              <div className="sticky top-20 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Refund Summary</h4>
                <p className="text-[11px] text-slate-500">
                  Fully transparent refund policy aligned to the digital software products and medical/wellness reservation services available on the platforms.
                </p>
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800 space-y-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <p>✓ <strong className="text-slate-900 dark:text-white">SaaS Subscriptions:</strong> Refund requests valid within 7 days of payment verification.</p>
                  <p>✓ <strong className="text-slate-900 dark:text-white">Bank Processing:</strong> Typically credited in <strong>5-7 working days</strong>.</p>
                  <p>✓ Operated and owned by <strong>Innovationix IT Solutions LLP</strong>.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-6 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
              <h3 className="text-base font-extrabold text-[#2563EB] dark:text-cyan-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Refunds & Cancellations Policy</h3>
              <p className="text-[10px] text-slate-400">Last updated: June 3, 2026</p>

              <p>
                At <strong>AppointO</strong> (including our sister suites <strong>SalonO</strong> and <strong>ClinicO</strong>), presented and managed by our parent entity <strong>Innovationix IT Solutions LLP</strong>, we value patient-care trust and merchant commitment. This document governs all cancellations and requests for refunds for digital SaaS licenses and online reservation fees.
              </p>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">1. SaaS Subscription Refunds (AppointO / SalonO / ClinicO License)</h4>
                <p>
                  We offer a dedicated <strong>7-Day Risk-Free Cooling Window</strong>. If you are not fully satisfied with our automated WhatsApp templates, custom calendar booking flows, or staff shift allocations matching your subscription package (Starter, Professional, or Business tiers), you can request a cancellation within 7 days of the transaction timestamp.
                </p>
                <p>
                  Once approved by our financial verification unit, the refund is initiated. The amount will be processed and credited back to the customer's original payment method (original bank account, credit card, or UPI wallet coordinates) within <strong>5 to 7 working days</strong>.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">2. Onboarding Fee Cancellation Policy</h4>
                <p>
                  The introductory <strong>₹99 AppointO Onboarding Trial</strong> offer is fully non-refundable due to the custom automated WhatsApp API and Meta sandbox setup services initiated instantaneously upon signup. Ongoing monthly subscriptions can be deleted or canceled at any time from the admin cockpit without termination charges.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">3. Customer / Patient Reservation Refunds</h4>
                <p>
                  For end-clients or patients booking reservation slots at clinics and beauty lounges powered by our SaaS widgets:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <li>Cancellations are subject to the specific cooling-off settings configured by the merchant clinic/salon administrator (e.g., "Full refund options valid up to 12 hours before slot").</li>
                  <li>In scenarios where a refund is authorized by the merchant, our secure payment integrations will process and dispatch the credit to the customer's bank account within <strong>5-7 working days</strong>.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">4. Submitting a Refund Ticket</h4>
                <p>
                  To secure your refund or cancel active recurring payments, please transmit your payment reference, invoice ID, and registered WhatsApp mobile number to:
                  <br />
                  <strong className="text-blue-600 dark:text-cyan-400 font-bold">success@appointo.online</strong> or ring our helpdesk at <strong className="text-slate-800 dark:text-white font-bold">+91 8104530286</strong>.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* =======================================
            TAB COMPONENT 6: SHIPPING AND DIGITAL DELIVERY
            ======================================= */}
        {activeTab === 'shipping' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-12 gap-8"
            id="shipping-section-container"
          >
            <div className="md:col-span-4">
              <div className="sticky top-20 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Delivery Details</h4>
                <p className="text-[11px] text-slate-500">
                  Because our platforms are entirely cloud-hosted software offerings (SaaS), physical mailing or parcel logistics are not required.
                </p>
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800 space-y-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <p>🚀 <strong className="text-slate-900 dark:text-white">Minimum Timeline:</strong> Immediate setup (under <strong>5 minutes</strong>).</p>
                  <p>⌛ <strong className="text-slate-900 dark:text-white">Maximum Timeline:</strong> Customized setups completed within <strong>24-48 hours</strong>.</p>
                  <p>✓ All systems backed by <strong>Innovationix IT Solutions LLP</strong>.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-6 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
              <h3 className="text-base font-extrabold text-[#2563EB] dark:text-cyan-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Shipping & Digital Delivery Policy</h3>
              <p className="text-[10px] text-slate-400">Last updated: June 3, 2026</p>

              <p>
                This Shipping Policy describes the instant electronic provisioning pipelines implemented by <strong>Innovationix IT Solutions LLP</strong> to deliver active licenses, custom dashboard coordinates, and WhatsApp templates.
              </p>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">1. Mode of Dispatch (Electronic Only)</h4>
                <p>
                  No physical box, paper documents, hardware dongles, or storage units are delivered. All tools (including the booking widgets, SMS remind gateways, medical records, and team shift parameters) are hosted on our secure, cloud Cloud Run containers. Access credentials and administrative keys are dispatched exclusively to your corporate email or WhatsApp coordinates.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">2. Delivery Timelines (Minimum & Maximum)</h4>
                <ul className="list-disc pl-5 space-y-2 mt-1">
                  <li>
                    <strong className="text-slate-800 dark:text-white">Minimum Timeline (Instant Provisioning):</strong> 
                    Upon successful Razorpay/Stripe checkout validation, your default portal sub-domain (e.g., <code>yourbiz.appointo.online</code>) will be created, and your login keys will be dispatched to your inbox within <strong>5 minutes</strong>.
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-white">Maximum Timeline (Custom & Custom Integrations):</strong> 
                    For custom onboarding templates, multi-chair clinic queue structures, custom domain configurations, or advanced Meta corporate WhatsApp CRM API approval loops, our team of engineers will complete setups, verify configurations, and hand over the live interface within <strong>24 to 48 hours</strong> of verification.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">3. Delivery Discrepancies</h4>
                <p>
                  If you do not receive your onboarding dispatch details within 30 minutes of payment validation, please check your spam folders or contact our instant delivery desk via <strong className="text-blue-600 dark:text-cyan-400 font-bold">success@appointo.online</strong> for manual key allocation.
                </p>
              </section>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
