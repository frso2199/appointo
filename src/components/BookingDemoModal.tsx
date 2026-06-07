import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, Mail, Building, Check, Sparkles, MessageSquare } from 'lucide-react';
import { INDUSTRIES } from '../data';
import { Appointment } from '../types';

interface BookingDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (newBooking: Appointment) => void;
  defaultIndustryId?: string;
}

export default function BookingDemoModal({
  isOpen,
  onClose,
  onBookingSuccess,
  defaultIndustryId = 'clinics'
}: BookingDemoModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedIndustry, setSelectedIndustry] = useState(
    INDUSTRIES.find(i => i.id === defaultIndustryId) || INDUSTRIES[0]
  );
  const [selectedService, setSelectedService] = useState(selectedIndustry.services[0]);
  const [selectedStaff, setSelectedStaff] = useState(selectedIndustry.staff[0]);
  const [selectedDate, setSelectedDate] = useState('2026-06-01');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  
  // Form fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  
  // Simulation completed animation screen
  const [isSimulatingNotification, setIsSimulatingNotification] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'sending' | 'whatsapp_received' | 'done'>('sending');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleIndustryChange = (industryId: string) => {
    const ind = INDUSTRIES.find(i => i.id === industryId);
    if (ind) {
      setSelectedIndustry(ind);
      setSelectedService(ind.services[0]);
      setSelectedStaff(ind.staff[0]);
    }
  };

  const validateStep2 = () => {
    return name.trim().length > 2 && mobile.trim().length >= 10;
  };

  const handleTriggerBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    // Transition to simulated screen
    setIsSimulatingNotification(true);
    setSimulationStep('sending');

    // Simulate flow
    setTimeout(() => {
      setSimulationStep('whatsapp_received');
    }, 1500);

    setTimeout(() => {
      setSimulationStep('done');
      
      // Inject the newly scheduled booking into the global dashboard state
      const simulatedBooking: Appointment = {
        id: `custom-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        customerName: name,
        service: selectedService,
        time: selectedTime,
        date: 'Today',
        status: 'confirmed',
        whatsappSent: true,
        phone: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
        industry: selectedIndustry.id,
        staffName: selectedStaff
      };
      
      onBookingSuccess(simulatedBooking);
    }, 3500);
  };

  const resetForm = () => {
    setStep(1);
    setName('');
    setMobile('');
    setEmail('');
    setIsSimulatingNotification(false);
  };

  const handleCloseAll = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAll}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            id="modal-backdrop"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            id="booking-demo-modal"
          >
            {/* Simulation overlay screen */}
            {isSimulatingNotification && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 p-6 text-center text-white">
                {simulationStep === 'sending' && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-6 rounded-full bg-blue-500/20 p-6">
                      <Sparkles className="h-12 w-12 text-blue-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400 animate-spin" style={{ animationDuration: '6s' }}></div>
                    </div>
                    <h3 className="text-xl font-bold font-sans">AppointO AI is Processing Request...</h3>
                    <p className="mt-2 text-sm text-slate-400">Locking in slot, updating staff calendars & formatting WhatsApp triggers</p>
                  </motion.div>
                )}

                {simulationStep === 'whatsapp_received' && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center max-w-md"
                  >
                    <div className="mb-6 rounded-full bg-green-500/20 p-6">
                      <MessageSquare className="h-12 w-12 text-green-400 animate-bounce" />
                    </div>
                    <span className="mb-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-green-400 border border-green-500/20 uppercase">
                      Official API Sent
                    </span>
                    <h3 className="text-2xl font-extrabold font-sans text-green-400">WhatsApp Alert Dispatched!</h3>
                    
                    {/* Simulated phone mockup */}
                    <div className="mt-6 w-full rounded-2xl border border-emerald-800 bg-emerald-950/80 p-4 text-left shadow-lg">
                      <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2 mb-3">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-xs font-bold font-mono tracking-wider text-green-400">APPOINTO AI AGENT</span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-slate-100">
                        💬 <strong className="text-green-300">WhatsApp Text to {name}:</strong><br/>
                        &quot;Hi <span className="text-blue-300 font-bold">{name}</span>! Your booking for <span className="text-blue-300 font-bold">{selectedService}</span> with <span className="text-blue-300 font-bold">{selectedStaff}</span> on <span className="text-yellow-300 font-bold">today ({selectedTime})</span> is CONFIRMED.<br/><br/>
                        🤖 AppointO AI virtual assistant is here to manage. Click below to prepay via UPI or reschedule.&quot;
                      </p>
                    </div>

                    <p className="mt-4 text-sm text-slate-400">Demonstrating real-time client sync...</p>
                  </motion.div>
                )}

                {simulationStep === 'done' && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center max-w-md"
                  >
                    <div className="mb-6 rounded-full bg-green-500 p-4 text-white">
                      <Check className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-extrabold font-sans">Booking Added to Live Dashboard!</h3>
                    <p className="mt-2 text-slate-300">
                      The mock dashboard has updated in real-time. Look out for the newly confirmed row for <strong className="text-white">{name}</strong> on the interactive screen.
                    </p>
                    <button
                      onClick={handleCloseAll}
                      className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-blue-700 hover:shadow-blue-500/20"
                      id="close-simulation-btn"
                    >
                      View Live Dashboard App
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-sans text-slate-900 dark:text-white">
                    AppointO Scheduling Simulator
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Test drive how easy it is for customers to book in 24/7.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseAll}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                id="close-booking-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex border-b border-slate-100 px-4 sm:px-6 py-2.5 dark:border-slate-800 dark:bg-slate-900/10">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
                <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                <span className={`${step >= 1 ? 'text-slate-900 dark:text-slate-200 font-bold' : 'text-slate-300'}`}>Selection</span>
                <span className="text-slate-300">/</span>
                <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                <span className={`${step >= 2 ? 'text-slate-900 dark:text-slate-200 font-bold' : 'text-slate-400'}`}>Customer Details</span>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
              {step === 1 ? (
                <div className="space-y-6">
                  {/* Select Industry */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 1: Choose Business Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {INDUSTRIES.map(ind => (
                        <button
                          key={ind.id}
                          type="button"
                          onClick={() => handleIndustryChange(ind.id)}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-left transition duration-150 ${
                            selectedIndustry.id === ind.id
                              ? 'border-blue-500 bg-blue-50/50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-slate-700'
                          }`}
                          id={`industry-select-${ind.id}`}
                        >
                          <span className="text-xl">{ind.emoji}</span>
                          <span className="text-xs font-semibold leading-tight">{ind.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Services and Staff */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Step 2: Pick Service
                      </label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        id="service-select"
                      >
                        {selectedIndustry.services.map((srv, idx) => (
                          <option key={idx} value={srv}>{srv}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Step 3: Choose Specialist
                      </label>
                      <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        id="staff-select"
                      >
                        {selectedIndustry.staff.map((st, idx) => (
                          <option key={idx} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pick Time Slots */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 4: Select Preferred Time
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 animate-fadeIn">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-lg py-2.5 text-xs font-semibold transition duration-150 ${
                            selectedTime === time
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                          id={`time-slot-${time.replace(' ', '-').replace(':', '')}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700"
                      id="next-step-btn"
                    >
                      Configure Patient Details &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTriggerBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Primary Client / Patient Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anand Deshmukh"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        id="demounit-fullname"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        WhatsApp Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <Phone className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="e.g. 9876543210 (For WhatsApp Alert)"
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                          id="demounit-mobile"
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400 leading-normal">
                        Enter a valid mobile to simulate the AppointO cloud-triggered WhatsApp script instantly.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Email Address (Optional)
                      </label>
                      <div className="relative mt-1">
                        <Mail className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="anand@gmail.com"
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                          id="demounit-email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Overview Card */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
                      Simulating Booking for:
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        Type: <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedIndustry.emoji} {selectedIndustry.name}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                        Service: <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedService}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Specialist: <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedStaff}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Time slot: <span className="font-semibold text-yellow-600 dark:text-yellow-405">Today at {selectedTime}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Submission Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-850 dark:hover:text-white"
                      id="prev-step-btn"
                    >
                      &larr; Back to configuration
                    </button>
                    <button
                      type="submit"
                      disabled={!validateStep2()}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-200 ${
                        validateStep2()
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10 hover:shadow-emerald-500/20'
                          : 'bg-slate-300 cursor-not-allowed dark:bg-slate-800'
                      }`}
                      id="launch-booking-btn"
                    >
                      <Sparkles className="h-4 w-4" />
                      Book Spot & Send WhatsApp AI
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
