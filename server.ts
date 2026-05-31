import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body reading
app.use(express.json());

// Initialize Razorpay SDK client securely
const getRazorpayClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_Svzvbb48FopJP7';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'MalLa7GYFmF7fuzuDh9cWpyB';
  if (!key_id || !key_secret) {
    throw new Error('Razorpay project configuration is missing ID or Secret');
  }
  return new Razorpay({
    key_id: key_id,
    key_secret: key_secret
  });
};

// API Endpoint to instantiate a secure Razorpay booking/payment transaction
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    // Amount is required to be in paise (Standard INR division scale)
    if (!amount || Number(amount) < 100) {
      return res.status(400).json({
        success: false,
        error: 'Payment amount is required and must be at least 100 paise (₹1).'
      });
    }

    const client = getRazorpayClient();
    const options = {
      amount: Math.round(Number(amount)), // scale to whole paise nodes
      currency: 'INR',
      receipt: receipt || `appointo_${Date.now()}`
    };

    console.log(`[Razorpay Backend] Initiating order transaction structure:`, options);
    const order = await client.orders.create(options);
    console.log(`[Razorpay Backend] Order created successfully:`, order);

    return res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error(`[Razorpay Backend] order generation failure:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Critical failure inside billing engine'
    });
  }
});

// API Endpoint to perform HMAC-SHA256 signature alignment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters for secure HMAC mapping validation'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'MalLa7GYFmF7fuzuDh9cWpyB';
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log(`[Razorpay Backend] Payment verified successfully for order: ${razorpay_order_id}`);
      return res.json({
        success: true,
        message: 'Signature verified, transactional credentials validated.'
      });
    } else {
      console.error(`[Razorpay Backend] Fraud/Alignment Signature conflict detected!`);
      return res.status(400).json({
        success: false,
        error: 'Payment validation failed: SHA256 signature alignment mismatch'
      });
    }
  } catch (error: any) {
    console.error(`[Razorpay Backend] verification failure:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Critical signature mapping failure'
    });
  }
});

// Lazy-initialized API Client for Resend (Using native fetch for robust, dependency-free execution)
const getResendApiKey = (): string => {
  const key = process.env.RESEND_API_KEY || 're_Sey7ddLh_JQoQu6NBeJYjNkSVVVE5c1Lu';
  if (!key) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }
  return key;
};

// API Endpoint for email dispatch
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    
    const apiKey = getResendApiKey();
    const recipient = to || 'frederic.soreng@gmail.com'; // Default to user's registered email

    console.log(`[Resend Engine] Sending email to ${recipient}...`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'AppointO Notifications <onboarding@resend.dev>',
        to: [recipient],
        subject: subject || 'AppointO Booking Notification',
        html: html || '<p>A new trial/onboarding demo has been requested successfully on AppointO.</p>',
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error('[Resend Engine] Error response:', data);
      return res.status(response.status).json({
        success: false,
        error: data.message || 'Failed to dispatch email via Resend API.',
        details: data
      });
    }

    console.log('[Resend Engine] Email successfully dispatched:', data);
    return res.json({
      success: true,
      message: 'Email dispatched successfully via Resend API!',
      id: data.id
    });
  } catch (error: any) {
    console.error('[Resend Engine] Server crash:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
});

// Configure Vite or Static delivery
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve spa fallback properly
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset serving set up complete.');
  }
}

setupViteOrStatic().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
