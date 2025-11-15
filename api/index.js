import { createApp } from '../src/app.js';
// Create Express app instance
const app = createApp();
// Export as Vercel serverless function
export default function handler(req, res) {
    return app(req, res);
}
//# sourceMappingURL=index.js.map