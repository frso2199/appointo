import fs from 'fs';
import path from 'path';

export interface LocalSubscription {
  id: string;               // Local database / razorpay subscription ID
  user_id: string;
  razorpay_customer_id: string;
  razorpay_subscription_id: string;
  razorpay_plan_id: string;
  plan_name: 'Starter' | 'Professional' | 'Business';
  trial_start_date: string; // ISO string
  trial_end_date: string;   // ISO string
  next_billing_date: string;// ISO string
  status: 'TRIAL' | 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'PAYMENT_FAILED' | 'PENDING';
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  subscription_end_date?: string;
  upgrades_history?: Array<{
    from_plan: string;
    to_plan: string;
    date: string;
    type: 'immediate' | 'prorated' | 'next_cycle';
  }>;
}

export interface LocalPayment {
  id: string;
  user_id: string;
  subscription_id: string;
  razorpay_payment_id: string;
  amount: number;       // in INR (not paise) for easier tracking
  currency: 'INR';
  payment_type: 'TRIAL' | 'SUBSCRIPTION' | 'RENEWAL' | 'UPGRADE';
  status: 'captured' | 'failed' | 'refunded';
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  business_name: string;
  owner_name: string;
  mobile: string;
  email: string;
  city: string;
  category: string;
  created_at: string;
}

export interface Lead {
  id: string;
  business_name: string;
  owner_name: string;
  mobile: string;
  email: string;
  city: string;
  category: string;
  status: 'new' | 'contacted' | 'demo_scheduled' | 'converted' | 'lost';
  follow_ups: Array<{
    id: string;
    date: string;
    notes: string;
    agent: string;
  }>;
  created_at: string;
  updated_at: string;
  notes?: string;
  plan_interested?: string;
}

