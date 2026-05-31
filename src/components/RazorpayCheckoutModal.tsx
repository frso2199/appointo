import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, 
  HelpCircle, Smartphone, Calendar, User, Mail, ArrowRight, Loader2 
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
}

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  darkMode
}: RazorpayCheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Script loaded indicator
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout status flags
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'creating_order' | 'modal_open' | 'verifying' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
    signature: string;
  } | null>(null);

  // Dynamic script loader for Razorpay Checkout
  useEffect(() => {
    if (!isOpen) return;

    const loadScript = () => {
      if ((window as any).Razorpay) {
        setScriptLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('[Razorpay Checkout] Script loaded successfully.');
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('[Razorpay Checkout] Failed to script load gateway CDN.');
        setErrorMessage('Failed to load official Razorpay Payment SDK from CDN.');
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, [isOpen]);

  const triggerConfetti = () => {
    // 1. Initial robust burst of confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // 2. Continuous showers from both edges for 2.5 seconds
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.85 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.85 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Please provide your full name and registered phone coordinate');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setCheckoutStatus('creating_order');

    try {
      // 1. Convert amount to paise nodes (1 INR = 100 Paise)
      const amountInPaise = Math.round(selectedPlan.price * 100);
      
      console.log(`[Checkout GUI] Dispatching order setup for ${amountInPaise} paise...`);
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          receipt: `appointo_res_${Date.now()}`
        })
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to instantiate order sequence with backend.');
      }

      const { order_id, amount, currency } = orderData;
      console.log('[Checkout GUI] Secured order transaction code:', order_id);

      // 2. Build local environment parameters for Razorpay
      const keyId = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Svzvbb48FopJP7';
      
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'AppointO Systems',
        description: `Activation of ${selectedPlan.name} Booking Pack`,
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=128&q=80',
        order_id: order_id,
        prefill: {
          name: name,
          email: email || 'success@appointo.online',
          contact: phone
        },
        theme: {
          color: '#2563EB'
        },
        // Handles standard successful validation payloads
        handler: async (response: any) => {
          console.log('[Checkout GUI] Received payment transaction signature payload:', response);
          setCheckoutStatus('verifying');
          
          try {
            // 3. Dispatch validation payload to our backend verify endpoint
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setPaymentDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              });
              setCheckoutStatus('success');
              triggerConfetti();
            } else {
              throw new Error(verifyData.error || 'HMAC-SHA256 signature alignment mismatch');
            }
          } catch (err: any) {
            console.error('[Checkout GUI] Verification fail:', err);
            setErrorMessage(err.message || 'Signature mismatch: payment suspicious or voided.');
            setCheckoutStatus('failed');
          }
        },
        modal: {
          ondismiss: () => {
            console.log('[Checkout GUI] User dismissed payment modal.');
            setIsProcessing(false);
            setCheckoutStatus('idle');
          }
        }
      };

      // 4. Fire the Razorpay Checkout Modal
      setCheckoutStatus('modal_open');
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        console.error('[Checkout GUI] Razorpay transaction failed events:', resp.error);
        setErrorMessage(resp.error.description || 'Payment transaction aborted or declined by bank.');
        setCheckoutStatus('failed');
        setIsProcessing(false);
      });

      rzp.open();

    } catch (error: any) {
      console.error('[Checkout GUI] Processing error:', error);
      setErrorMessage(error.message || 'Payment initiation failed.');
      setCheckoutStatus('failed');
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setName('');
    setPhone('');
    setEmail('');
    setErrorMessage('');
    setCheckoutStatus('idle');
    setIsProcessing(false);
    setPaymentDetails(null);
  };

  const handleCloseAll = () => {
    resetState();
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
          onClick={handleCloseAll}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          id="billing-backdrop"
        />

        {/* Modal body card layout */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-150 dark:border-slate-800"
          id="razorpay-checkout-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
                  Secure Razorpay Payment Gateway
                </h3>
                <p className="text-[10px] text-slate-400">Standard Web Checkout Integrated</p>
              </div>
            </div>
            <button
              onClick={handleCloseAll}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-755 dark:hover:bg-slate-800"
              id="close-billing-button"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="p-6">
            {checkoutStatus === 'success' && paymentDetails ? (
              /* Success screen state */
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto rounded-full bg-emerald-100 p-3 text-emerald-600 w-14 h-14 flex items-center justify-center animate-bounce dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">Transaction Verified Success!</h4>
                  <p className="text-xs text-slate-500 mt-1">We checked the SHA256 signature match securely on our server node.</p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-500/5 p-4 text-left space-y-2 dark:border-emerald-950/50 dark:bg-emerald-950/20">
                  <span className="text-[9px] font-black tracking-widest text-[#22C55E] uppercase block">payment meta details</span>
                  <div className="grid grid-cols-3 gap-y-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Plan Chosen:</span>
                    <span className="col-span-2 font-bold text-slate-800 dark:text-white">{selectedPlan?.name} (₹{selectedPlan?.price})</span>
                    
                    <span className="font-semibold">Razorpay Order:</span>
                    <span className="col-span-2 font-mono text-slate-700 dark:text-slate-350">{paymentDetails.orderId}</span>
                    
                    <span className="font-semibold">Payment Token:</span>
                    <span className="col-span-2 font-mono text-slate-700 dark:text-slate-350">{paymentDetails.paymentId}</span>

                    <span className="font-semibold">Verification SHA:</span>
                    <span className="col-span-2 font-mono text-[9px] truncate text-slate-400">{paymentDetails.signature}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/5 text-[#2563EB] rounded-xl text-xs font-semibold dark:bg-blue-950/20 dark:text-cyan-400">
                  Your services are now active. Standard database registers updated.
                </div>

                <button
                  onClick={handleCloseAll}
                  className="w-full rounded-xl bg-slate-900 text-white font-bold py-2.5 text-xs tracking-wider transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                >
                  Return to Dashboard App
                </button>
              </div>
            ) : (
              /* Standard configuration display and form states */
              <div className="space-y-5">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex gap-2 text-rose-700 text-xs dark:bg-rose-950/25 dark:border-rose-900/30 dark:text-rose-400">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <p className="leading-tight font-medium">{errorMessage}</p>
                  </div>
                )}

                {/* Selected Plan Summary Label */}
                {selectedPlan && (
                  <div className="flex justify-between items-center rounded-xl bg-[#2563EB]/5 border border-blue-100 p-4 dark:bg-blue-950/20 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black tracking-widest text-blue-600 dark:text-cyan-400 uppercase">Selected Subscription</span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{selectedPlan.name} Plan</h4>
                      <p className="text-[10px] text-slate-400">{selectedPlan.billingCycle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900 dark:text-white">₹{selectedPlan.price}</span>
                      <span className="text-[10px] text-slate-400 block font-bold">Inclusive GST</span>
                    </div>
                  </div>
                )}

                {checkoutStatus === 'creating_order' ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
                    <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Creating Razorpay Order Node...</p>
                    <p className="text-[10px] text-slate-405">Handshaking with API endpoint at /api/create-order...</p>
                  </div>
                ) : checkoutStatus === 'modal_open' ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
                    <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Checkout Modal Active</p>
                    <p className="text-[10px] text-slate-405">Please verify and approve mock payment credentials in the overlay.</p>
                  </div>
                ) : checkoutStatus === 'verifying' ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mx-auto" />
                    <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Verifying SHA256 HMAC Signature...</p>
                    <p className="text-[10px] text-slate-405">Calling backend validation endpoint secure parameters...</p>
                  </div>
                ) : (
                  <form onSubmit={handlePayNow} className="space-y-3.5">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Fill Up billing info</span>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase">Your Billing Name</label>
                      <div className="relative mt-1">
                        <User className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Dr. Anand Deshmukh"
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase">Contact Mobile</label>
                        <div className="relative mt-1">
                          <Smartphone className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 9812450286"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase">Billing Email</label>
                        <div className="relative mt-1">
                          <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. support@doctor.in"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-xs outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-3 text-[10px] text-slate-500 leading-normal flex items-start gap-1.5 dark:text-slate-400">
                      <ShieldCheck className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-700 dark:text-white">Razorpay Standard Test mode</strong>: Feel free to complete payments by triggering success mock workflows. Use test credentials provided inside Razorpay iframe overlay.
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || !scriptLoaded}
                      className="w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold py-3 text-xs tracking-wider uppercase rounded-xl transition shadow-md shadow-blue-500/15"
                    >
                      <span>Proceed to Razorpay Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
