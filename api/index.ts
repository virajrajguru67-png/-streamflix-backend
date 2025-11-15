import type { VercelRequest, VercelResponse } from '@vercel/node';
// Import from compiled dist (will be built before Vercel deploys)
import { createApp } from '../dist/app.js';

// Create Express app instance
const app = createApp();

// Export as Vercel serverless function
// Vercel will compile TypeScript automatically
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}

