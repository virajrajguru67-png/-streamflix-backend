# StreamFlix Backend API

Express.js backend API for StreamFlix movie booking platform.

## Features

- 🔐 Authentication (JWT-based)
- 🎬 Movie catalog management
- 🎫 Showtime scheduling
- 💳 Payment integration (Razorpay)
- 👤 User management
- 🔧 Admin panel APIs
- 📧 Email notifications
- 🗄️ MySQL database (Aiven)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: MySQL (Aiven)
- **Deployment**: Vercel Serverless

## Prerequisites

- Node.js 18+
- npm or yarn
- MySQL database (Aiven)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/streamflix-backend.git
cd streamflix-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.sample .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Aiven MySQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- Other variables as needed

4. Run database migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This backend is configured for deployment on Vercel. See `DEPLOY_VERCEL_AIVEN.md` for detailed instructions.

## API Endpoints

- `GET /healthz` - Health check
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /catalog/movies` - Get movies
- `POST /payments/orders` - Create payment order
- `POST /payments/verify` - Verify payment

## Documentation

- `DEPLOY_VERCEL_AIVEN.md` - Deployment guide
- `QUICK_START_AIVEN.md` - Quick setup guide
- `AIVEN_SETUP.md` - Aiven database setup

## License

Private
# -streamflix-backend
