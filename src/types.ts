export interface Appointment {
  id: string;
  customerName: string;
  service: string;
  time: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  whatsappSent: boolean;
  phone: string;
  industry: string;
  staffName?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Industry {
  id: string;
  name: string;
  emoji: string;
  iconName: string; // Used to reference lucide icons dynamically
  description: string;
  services: string[];
  staff: string[];
  color: string;
}
