Product Requirements Document (PRD)
Product Name: AHP Mod 2.0 – Reseller Onboarding Portal
Repository: ahp-reseller-portal
Version: v1.0
Owner: Vic Sicard
Status: Ready for Development

🧩 1. Purpose
The Reseller Onboarding Portal enables streamlined partner acquisition and management for the AHP Mod 2.0 product. This self-contained application facilitates:

Automated onboarding of resellers

Branded portal creation

End-to-end attribution of customer activity

Full analytics, payment, and branding support

It lays the foundation for a scalable white-label growth engine.

🎯 2. Objectives
✅ Simplify the signup process for potential resellers

✅ Automate portal provisioning upon approval

✅ Attribute each downstream customer to a reseller

✅ Enable Stripe-powered revenue tracking

✅ Provide analytics and branding controls for resellers

✅ Maintain brand security, data integrity, and scalability

🔄 3. Complete System Flow
A. 🧲 Reseller Acquisition
Potential resellers visit resell.aihandshake.org

They view benefits of joining the AHP Mod 2.0 reseller program

Call-to-action: "Sign Up" initiates the onboarding process

B. 🧾 Reseller Onboarding Form
Multi-step UX collects:

Business information

Contact details

Payment information (via Stripe)

Branding preferences (logo, color scheme)

Data is stored securely in MongoDB

Optional: Save/resume onboarding via tokenized links

C. 🧱 Portal Creation & Approval
Admin reviews submitted application via internal dashboard

Upon approval:

A branded portal is generated for the reseller:

Subdomain: companyname.aihandshake.org

Custom logo/colors injected

A customer-facing landing page is also provisioned:

URL: companyname.aihandshake.org/landing (or /start)

D. 👥 Customer Acquisition & Onboarding
Resellers share their landing link with customers

Customers sign up to use AHP Mod via the branded portal

The system:

Associates each new user with their referring reseller

Tracks signups, revenue, and usage

Handles customer payments via Stripe

Sends relevant onboarding emails

E. 📊 Tracking & Analytics
MongoDB stores all user and usage data

Stripe handles payments and tracks earnings per reseller

All customer actions are tagged with the reseller ID

Attribution is fully automated for transparency and reporting

F. 📈 Reseller Dashboard (Post-Login)
Authenticated portal for approved resellers:

View customer history & statuses

Track monthly sales and commission

Customize branding (logo/colors)

Update contact/payment details

View system usage & Stripe earnings summary

🏗️ 4. Architecture Overview
bash
Copy
Edit
ahp-reseller-portal/
├── client/               # Next.js + Tailwind frontend
├── server/               # Express backend with MongoDB
├── shared/               # Constants, types
├── .env.example
├── docker-compose.yml
Frontend: Next.js (React), TailwindCSS

Backend: Node.js + Express

Database: MongoDB Atlas

Payments: Stripe (reseller onboarding + customer usage)

Email: SendGrid (form notifications + onboarding emails)

Subdomain Hosting: Vercel, dynamic via environment config or wildcard DNS

🔐 5. Key Features
✅ Multi-Step Reseller Form
6-step flow (business → contact → tech → marketing → payment → confirm)

Save & continue via token

Conditional logic for integration type

Form validation + CAPTCHA + inline feedback

✅ Portal Generator (Post-Approval)
Auto-creates:

Branded portal using logo/colors

Customer onboarding page (customized to reseller)

Routes tied to subdomain

✅ Admin Interface
Review pending reseller applications

Change status (New → Approved → Rejected)

View submitted data

Trigger onboarding email or setup

✅ Stripe Integration
Reseller onboarding includes Stripe setup

Stripe accounts linked for revenue sharing

Admin dashboard shows real-time commission reporting

✅ Customer Attribution Engine
Every customer signup is tagged with a resellerId

Usage and earnings are tracked per-reseller

Revenue-based reporting sent to Stripe + dashboard

✅ Analytics Dashboard (v1 MVP)
Total signups, revenue, active customers

Filters by time period

Monthly payout estimate

Branding customization view/edit

📎 6. Acceptance Criteria
✅ Form data saved in MongoDB and resumable via token

✅ Admin receives email on submission

✅ Reseller gets thank-you + setup email on approval

✅ Unique subdomain and branding appear after approval

✅ Customers routed through branded portals

✅ Stripe transactions logged and attributed

✅ Reseller dashboard loads accurate data