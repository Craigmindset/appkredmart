// Where to connect UI -> Server (real practice checklist)
//
// Auth:
// - app/sign-in/page.tsx: replace mock setUser + redirect with POST /api/auth/login.
//   On success, server sets HTTP-only session cookie; then router.push(next || "/dashboard/overview").
// - app/sign-up/page.tsx + app/sign-up/verify/page.tsx: after verification, call POST /api/auth/register
//   with firstName, lastName, email, phone, password.
// - components/require-auth.tsx: consider moving to server-side enforcement later by reading getSession()
//   in app/dashboard/layout.tsx (Server Component) and redirecting before render.
//
// Wallet:
// - app/dashboard/wallet/page.tsx: replace local deduct/addFunds with POST /api/wallet/airtime and
//   POST /api/wallet/data. On success, refetch balance (add GET /api/wallet/balance) to reflect server state.
//
// Loan Request:
// - app/dashboard/loan-request/page.tsx: when user clicks "Apply Now", create a row in loan_applications
//   (POST /api/loans/apply) then redirect to provider URL.
//
// Cart/Checkout:
// - app/cart/page.tsx: derive cart totals from server or validate prices server-side before checkout.
// - app/checkout/page.tsx: submit an order to POST /api/orders and process payment via gateway,
//   then create transactions of type ORDER and adjust wallet if using wallet payments.
//
// Newsletter:
// - components/newsletter.tsx: swap timeout with POST /api/newsletter/subscribe.
//
// Dashboard metrics:
// - app/dashboard/overview/page.tsx: fetch counts from server via queries instead of hard-coded numbers.
//
// Store/search:
// - app/store/page.tsx and app/store/[category]/page.tsx: eventually fetch products server-side and
//   implement server-driven pagination + filters (URL-synced).
//
// Sessions:
// - Add a "GET /api/auth/me" that returns the current session (from cookie). Use it to hydrate client auth store.
//
// Environment:
// - Set these in Vercel Project Settings -> Environment Variables:
//   DATABASE_URL (Neon), JWT_SECRET, RESEND_API_KEY?, UPSTASH_KV_REST_API_URL?, UPSTASH_KV_REST_API_TOKEN?,
//   NEXT_PUBLIC_SITE_URL.
//
// Security:
// - Never store raw passwords. Always hash (bcrypt) and use prepared statements (we do).
// - Use HTTP-only cookies for sessions (we do). Consider rotating and revocation via a sessions table if needed.
