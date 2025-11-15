import { Router } from 'express';
import { Prisma } from '@prisma/client';

import { paymentAuditSchema, createOrderSchema, verifyPaymentSchema } from '../modules/payments/payment.schema.js';
import { asyncHandler } from '../utils/async-handler.js';
import { prisma } from '../services/prisma.js';
import { mapPaymentAudit } from '../modules/admin/admin.mappers.js';
import { RazorpayService } from '../modules/payments/razorpay.service.js';
import { authenticate, RequestWithAuth } from '../middleware/authenticate.js';
import { env } from '../config/env.js';

export const paymentsRouter = Router();

// Create payment order
paymentsRouter.post(
  '/orders',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = createOrderSchema.parse(req.body);

    // Get Razorpay keys from PlatformSettings
    const settings = await prisma.platformSettings.findFirst();
    if (!settings || !settings.razorpayKey) {
      return res.status(503).json({
        error: 'Payment gateway is not configured. Please contact administrator.',
      });
    }

    // Get secret key from environment or settings
    // Note: Ideally secret key should be in env vars for security
    const keySecret = env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(503).json({
        error: 'Payment gateway secret key is not configured.',
      });
    }

    const razorpayService = new RazorpayService({
      keyId: settings.razorpayKey,
      keySecret: keySecret,
    });

    const order = await razorpayService.createOrder(
      payload.amount,
      payload.currency,
      undefined,
      payload.metadata as Record<string, string> | undefined,
    );

    res.json({
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: settings.razorpayKey, // Publishable key for frontend
      },
    });
  }),
);

// Verify payment
paymentsRouter.post(
  '/verify',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = verifyPaymentSchema.parse(req.body);

    // Get Razorpay keys from PlatformSettings
    const settings = await prisma.platformSettings.findFirst();
    if (!settings || !settings.razorpayKey) {
      return res.status(503).json({
        error: 'Payment gateway is not configured.',
      });
    }

    const keySecret = env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(503).json({
        error: 'Payment gateway secret key is not configured.',
      });
    }

    const razorpayService = new RazorpayService({
      keyId: settings.razorpayKey,
      keySecret: keySecret,
    });

    const isValid = razorpayService.verifyPayment(
      payload.orderId,
      payload.paymentId,
      payload.signature,
      keySecret,
    );

    if (isValid) {
      // Fetch payment details for confirmation
      try {
        const payment = await razorpayService.fetchPayment(payload.paymentId);
        res.json({
          data: {
            success: true,
            paymentId: payment.id,
            orderId: payment.order_id,
            amount: Number(payment.amount) / 100, // Convert paise to rupees
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
          },
        });
      } catch (error) {
        // Payment verified but failed to fetch details
        res.json({
          data: {
            success: true,
            paymentId: payload.paymentId,
            orderId: payload.orderId,
          },
        });
      }
    } else {
      res.status(400).json({
        error: 'Payment verification failed. Signature mismatch.',
      });
    }
  }),
);

paymentsRouter.post(
  '/audit',
  asyncHandler(async (req, res) => {
    const payload = paymentAuditSchema.parse(req.body);

    const record = await prisma.paymentAudit.upsert({
      where: { transactionId: payload.transactionId },
      create: {
        transactionId: payload.transactionId,
        status: payload.status,
        method: payload.method,
        amount: new Prisma.Decimal(payload.amount),
        movieTitle: payload.movieTitle,
        showtime: payload.showtime,
        seats: payload.seats ?? [],
      },
      update: {
        status: payload.status,
        method: payload.method,
        amount: new Prisma.Decimal(payload.amount),
        movieTitle: payload.movieTitle,
        showtime: payload.showtime,
        seats: payload.seats ?? [],
      },
    });

    res.status(201).json({ data: mapPaymentAudit(record) });
  }),
);
