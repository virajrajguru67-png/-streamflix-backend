import Razorpay from 'razorpay';
import crypto from 'crypto';
export class RazorpayService {
    constructor(config) {
        this.razorpay = null;
        if (config?.keyId && config?.keySecret) {
            this.razorpay = new Razorpay({
                key_id: config.keyId,
                key_secret: config.keySecret,
            });
        }
    }
    isConfigured() {
        return this.razorpay !== null;
    }
    async createOrder(amount, currency = 'INR', receipt, notes) {
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
    verifyPayment(orderId, paymentId, signature, keySecret) {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(`${orderId}|${paymentId}`)
                .digest('hex');
            return expectedSignature === signature;
        }
        catch (error) {
            return false;
        }
    }
    async fetchPayment(paymentId) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not configured');
        }
        return await this.razorpay.payments.fetch(paymentId);
    }
    async fetchOrder(orderId) {
        if (!this.razorpay) {
            throw new Error('Razorpay is not configured');
        }
        return await this.razorpay.orders.fetch(orderId);
    }
}
//# sourceMappingURL=razorpay.service.js.map