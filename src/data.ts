import { Industry, Testimonial, FAQ, Appointment } from './types';

export const INDUSTRIES: Industry[] = [
  {
    id: 'clinics',
    name: 'Clinics',
    emoji: '🏥',
    iconName: 'Activity',
    description: 'Manage doctor queues, walk-ins, and send automated follow-up prescriptions or check-ups.',
    services: ['General Consultation', 'Vaccination', 'Chronic Care Follow-up', 'Diagnostic Referral'],
    staff: ['Dr. Alok Sharma', 'Dr. Priya Patel'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'dental',
    name: 'Dental Clinics',
    emoji: '🦷',
    iconName: 'Sparkles',
    description: 'Interactive dental charts, automatic multi-month dental check-up notifications, and reminder loops.',
    services: ['Teeth Cleaning & Scaling', 'Root Canal Therapy', 'Dental Implant Consult', 'Cavity Filling'],
    staff: ['Dr. Rohan Gupta', 'Dr. Simran Kaur'],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'salons',
    name: 'Salons',
    emoji: '💇',
    iconName: 'Scissors',
    description: 'Maximize chair utilization, dynamic pricing, and automatic reminders via AppointO WhatsApp API.',
    services: ['Haircut & Styling', 'Hydrating Facial', 'Bridal Makeup', 'Premium Hair Spa'],
    staff: ['Sanjay Kumar', 'Meera Sen'],
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'carwash',
    name: 'Car Wash Centers',
    emoji: '🚗',
    iconName: 'Car',
    description: 'Track bay capacity, avoid vehicle congestion, and notify customers automatically on wash completion.',
    services: ['Express Exterior Wash', 'Full Interior Deep Clean', 'Premium Ceramic Coating', 'Tire Shine & Wax'],
    staff: ['Rahul Singh', 'Vikram Rathore'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'physio',
    name: 'Physiotherapy Centers',
    emoji: '🩺',
    iconName: 'HeartPulse',
    description: 'Plan repetitive therapy schedules, track recovery milestones, and allow easy self-rescheduling.',
    services: ['Post-Injury Rehab Session', 'Deep Tissue Massotherapy', 'Spine & Posture Aligner', 'Joint Mobilization Clinic'],
    staff: ['Dr. Amit Verma (PT)', 'Dr. Tanya Mehta (PT)'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'consultants',
    name: 'Consultants',
    emoji: '👨‍💼',
    iconName: 'Briefcase',
    description: 'Share custom booking links, collect prepayments online, and auto-dispatch video meet coordinates.',
    services: ['Business Strategy Advisory', 'Tax & GST Consulting', 'IT Security & Cloud Audit', 'Brand Growth Session'],
    staff: ['Rakesh Jain', 'Anjali Rao'],
    color: 'from-purple-500 to-violet-600'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. Sandeep Kulkarni',
    role: 'Founder & Senior Dentist',
    business: 'Kulkarni Dental Clinic, Nagpur',
    text: 'AppointO reduced our patient no-shows by 85%! The automated WhatsApp reminders in Hindi and Marathi have changed our dental practice completely. Patients love the instant confirmations.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't2',
    name: 'Neha Sharma',
    role: 'Salon Owner',
    business: 'Glitz & Glamour Salon, Indore',
    text: 'Managing 12 stylists in premium wedding seasons used to be absolute chaos. Now AppointO schedules staff tasks and handles online booking deposits elegantly. It costs almost nothing compared to the growth we experienced!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't3',
    name: 'Vikramjit Roy',
    role: 'Operational Lead',
    business: 'Elite Car Spa, Patna',
    text: 'Our bays used to stay completely stacked on Sundays with huge queues, and completely empty on Tuesdays. Now, AppointO’s automated AI incentives bring customers to book off-peak slots.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't4',
    name: 'Dr. Meenakshi Iyer',
    role: 'Managing Director',
    business: 'CareFirst Physiotherapy, Madurai',
    text: 'Rehabilitation plans require weekly bookings. AppointO books a patient down for a 6-week recurring slot with one tap! The system is highly recommended for medical services in tier 2 cities.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq1',
    question: 'How does the ₹1 30-day trial work?',
    answer: 'You can sign up with AppointO in just 2 minutes by paying ₹1. This gives you full, unrestricted access to the entire platform—including WhatsApp automation, online payments, staff scheduling, and dashboards—for 30 days! After 30 days, choose any of our affordable plans starting at ₹499/month, or cancel anytime.'
  },
  {
    id: 'faq2',
    question: 'How do automated WhatsApp bookings and reminders work?',
    answer: 'AppointO integrates directly with official WhatsApp Cloud APIs. When a booking is simulated, created, or scheduled, our system automatically triggers a WhatsApp message containing confirmation links, directions, and prepayment links. Customers can respond to reschedule, confirm, or cancel directly from WhatsApp, and your dashboard updates in real-time!'
  },
  {
    id: 'faq3',
    question: 'Do we get free setup assistance and training?',
    answer: 'Absolutely! For every business owner in Tier 1, Tier 2, and Tier 3 cities, we assign a dedicated AppointO Success Executive. We do the full configurations, enter your services and staff data, install any custom QR codes at your shop, and train your staff in Hindi, English, or your local regional language—completely free of cost.'
  },
  {
    id: 'faq4',
    question: 'Can I accept pre-payments from customers?',
    answer: 'Yes! AppointO integrates directly with popular Indian payment gateways like UPI (GPay, PhonePe, Paytm), credit/debit cards, and NetBanking. You can choose to collect full prepayments, partial tokens, or salon seat reservation fees to ensure secure queues and zero no-shows.'
  },
  {
    id: 'faq5',
    question: 'Is my business patient/customer data safe with you?',
    answer: 'Data privacy is our absolute priority. We use secure cloud databases with multi-layer encryption. We never share customer phone numbers with external marketing agencies and comply with all security standards, keeping your patient details, appointment files, and financial summaries completely protected.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    customerName: 'Rajesh Malhotra',
    service: 'Root Canal Therapy',
    time: '11:00 AM',
    date: 'Today',
    status: 'confirmed',
    whatsappSent: true,
    phone: '+91 98765 43210',
    industry: 'dental',
    staffName: 'Dr. Rohan Gupta'
  },
  {
    id: 'app-2',
    customerName: 'Priya Deshmukh',
    service: 'Hydrating Facial',
    time: '12:30 PM',
    date: 'Today',
    status: 'pending',
    whatsappSent: true,
    phone: '+91 87654 32109',
    industry: 'salons',
    staffName: 'Meera Sen'
  },
  {
    id: 'app-3',
    customerName: 'Karan Mehra',
    service: 'Express Exterior Wash',
    time: '02:00 PM',
    date: 'Today',
    status: 'confirmed',
    whatsappSent: false,
    phone: '+91 76543 21098',
    industry: 'carwash',
    staffName: 'Rahul Singh'
  },
  {
    id: 'app-4',
    customerName: 'Sunita Krishnan',
    service: 'Post-Injury Rehab Session',
    time: '04:15 PM',
    date: 'Today',
    status: 'confirmed',
    whatsappSent: true,
    phone: '+91 91234 56789',
    industry: 'physio',
    staffName: 'Dr. Amit Verma (PT)'
  },
  {
    id: 'app-5',
    customerName: 'Vijay Khandelwal',
    service: 'Tax & GST Consulting',
    time: '05:30 PM',
    date: 'Today',
    status: 'completed',
    whatsappSent: true,
    phone: '+91 93456 78901',
    industry: 'consultants',
    staffName: 'Rakesh Jain'
  }
];
