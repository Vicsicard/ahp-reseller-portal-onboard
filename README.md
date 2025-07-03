# AHP Mod 2.0 - Reseller Onboarding Portal

A comprehensive platform for onboarding resellers, managing their branded portals, and tracking customer sign-ups and analytics. This system enables automated partner acquisition, branded portal creation, end-to-end attribution of customer activity, and full analytics, payment, and branding support.

## Features

### Reseller Onboarding
- Multi-step form with business, contact, and payment information collection
- Branding customization (logo upload and color selection)
- Payment processing via Stripe integration
- Admin review and approval workflow

### Branded Reseller Portals
- Dynamic subdomain generation (companyname.aihandshake.org)
- Customizable landing pages with reseller branding
- Customer sign-up forms with reseller attribution
- Installation instructions and onboarding flow

### Customer Management
- Customer sign-up through reseller portals
- Automatic attribution to the referring reseller
- Customer status tracking and management
- UTM parameter tracking for marketing campaigns

### Analytics and Reporting
- Comprehensive dashboard for resellers
- Customer acquisition metrics
- Revenue tracking and commission reporting
- Landing page performance analytics

### Admin Controls
- Central admin dashboard for all resellers
- Approval/rejection workflow for new resellers
- System-wide statistics and reporting
- Access to all reseller portals and data

### Payment Processing
- Stripe integration for reseller onboarding
- Subscription plan management
- Revenue sharing and commission tracking
- Automated payment processing

## Architecture

### Frontend
- **Framework:** Next.js with React
- **Styling:** TailwindCSS with custom brand style guide
- **UI Components:** Custom component library following AHP Mod 2.0 Brand Style Guide
- **State Management:** React Context API and hooks
- **Routing:** Next.js dynamic routes for reseller portals

### Backend
- **Server:** Node.js with Express
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based authentication
- **File Storage:** Local file system with unique naming for uploaded assets
- **Email Service:** SendGrid with Bluehost SMTP fallback

### Integrations
- **Payments:** Stripe API for checkout sessions and webhooks
- **Email:** SendGrid for transactional emails
- **Analytics:** Custom analytics engine with MongoDB aggregation

### Deployment
- **Frontend:** Vercel (recommended)
- **Backend:** Render/Railway
- **Database:** MongoDB Atlas
- **Environment:** Docker support for local development

## Project Structure

```
ahp-reseller-portal/
├── client/                       # Next.js frontend
│   ├── public/                   # Static assets
│   │   └── uploads/              # Uploaded reseller logos
│   └── src/                      # React components and pages
│       ├── components/           # Reusable UI components
│       │   ├── dashboard/        # Dashboard components
│       │   ├── forms/            # Form components
│       │   ├── layout/           # Layout components
│       │   └── ui/               # UI component library
│       ├── pages/                # Next.js pages
│       │   ├── admin/            # Admin dashboard pages
│       │   ├── dashboard/        # Reseller dashboard pages
│       │   ├── onboarding/       # Reseller onboarding pages
│       │   └── [resellerId].js   # Dynamic reseller landing page
│       ├── styles/               # Global styles and Tailwind config
│       │   ├── brand.css         # Brand style guide implementation
│       │   └── globals.css       # Global CSS styles
│       ├── templates/            # Page templates
│       │   └── landing-page/     # Reseller landing page template
│       └── utils/                # Helper functions
│           ├── api.js            # API client
│           └── auth.js           # Authentication utilities
├── server/                       # Express backend
│   ├── controllers/              # Route controllers
│   │   ├── adminController.js    # Admin functionality
│   │   ├── analyticsController.js # Analytics functionality
│   │   ├── authController.js     # Authentication
│   │   ├── brandingController.js # Branding customization
│   │   ├── customerController.js # Customer management
│   │   ├── paymentController.js  # Payment processing
│   │   ├── publicController.js   # Public data access
│   │   └── resellerController.js # Reseller management
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # Authentication middleware
│   ├── models/                   # MongoDB schemas
│   │   ├── Customer.js           # Customer model
│   │   ├── Reseller.js           # Reseller model
│   │   └── User.js               # User model
│   ├── routes/                   # API routes
│   │   ├── adminRoutes.js        # Admin routes
│   │   ├── analyticsRoutes.js    # Analytics routes
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── brandingRoutes.js     # Branding routes
│   │   ├── customerRoutes.js     # Customer routes
│   │   ├── paymentRoutes.js      # Payment routes
│   │   ├── publicRoutes.js       # Public routes
│   │   └── resellerRoutes.js     # Reseller routes
│   └── utils/                    # Helper functions
│       ├── analyticsService.js   # Analytics service
│       ├── emailService.js       # Email service
│       └── stripeService.js      # Stripe service
├── shared/                       # Shared code between client and server
│   ├── constants/                # Shared constants
│   │   ├── plans.js              # Subscription plans
│   │   └── routes.js             # API routes
│   └── types/                    # TypeScript types
│       ├── customer.js           # Customer types
│       └── reseller.js           # Reseller types
├── .env.example                  # Example environment variables
└── docker-compose.yml            # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Stripe account
- SendGrid account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ahp-reseller
JWT_SECRET=your_jwt_secret

# Client
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_BASIC_PRICE_ID=price_id_for_basic_plan
STRIPE_PRO_PRICE_ID=price_id_for_pro_plan
STRIPE_ENTERPRISE_PRICE_ID=price_id_for_enterprise_plan

# Email
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@aihandshake.org

# Backup Email (Bluehost SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ahp-reseller-portal.git
cd ahp-reseller-portal
```

2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start development servers

```bash
# Start backend server
cd ../server
npm run dev

# Start frontend server in a new terminal
cd ../client
npm run dev
```

4. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## API Documentation

The API documentation is available at `/api/docs` when running the server locally.

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set up the environment variables
3. Deploy the `client` directory

### Backend (Render/Railway)

1. Connect your GitHub repository to Render or Railway
2. Set up the environment variables
3. Deploy the `server` directory

## Contributing

Please follow the established code style and commit message conventions. All new features should include appropriate tests.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For questions or support, please contact the project owner.
