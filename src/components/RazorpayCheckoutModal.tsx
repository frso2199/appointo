import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, 
  HelpCircle, Smartphone, Calendar, User, Mail, ArrowRight, Loader2,
  Building, MapPin, Layers, CheckSquare, Award, Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: number; // in INR
    billingCycle: string;
  } | null;
  darkMode: boolean;
  onSubscriptionActivated?: (subData: any) => void;
  prefillData?: { name: string; business: string; phone: string } | null;
}

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  darkMode,
  onSubscriptionActivated,
  prefillData
}: RazorpayCheckoutModalProps) {
  // Wizard steps: 'profile' (Step 1) -> 'plan_select' (Step 2) -> 'trial_offer' (Step 3) -> 'checkout' (Step 4) -> 'success' (Step 5)
  const [step, setStep] = useState<'profile' | 'plan_select' | 'trial_offer' | 'checkout' | 'success'>('profile');
  
  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Clinic');

  // Selected plan state
  const [activePlanName, setActivePlanName] = useState<'Starter' | 'Professional' | 'Business'>('Starter');
  const [activePlanPrice, setActivePlanPrice] = useState(499);

  // Script loaded indicator
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout status metrics
  const [errorMessage, setErrorMessage] = useState('');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  // Diagnostic Telemetry State
  const [logs, setLogs] = useState<Array<{ timestamp: string; level: 'info' | 'warn' | 'error' | 'success'; message: string }>>([
    {
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'Diagnostic Telemetry initialized. Ready for payment lifecycle tracking.'
    }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, level: 'info' | 'warn' | 'error' | 'success' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    let color = '#2563EB'; // info
    if (level === 'success') color = '#10B981';
    if (level === 'warn') color = '#F59E0B';
    if (level === 'error') color = '#EF4444';
    
    console.log(
      `%c[AppointO Gateway][${level.toUpperCase()}][${timestamp}] ${message}`,
      `color: ${color}; font-weight: bold; background: rgba(0,0,0,0.02); padding: 2px 4px; border-radius: 4px;`
    );
    setLogs((prev) => [...prev, { timestamp, level, message }]);
  };

  // Scroll to bottom of diagnostics logs automatically when new events are staged
  useEffect(() => {
    if (isExpanded && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  // Auto-expand logs terminal if an error occurs to capture diagnostic details
  useEffect(() => {
    if (errorMessage) {
      setIsExpanded(true);
    }
  }, [errorMessage]);

  // Real-time failure toast state
  interface PaymentFailureToast {
    id: string;
    message: string;
    instructions: string;
  }
  const [toast, setToast] = useState<PaymentFailureToast | null>(null);

  const triggerPaymentFailureToast = (msg: string, isNetworkError: boolean = false) => {
    const defaultInstructions = "Please check your internet connection, ensure your bank account permits online gateway transactions, or try using an alternative payment mode like UPI, Card, or Google Pay.";
    const networkInstructions = "A local or external network connection timeout occurred. Please check your WiFi or mobile network signal and reload the page to safely retry.";
    
    setToast({
      id: Math.random().toString(),
      message: msg,
      instructions: isNetworkError ? networkInstructions : defaultInstructions
    });
  };

  // Auto-dismiss failure toast after 10 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync chosen plan and prefill details when prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setLogs([
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          message: 'Secure checkout session started. Diagnostic Telemetry actively listening...'
        }
      ]);
      addLog('Ready to collect profile and sandbox registration coordinates.', 'info');
      
      if (selectedPlan) {
        const name = selectedPlan.name as 'Starter' | 'Professional' | 'Business';
        setActivePlanName(name);
        setActivePlanPrice(selectedPlan.price);
        setStep('profile'); // Reset to profile step when opening fresh plan selection
        addLog(`Synchronized chosen landing plan state: AppointO ${name} Package Selected.`, 'info');
      }
      if (prefillData) {
        setBusinessName(prefillData.business || '');
        setOwnerName(prefillData.name || '');
        setMobile(prefillData.phone || '');
        addLog(`Applying profile prefill parameters: Business: "${prefillData.business}", Owner: "${prefillData.name}"`, 'info');
      }
    }
  }, [selectedPlan, isOpen, prefillData]);

  // Dynamic script loader for Razorpay Checkout
  useEffect(() => {
    if (!isOpen) return;

    const loadScript = () => {
      addLog('Scanning client runtime environment for Razorpay checkout SDK...', 'info');
      if ((window as any).Razorpay) {
        setScriptLoaded(true);
        addLog('Razorpay Secure Checkout SDK found (already verified and cached).', 'success');
        return;
      }
      
      addLog('Razorpay Secure Checkout SDK not detected. Fetching checkout script from official secure Google/Razorpay CDN...', 'info');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        addLog('Razorpay Secure Checkout SDK successfully retrieved and compiled in sandbox runtime.', 'success');
        setScriptLoaded(true);
      };
      script.onerror = () => {
        addLog('CRITICAL EXCEPTION: Failed to load Razorpay checkout CDN. Request blockaded by system permissions or proxy policy.', 'error');
        setErrorMessage('Failed to load official Razorpay Payment SDK CDN.');
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, [isOpen]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Step 1: Submit Profile & Signup Info
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim() || !mobile.trim() || !email.trim()) {
      setErrorMessage('Please fill in all mandatory billing registration coordinates');
      addLog('Form submission rejected: Missing mandatory profile parameters.', 'warn');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Mobile registration number/WhatsApp number must be exactly 10 digits.');
      addLog('Form submission rejected: Mobile number must be exactly 10 digits.', 'warn');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);
    addLog(`Staging profile coordinates: Business: "${businessName}", Owner: "${ownerName}", Email: "${email}", Phone: "${mobile}"`, 'info');
    addLog('Dispatching POST /api/onboard-signup...', 'info');

    try {
      const res = await fetch('/api/onboard-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          owner_name: ownerName,
          mobile,
          email,
          city: city || 'Bhubaneswar',
          category
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to stage profile registers in database');
      }
      
      addLog('Profile registration staged on server memory successfully.', 'success');
      // Proceed to Step 2: Plan Select View
      setStep('plan_select');
    } catch (err: any) {
      const errMsg = err.message || 'Onboarding Registry Error';
      addLog(`Failed to stage profile registers in database: ${errMsg}`, 'error');
      setErrorMessage(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2 & 3: Selection of plans & Trial offer Confirmation
  const confirmPlanSelection = (name: 'Starter' | 'Professional' | 'Business', price: number) => {
    setActivePlanName(name);
    setActivePlanPrice(price);
    setStep('trial_offer');
    addLog(`Plan tier selection confirmed: AppointO ${name} Package Selected. Stage upgraded.`, 'info');
  };

  // Step 4: Pay ₹1 and create subscription starting 30 days from now
  const handleInitiateTrialOnboarding = async () => {
    setErrorMessage('');
    setIsProcessing(true);
    addLog(`Initiating transaction workflow: Requesting Razorpay transaction order creation for ${activePlanName} plan...`, 'info');
    addLog('Dispatching POST /api/create-subscription-order...', 'info');

    try {
      // 1. Order Creator Payload for Verification ₹1 Charge (100 Paise)
      const resOrder = await fetch('/api/create-subscription-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: activePlanName
        })
      });

      const orderData = await resOrder.json();
      if (!resOrder.ok || !orderData.success) {
        throw new Error(orderData.error || 'Unable to Handshake Order Node parameters');
      }

      const { order_id, amount, currency, is_simulated, key_id } = orderData;
      addLog(`Razorpay order created successfully. Dynamic Order ID: "${order_id}", Amount: ₹${amount / 100} ${currency}.`, 'success');

      // 2. Local Environment parameters for Razorpay (prioritizing backend-supplied dynamic key_id)
      const rzpKeyId = key_id || (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Svzvbb48FopJP7';
      addLog(`Initializing Razorpay secure checkout overlay. SDK Key ID utilized: "${rzpKeyId.substring(0, 10)}...". Prefill config set: ${ownerName} (${email})`, 'info');
      
      // Handle the validation callback handler in Express
      const handleBackendActivation = async (payId?: string, signature?: string, simulatedVal: boolean = false) => {
        addLog('Initiating SHA256 cryptographic signature verification alignment check...', 'info');
        addLog('Dispatching POST /api/verify-subscription-payment...', 'info');
        try {
          const verifyRes = await fetch('/api/verify-subscription-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: order_id,
              razorpay_payment_id: payId || `pay_sim_${Date.now()}`,
              razorpay_signature: signature || `sig_sim_${Date.now()}`,
              planName: activePlanName,
              userId: 'usr_logged_in',
              isSimulated: simulatedVal
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            addLog(`Cryptographic signature verified successfully! Customer ID "${verifyData.subscription.razorpay_customer_id}" saved. Subscription active!`, 'success');
            addLog('Onboarding confirmation email dispatched via Resend Broker successfully.', 'info');
            
            setSubscriptionDetails(verifyData.subscription);
            setStep('success');
            triggerConfetti();
            if (onSubscriptionActivated) {
              onSubscriptionActivated(verifyData.subscription);
            }
          } else {
            throw new Error(verifyData.error || 'Verification Signature alignment failure');
          }
        } catch (err: any) {
          const errMsg = err.message || 'Signature mismatch processing subscription';
          addLog(`Verification handshake rejected signature: ${errMsg}`, 'error');
          setErrorMessage(errMsg);
          triggerPaymentFailureToast(errMsg, false);
          setStep('trial_offer');
        } finally {
          setIsProcessing(false);
        }
      };

      // Verify Razorpay secure checkout SDK is fully loaded
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay Secure Checkout SDK is not fully loaded. Please verify your internet connection, disable any tracker blockers, and reload the page.');
      }

      // Configure official Razorpay Checkout parameters
      const options = {
        key: rzpKeyId,
        amount: amount,
        currency: currency,
        name: 'AppointO Systems',
        description: `₹1 Trial Verification Onboarding for ${activePlanName}`,
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=128&q=80',
        order_id: order_id,
        prefill: {
          name: ownerName,
          email: email,
          contact: mobile
        },
        theme: {
          color: '#2563EB'
        },
        handler: async (response: any) => {
          addLog(`Razorpay secure payment authorized! Payment ID: "${response.razorpay_payment_id}", Signature: "${response.razorpay_signature ? response.razorpay_signature.substring(0, 16) + '...' : 'none'}".`, 'success');
          await handleBackendActivation(response.razorpay_payment_id, response.razorpay_signature, false);
        },
        modal: {
          ondismiss: () => {
            addLog('Razorpay secure checkout popup closed or dismissed by user. Transaction flow aborted.', 'warn');
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (errPayload: any) => {
        addLog(`Razorpay Gateway Error: Transaction failed! description: "${errPayload.error.description}". Code: "${errPayload.error.code}". Reason: "${errPayload.error.reason}".`, 'error');
        const errMsg = errPayload.error.description || 'Onboarding transaction failed.';
        setErrorMessage(errMsg);
        triggerPaymentFailureToast(errMsg, false);
        setIsProcessing(false);
      });

      addLog('Launching Razorpay Checkout window... Please complete the ₹1 verification secure charge.', 'info');
      rzp.open();

    } catch (err: any) {
      const errMsg = err.message || 'Failed to launch subscription trial checkout';
      addLog(`Failed to initiate transaction workflow: ${errMsg}`, 'error');
      setErrorMessage(errMsg);
      const isNet = errMsg.toLowerCase().includes('network') || errMsg.toLowerCase().includes('fetch') || errMsg.toLowerCase().includes('failed to fetch');
      triggerPaymentFailureToast(errMsg, isNet);
      setIsProcessing(false);
    }
  };

  const resetAllAndClose = () => {
    setStep('profile');
    setBusinessName('');
    setOwnerName('');
    setMobile('');
    setEmail('');
    setCity('');
    setCategory('Clinic');
    setErrorMessage('');
    setIsProcessing(false);
    setSubscriptionDetails(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAllAndClose}
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          id="subscription-backdrop"
        />

        {/* Diagonal Light Accents */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2.5xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
          id="razorpay-subscription-modal"
        >
          {/* Progress Indicator */}
          <div className="flex h-1.5 w-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: 
                  step === 'profile' ? '20%' : 
                  step === 'plan_select' ? '45%' : 
                  step === 'trial_offer' ? '70%' : 
                  step === 'checkout' ? '90%' : '100%'
              }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-805 dark:bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                  Razorpay Subscriptions
                </span>
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider block">
                  {step === 'profile' ? 'Step 1: Sign Up / Profile' :
                   step === 'plan_select' ? 'Step 2: Confirm Pricing Tier' :
                   step === 'trial_offer' ? 'Step 3: Activate 30-Day Evaluation' :
                   step === 'success' ? 'Onboarding Active' : 'Processing Gateway'}
                </h3>
              </div>
            </div>
            <button
              onClick={resetAllAndClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              id="close-subscription-modal-btn"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="p-6">
            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 flex gap-2 text-rose-700 text-xs dark:bg-rose-950/25 dark:border-rose-900/30 dark:text-rose-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p className="leading-tight font-medium text-left">{errorMessage}</p>
              </div>
            )}

            {/* STEP 1: Profile Sign Up */}
            {step === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Business Sandbox Workspace Setup</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                    Configure your business coordinates. AppointO will setup your dedicated CRM scheduling instances and WhatsApp triggers.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Enterprise Name</label>
                    <div className="relative mt-1">
                      <Building className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Health Clinic"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Owner Name</label>
                      <div className="relative mt-1">
                        <User className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="e.g. Dr. Rajesh Mishra"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Business Category</label>
                      <div className="relative mt-1">
                        <Layers className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium appearance-none"
                        >
                          <option value="Clinic">Clinic</option>
                          <option value="Dental Clinic">Dental Clinic</option>
                          <option value="Salon">Salon</option>
                          <option value="Physiotherapy Center">Physiotherapy Center</option>
                          <option value="Car Wash Center">Car Wash Center</option>
                          <option value="Consultant">Consultant</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Mobile Number</label>
                      <div className="relative mt-1">
                        <Smartphone className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => {
                            const cleanVal = e.target.value.replace(/\D/g, '');
                            if (cleanVal.length <= 10) {
                              setMobile(cleanVal);
                            }
                          }}
                          placeholder="e.g. 9812450286"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                      <div className="relative mt-1">
                        <Mail className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. contact@dentclinic.in"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">City Location</label>
                    <div className="relative mt-1">
                      <MapPin className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bhubaneswar, Odisha"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-755 text-white font-extrabold py-3 text-xs tracking-wider uppercase rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer mt-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Processing Profile Setup</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Profile Coordinates</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Plan Selection */}
            {step === 'plan_select' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Verify Your Subscription Choice</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                    Confirm your tiered plan. You will be placed on an exclusive 30-Day Free Trial before monthly charges resume.
                  </p>
                </div>

                <div className="grid gap-3.5">
                  {[
                    { name: 'Starter' as const, price: 499, desc: 'For independent clinics. Single doctor license.' },
                    { name: 'Professional' as const, price: 999, desc: 'For standard setups. Includes AI modules and CRM tools.' },
                    { name: 'Business' as const, price: 1999, desc: 'For multi-branch medical structures. Deep insights.' }
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => confirmPlanSelection(p.name, p.price)}
                      className={`w-full hover:border-blue-400 relative flex items-center justify-between p-4 rounded-xl border transition text-left cursor-pointer ${
                        activePlanName === p.name
                          ? 'border-blue-500 bg-blue-50/10 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-transparent'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{p.name} Package</span>
                          {p.name === 'Professional' && (
                            <span className="rounded-full bg-blue-600 text-white px-2 py-0.5 text-[8px] font-black tracking-widest uppercase">Popular</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">{p.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900 dark:text-white">₹{p.price}</span>
                        <span className="text-[9px] text-slate-400 block font-bold">/month</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('profile')}
                  className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 block transition mt-2"
                >
                  &larr; Back to Step 1: Profile Signup
                </button>
              </div>
            )}

            {/* STEP 3 & 4: Trial Offer Overview */}
            {step === 'trial_offer' && (
              <div className="space-y-4">
                {/* Visual Graphic badge */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/20 p-5 text-center space-y-3">
                  <div className="mx-auto rounded-full bg-blue-600 p-2.5 text-white w-10 h-10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Start Your 30-Day Trial Today</h4>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold dark:text-slate-300">
                      Pay only <strong className="text-blue-600 dark:text-blue-400">₹1 now</strong>. Your selected plan will start automatically after 30 days.
                    </p>
                  </div>
                </div>

                {/* Grid details */}
                <div className="rounded-xl border border-slate-150 p-4 space-y-2 dark:border-slate-800">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Checkout Summary</span>
                  <div className="space-y-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Staged Service Plan</span>
                      <strong className="text-slate-800 dark:text-white">AppointO {activePlanName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Post-Trial Pricing</span>
                      <strong className="text-slate-800 dark:text-white">₹{activePlanPrice}/month</strong>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400">
                      <span>Amount Due Today</span>
                      <strong className="text-lg font-black text-blue-600 dark:text-cyan-400">₹1.00</strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-3 text-[9.5px] text-slate-500 leading-normal flex items-start gap-1.5 dark:text-slate-450">
                  <ShieldCheck className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    This secure ₹1 charge validates genuine local entities, activates your trial instantly, and mitigates robot spams. Under Razorpay sandbox test rules, no actual credit lines are collected.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInitiateTrialOnboarding}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold py-3.5 text-xs tracking-wider uppercase rounded-xl transition shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Opening Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Onboarding Fee (₹1 Charge)</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep('plan_select')}
                  className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 block transition"
                >
                  &larr; Choose a Different Plan Tiers
                </button>
              </div>
            )}

            {/* SUCCESS VIEW */}
            {step === 'success' && subscriptionDetails && (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto rounded-full bg-emerald-100 p-3.5 text-emerald-600 w-14 h-14 flex items-center justify-center animate-bounce dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">Trial Successfully Active!</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-relaxed">
                    We verified your ₹1 payment securely. Your 30-Day AppointO trial workspace is now active.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-500/5 p-4 text-left space-y-1.5 dark:border-emerald-950/50 dark:bg-emerald-950/20">
                  <span className="text-[8px] font-black tracking-widest text-[#22C55E] uppercase block">Subscription Ledger</span>
                  <div className="grid grid-cols-3 gap-y-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Plan Choose:</span>
                    <span className="col-span-2 text-slate-800 dark:text-white font-bold">{subscriptionDetails.plan_name} (Free Trial)</span>
                    
                    <span>Subscription ID:</span>
                    <span className="col-span-2 font-mono text-slate-700 dark:text-slate-300 break-all">{subscriptionDetails.razorpay_subscription_id}</span>
                    
                    <span>Customer Ref:</span>
                    <span className="col-span-2 font-mono text-slate-700 dark:text-slate-300 break-all">{subscriptionDetails.razorpay_customer_id}</span>
                    
                    <span>Trial Ending:</span>
                    <span className="col-span-2 text-slate-800 dark:text-white font-bold">
                      {new Date(subscriptionDetails.trial_end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/5 text-[#2563EB] rounded-xl text-[10px] leading-relaxed font-bold dark:bg-blue-950/20 dark:text-cyan-400">
                  ⚡ Check your Email inbox! An onboarding manual and confirmation invoice have been dispatched. Standard SaaS services are fully unlocked.
                </div>

                <button
                  onClick={resetAllAndClose}
                  className="w-full rounded-xl bg-slate-900 text-white font-extrabold py-3 text-xs tracking-wider transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 uppercase cursor-pointer"
                >
                  Enter Subscription Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Telemetry Diagnostic Console */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-950 text-slate-200">
            {/* Header / Toggle button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-900 transition text-[10.5px] font-mono select-none border-b border-slate-900"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                <span className="font-extrabold uppercase tracking-wider text-slate-300">Live Transaction Diagnostics</span>
                <span className="bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Live Logs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-slate-450 font-bold">
                  {logs.length} event{logs.length !== 1 ? 's' : ''}
                </span>
                <span className="text-slate-400 font-mono text-[9px]">{isExpanded ? '▼' : '▲'}</span>
              </div>
            </button>
            
            {/* Body */}
            {isExpanded && (
              <div className="px-6 pb-4 pt-1.5 max-h-40 overflow-y-auto font-mono text-[9px] space-y-1.5 bg-slate-950/95 scrollbar-thin divide-y divide-slate-900">
                {logs.map((log, idx) => (
                  <div key={idx} className="pt-1.5 leading-relaxed text-left flex gap-1.5 items-start">
                    <span className="text-slate-500 font-bold shrink-0">[{log.timestamp}]</span>
                    <span className={`font-black uppercase shrink-0 text-[7.5px] tracking-wider px-1 rounded ${
                      log.level === 'info' ? 'bg-blue-950 text-blue-400' :
                      log.level === 'success' ? 'bg-emerald-950 text-emerald-450' :
                      log.level === 'warn' ? 'bg-amber-950 text-amber-450' :
                      'bg-rose-950 text-rose-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-slate-300 select-all">{log.message}</span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Real-time floating payment failure notification toast / banner overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`fixed top-5 right-5 z-[200] w-full max-w-sm overflow-hidden rounded-2xl border bg-white dark:bg-slate-950 p-4 shadow-2.5xl ${
              darkMode ? 'border-rose-500/30' : 'border-rose-200 shadow-rose-100/10'
            }`}
            id="payment-failure-notification-toast"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-rose-500 p-1.5 text-white shrink-0 shadow-md animate-pulse">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase text-rose-500 tracking-wider">
                    Transaction Alert
                  </h4>
                  <span className="text-[9px] font-bold text-slate-400">
                    Auto-dismisses in 10s
                  </span>
                </div>
                <p className="text-[11.5px] font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                  {toast.message}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-900">
                  <span className="text-[9px] font-bold uppercase text-slate-450 dark:text-slate-500 tracking-widest block mb-1">
                    How to solve/retry:
                  </span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                    {toast.instructions}
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setToast(null);
                      handleInitiateTrialOnboarding();
                    }}
                    className="flex-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-center text-[10px] font-extrabold text-white transition hover:bg-blue-700 hover:shadow-md cursor-pointer"
                  >
                    Retry Standard Payment Now
                  </button>
                  <button
                    onClick={() => setToast(null)}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-center text-[10px] font-extrabold text-slate-500 hover:text-slate-800 dark:hover:text-slate-205 transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 rounded p-0.5"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            {/* Countdown bar indicator */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 10, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-rose-500 to-orange-400"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
