import Razorpay from 'razorpay';
import crypto from 'crypto';

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

export class RazorpayService {
  private razorpay: Razorpay | null = null;

  constructor(config?: RazorpayConfig) {
    if (config?.keyId && config?.keySecret) {
      this.razorpay = new Razorpay({
        key_id: config.keyId,
        key_secret: config.keySecret,
      });
    }
  }

  isConfigured(): boolean {
    return this.razorpay !== null;
  }

  async createOrder(
    amount: number,
    currency: string = 'INR',
    receipt?: string,
    notes?: Record<string, string>,
  ) {
    if (!this.razorpay) {
      throw new Error('Razorpay is not configured');
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await this.razorpay.orders.create(options);
    return order;
  }

  verifyPayment(orderId: string, paymentId: string, signature: string, keySecret: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      return false;
    }
  }

  async fetchPayment(paymentId: string) {
    if (!this.razorpay) {
      throw new Error('Razorpay is not configured');
    }

    return await this.razorpay.payments.fetch(paymentId);
  }

  async fetchOrder(orderId: string) {
    if (!this.razorpay) {
      throw new Error('Razorpay is not configured');
    }

    return await this.razorpay.orders.fetch(orderId);
  }
}