export interface DatabaseSchema {
  users: UserProfile[];
  subscriptions: LocalSubscription[];
  payments: LocalPayment[];
  leads: Lead[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

// Helper to write default high-fidelity data so the workspace looks populated immediately
const getInitialDatabase = (): DatabaseSchema => {
  const now = new Date();
  
  // Date calculations to simulate historical subscriptions
  const dateDaysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  const dateDaysAhead = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const users: UserProfile[] = [
    {
      user_id: 'usr_1',
      business_name: 'Apex Orthopedic Clinic',
      owner_name: 'Dr. Ramesh Kumar',
      mobile: '9876543210',
      email: 'ramesh@apexortho.in',
      city: 'Bhubaneswar',
      category: 'Clinic',
      created_at: dateDaysAgo(45)
    },
    {
      user_id: 'usr_2',
      business_name: 'Vibrant Hair & Beauty Salon',
      owner_name: 'Meera Sen',
      mobile: '8123456789',
      email: 'meera@vibrantsalon.com',
      city: 'Pune',
      category: 'Salon',
      created_at: dateDaysAgo(25)
    },
    {
      user_id: 'usr_3',
      business_name: 'Bhubaneswar Physiotherapy Center',
      owner_name: 'Dr. Priya Das',
      mobile: '9102485901',
      email: 'priya@physiocenter.in',
      city: 'Bhubaneswar',
      category: 'Physiotherapy Center',
      created_at: dateDaysAgo(15)
    },
    {
      user_id: 'usr_4',
      business_name: 'Sparkle Express Car Wash',
      owner_name: 'Samir Sahu',
      mobile: '7102948574',
      email: 'samir@sparklewash.co.in',
      city: 'Cuttack',
      category: 'Car Wash Center',
      created_at: dateDaysAgo(5)
    }
  ];

  const subscriptions: LocalSubscription[] = [
    {
      id: 'sub_live_apex_4455',
      user_id: 'usr_1',
      razorpay_customer_id: 'cust_apex_1100',
      razorpay_subscription_id: 'sub_rp_apex_9922',
      razorpay_plan_id: 'plan_rp_starter_1',
      plan_name: 'Starter',
      trial_start_date: dateDaysAgo(45),
      trial_end_date: dateDaysAgo(15),
      next_billing_date: dateDaysAhead(15),
      status: 'ACTIVE', // Trial holds for 30 days, then successfully active
      created_at: dateDaysAgo(45),
      updated_at: dateDaysAgo(15)
    },
    {
      id: 'sub_live_vibrant_8822',
      user_id: 'usr_2',
      razorpay_customer_id: 'cust_vibrant_2211',
      razorpay_subscription_id: 'sub_rp_vibrant_4499',
      razorpay_plan_id: 'plan_rp_professional_2',
      plan_name: 'Professional',
      trial_start_date: dateDaysAgo(25),
      trial_end_date: dateDaysAhead(5),
      next_billing_date: dateDaysAhead(5),
      status: 'TRIAL', // Trial still active for another 5 days
      created_at: dateDaysAgo(25),
      updated_at: dateDaysAgo(25)
    },
    {
      id: 'sub_live_physio_7711',
      user_id: 'usr_3',
      razorpay_customer_id: 'cust_physio_3322',
      razorpay_subscription_id: 'sub_rp_physio_3388',
      razorpay_plan_id: 'plan_rp_business_3',
      plan_name: 'Business',
      trial_start_date: dateDaysAgo(15),
      trial_end_date: dateDaysAhead(15),
      next_billing_date: dateDaysAhead(15),
      status: 'TRIAL', // Trial active for another 15 days
      created_at: dateDaysAgo(15),
      updated_at: dateDaysAgo(15)
    },
    {
      id: 'sub_live_sparkle_1100',
      user_id: 'usr_4',
      razorpay_customer_id: 'cust_sparkle_4433',
      razorpay_subscription_id: 'sub_rp_sparkle_2233',
      razorpay_plan_id: 'plan_rp_starter_1',
      plan_name: 'Starter',
      trial_start_date: dateDaysAgo(5),
      trial_end_date: dateDaysAhead(25),
      next_billing_date: dateDaysAhead(25),
      status: 'TRIAL', // Trial active
      created_at: dateDaysAgo(5),
      updated_at: dateDaysAgo(5)
    }
  ];

  const payments: LocalPayment[] = [
    // Onboarding fee ₹1 payments
    {
      id: 'pay_apex_trial',
      user_id: 'usr_1',
      subscription_id: 'sub_live_apex_4455',
      razorpay_payment_id: 'pay_rp_apex_t1',
      amount: 1,
      currency: 'INR',
      payment_type: 'TRIAL',
      status: 'captured',
      created_at: dateDaysAgo(45)
    },
    {
      id: 'pay_vibrant_trial',
      user_id: 'usr_2',
      subscription_id: 'sub_live_vibrant_8822',
      razorpay_payment_id: 'pay_rp_vibrant_t2',
      amount: 1,
      currency: 'INR',
      payment_type: 'TRIAL',
      status: 'captured',
      created_at: dateDaysAgo(25)
    },
    {
      id: 'pay_physio_trial',
      user_id: 'usr_3',
      subscription_id: 'sub_live_physio_7711',
      razorpay_payment_id: 'pay_rp_physio_t3',
      amount: 1,
      currency: 'INR',
      payment_type: 'TRIAL',
      status: 'captured',
      created_at: dateDaysAgo(15)
    },
    {
      id: 'pay_sparkle_trial',
      user_id: 'usr_4',
      subscription_id: 'sub_live_sparkle_1100',
      razorpay_payment_id: 'pay_rp_sparkle_t4',
      amount: 1,
      currency: 'INR',
      payment_type: 'TRIAL',
      status: 'captured',
      created_at: dateDaysAgo(5)
    },
    // First monthly subscription charge for usr_1 (Starter plan, ₹499 charged 15 days ago when trial ended)
    {
      id: 'pay_apex_charge_1',
      user_id: 'usr_1',
      subscription_id: 'sub_live_apex_4455',
      razorpay_payment_id: 'pay_rp_apex_c1',
      amount: 499,
      currency: 'INR',
      payment_type: 'SUBSCRIPTION',
      status: 'captured',
      created_at: dateDaysAgo(15)
    }
  ];

  const leads: Lead[] = [
    {
      id: 'lead_1',
      business_name: 'Saraswati Dental Care',
      owner_name: 'Dr. Alok Mohapatra',
      mobile: '9437123456',
      email: 'alok.dentist@gmail.com',
      city: 'Bhubaneswar',
      category: 'Dental Clinic',
      status: 'new',
      follow_ups: [],
      created_at: dateDaysAgo(2),
      updated_at: dateDaysAgo(2),
      notes: 'Interested in WhatsApp reminders and scheduling.',
      plan_interested: 'Starter'
    },
    {
      id: 'lead_2',
      business_name: 'Glow Beauty & Spa Studio',
      owner_name: 'Rupali Patnaik',
      mobile: '7008123456',
      email: 'rupali.beauty@yahoo.com',
      city: 'Cuttack',
      category: 'Salon',
      status: 'contacted',
      follow_ups: [
        {
          id: 'fu_1',
          date: dateDaysAgo(1),
          notes: 'Called owner. She is interested but requested a live demo specifically showing therapist booking.',
          agent: 'Admin'
        }
      ],
      created_at: dateDaysAgo(4),
      updated_at: dateDaysAgo(1),
      notes: 'Needs multi-staff calendar setup support.',
      plan_interested: 'Professional'
    },
    {
      id: 'lead_3',
      business_name: 'HealthFirst Physiotherapy Clinic',
      owner_name: 'Dr. Debasish Roy',
      mobile: '9861023456',
      email: 'debasish.physio@outlook.com',
      city: 'Bhubaneswar',
      category: 'Physiotherapy Center',
      status: 'demo_scheduled',
      follow_ups: [
        {
          id: 'fu_2',
          date: dateDaysAgo(3),
          notes: 'Emailed setup details.',
          agent: 'Admin'
        },
        {
          id: 'fu_3',
          date: dateDaysAgo(2),
          notes: 'Scheduled interactive system demo for tomorrow 4 PM.',
          agent: 'Admin'
        }
      ],
      created_at: dateDaysAgo(6),
      updated_at: dateDaysAgo(2),
      notes: 'Requires recurring appointment slot configurations.',
      plan_interested: 'Business'
    },
    {
      id: 'lead_4',
      business_name: 'Apex Orthopedic Clinic',
      owner_name: 'Dr. Ramesh Kumar',
      mobile: '9876543210',
      email: 'ramesh@apexortho.in',
      city: 'Bhubaneswar',
      category: 'Clinic',
      status: 'converted',
      follow_ups: [
        {
          id: 'fu_4',
          date: dateDaysAgo(15),
          notes: 'Completed ₹1 payment verifying verification transaction node.',
          agent: 'System'
        }
      ],
      created_at: dateDaysAgo(45),
      updated_at: dateDaysAgo(15),
      notes: 'Direct onboarding convert.',
      plan_interested: 'Starter'
    }
  ];

  return { users, subscriptions, payments, leads };
};

export class LocalDB {
  private static readDB(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_FILE_PATH)) {
        const initial = getInitialDatabase();
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
        return initial;
      }
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(data) as DatabaseSchema;
    } catch (e) {
      console.error('[DB Service] Error reading JSON file database:', e);
      return getInitialDatabase();
    }
  }

  private static writeDB(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB Service] Error writing JSON file database:', e);
    }
  }

  public static getUsers(): UserProfile[] {
    return this.readDB().users;
  }

  public static getSubscriptions(): LocalSubscription[] {
    return this.readDB().subscriptions;
  }

  public static getPayments(): LocalPayment[] {
    return this.readDB().payments;
  }

  public static getSubscriptionByUserId(userId: string): LocalSubscription | null {
    const db = this.readDB();
    const sub = db.subscriptions.find(s => s.user_id === userId);
    return sub || null;
  }

  public static getUserByUserId(userId: string): UserProfile | null {
    const db = this.readDB();
    const usr = db.users.find(u => u.user_id === userId);
    return usr || null;
  }

  public static getPaymentsByUserId(userId: string): LocalPayment[] {
    const db = this.readDB();
    return db.payments.filter(p => p.user_id === userId);
  }

  public static createOnboardingUser(user: Omit<UserProfile, 'created_at'>): UserProfile {
    const db = this.readDB();
    
    // Check if user already exists based on email or mobile; if so, update their record
    const existingIndex = db.users.findIndex(u => u.email === user.email || u.user_id === user.user_id);
    
    const newUser: UserProfile = {
      ...user,
      created_at: new Date().toISOString()
    };

    if (existingIndex > -1) {
      db.users[existingIndex] = { ...db.users[existingIndex], ...user };
    } else {
      db.users.push(newUser);
    }

    this.writeDB(db);
    return newUser;
  }

  public static createSubscription(sub: Omit<LocalSubscription, 'created_at' | 'updated_at'>): LocalSubscription {
    const db = this.readDB();
    // Prevent duplicate subscriptions for same user_id by deleting pre-existing before pushing
    db.subscriptions = db.subscriptions.filter(s => s.user_id !== sub.user_id);

    const nowStr = new Date().toISOString();
    const newSub: LocalSubscription = {
      ...sub,
      created_at: nowStr,
      updated_at: nowStr
    };

    db.subscriptions.push(newSub);
    this.writeDB(db);
    return newSub;
  }

  public static updateSubscriptionStatus(subId: string, status: LocalSubscription['status'], nextBilling?: string) {
    const db = this.readDB();
    const index = db.subscriptions.findIndex(s => s.id === subId || s.razorpay_subscription_id === subId);
    if (index > -1) {
      db.subscriptions[index].status = status;
      db.subscriptions[index].updated_at = new Date().toISOString();
      if (nextBilling) {
        db.subscriptions[index].next_billing_date = nextBilling;
      }
      this.writeDB(db);
    }
  }

  public static upgradeSubscription(userId: string, newPlan: 'Starter' | 'Professional' | 'Business', updateType: 'immediate' | 'prorated' | 'next_cycle') {
    const db = this.readDB();
    const index = db.subscriptions.findIndex(s => s.user_id === userId);
    if (index > -1) {
      const oldPlan = db.subscriptions[index].plan_name;
      db.subscriptions[index].plan_name = newPlan;
      db.subscriptions[index].updated_at = new Date().toISOString();
      
      const history = db.subscriptions[index].upgrades_history || [];
      history.push({
        from_plan: oldPlan,
        to_plan: newPlan,
        date: new Date().toISOString(),
        type: updateType
      });
      db.subscriptions[index].upgrades_history = history;

      // Adjust next billing price or update cycle if immediate/prorated
      if (updateType === 'immediate') {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        db.subscriptions[index].next_billing_date = d.toISOString();
        db.subscriptions[index].status = 'ACTIVE';
      }

      this.writeDB(db);
      return db.subscriptions[index];
    }
    return null;
  }

  public static downgradeSubscription(userId: string, newPlan: 'Starter' | 'Professional' | 'Business') {
    const db = this.readDB();
    const index = db.subscriptions.findIndex(s => s.user_id === userId);
    if (index > -1) {
      // Downgrades take place on the NEXT billing cycle as per requirement.
      // So we schedule it or record it in history and apply next cycle
      const oldPlan = db.subscriptions[index].plan_name;
      db.subscriptions[index].updated_at = new Date().toISOString();
      
      const history = db.subscriptions[index].upgrades_history || [];
      history.push({
        from_plan: oldPlan,
        to_plan: newPlan,
        date: new Date().toISOString(),
        type: 'next_cycle'
      });
      db.subscriptions[index].upgrades_history = history;
      
      // We will perform the soft transition: record scheduled downgrade, keep current status active
      // For immediate preview convenience, let's keep it as is, and we can flip plan state or keep flag.
      this.writeDB(db);
      return db.subscriptions[index];
    }
    return null;
  }

  public static cancelSubscription(userId: string) {
    const db = this.readDB();
    const index = db.subscriptions.findIndex(s => s.user_id === userId);
    if (index > -1) {
      // Do not immediately revoke access as per requirement ("Do not immediately revoke access. Your subscription will remain active until end of billing.")
      db.subscriptions[index].status = 'CANCELLED';
      db.subscriptions[index].cancelled_at = new Date().toISOString();
      db.subscriptions[index].subscription_end_date = db.subscriptions[index].next_billing_date;
      db.subscriptions[index].updated_at = new Date().toISOString();
      this.writeDB(db);
      return db.subscriptions[index];
    }
    return null;
  }

  public static createPayment(payment: Omit<LocalPayment, 'id' | 'created_at'>): LocalPayment {
    const db = this.readDB();
    const newPayment: LocalPayment = {
      ...payment,
      id: `pay_db_${Date.now()}_` + Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    };
    db.payments.push(newPayment);
    this.writeDB(db);
    return newPayment;
  }

  /**
   * Complex SaaS Analytics Calculations Engine
   */
  public static getAnalyticsMetrics() {
    const db = this.readDB();
    const subs = db.subscriptions;
    const payments = db.payments;

    // Trial metrics
    const trialSignups = subs.filter(s => s.status === 'TRIAL' || s.created_at).length;
    const trialConverted = subs.filter(s => s.status === 'ACTIVE' || s.upgrades_history?.length).length;
    const trialTotal = subs.length || 1;
    const trialConversionRate = Math.round((trialConverted / trialTotal) * 100);

    // Active subscribers count
    const activeSubscribers = subs.filter(s => s.status === 'ACTIVE' || s.status === 'TRIAL').length;

    // Churn calculation
    const cancelledCount = subs.filter(s => s.status === 'CANCELLED' || s.status === 'EXPIRED').length;
    const totalSubsWithHistory = subs.length || 1;
    const churnRate = Math.round((cancelledCount / totalSubsWithHistory) * 100);

    // Monthly Recurring Revenue & Annual Recurring Revenue
    // Starter: ₹499, Professional: ₹999, Business: ₹1999
    let mrr = 0;
    const planPrices = { Starter: 499, Professional: 999, Business: 1999 };
    subs.forEach(s => {
      if (s.status === 'ACTIVE') {
        mrr += planPrices[s.plan_name] || 0;
      }
    });
    const arr = mrr * 12;

    // Plan-wise revenue breakdown
    const planBreakdown = {
      Starter: 0,
      Professional: 0,
      Business: 0
    };
    payments.forEach(p => {
      if (p.status === 'captured') {
        const sub = subs.find(s => s.id === p.subscription_id);
        if (sub) {
          planBreakdown[sub.plan_name] += p.amount;
        } else {
          // fallback partition
          planBreakdown.Starter += p.amount;
        }
      }
    });

    // Total captured revenue
    let totalRevenue = 0;
    payments.forEach(p => {
      if (p.status === 'captured') {
        totalRevenue += p.amount;
      }
    });

    // Failed payments tracking
    const failedPaymentsCount = payments.filter(p => p.status === 'failed').length;

    // Customer Lifetime Value (Average spend per customer)
    const uniqueCustomers = new Set(payments.map(p => p.user_id)).size || 1;
    const clv = Math.round(totalRevenue / uniqueCustomers);

    return {
      trialSignups,
      trialConversionRate,
      activeSubscribers,
      mrr,
      arr,
      failedPaymentsCount,
      churnRate,
      planBreakdown,
      clv,
      totalRevenue
    };
  }

  public static getLeads(): Lead[] {
    const db = this.readDB();
    if (!db.leads) {
      db.leads = [];
      this.writeDB(db);
    }
    return db.leads;
  }

  public static createLead(lead: Omit<Lead, 'created_at' | 'updated_at'>): Lead {
    const db = this.readDB();
    if (!db.leads) db.leads = [];
    const newLead: Lead = {
      ...lead,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.leads.push(newLead);
    this.writeDB(db);
    return newLead;
  }

  public static updateLead(leadId: string, updates: Partial<Lead>): Lead | null {
    const db = this.readDB();
    if (!db.leads) db.leads = [];
    const idx = db.leads.findIndex(l => l.id === leadId);
    if (idx > -1) {
      db.leads[idx] = {
        ...db.leads[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.writeDB(db);
      return db.leads[idx];
    }
    return null;
  }

  public static addFollowUp(leadId: string, notes: string, agent: string = 'Admin'): Lead | null {
    const db = this.readDB();
    if (!db.leads) db.leads = [];
    const idx = db.leads.findIndex(l => l.id === leadId);
    if (idx > -1) {
      const follow_ups = db.leads[idx].follow_ups || [];
      follow_ups.push({
        id: `fu_${Date.now()}_` + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        notes,
        agent
      });
      db.leads[idx].follow_ups = follow_ups;
      db.leads[idx].updated_at = new Date().toISOString();
      this.writeDB(db);
      return db.leads[idx];
    }
    return null;
  }
}
