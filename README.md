# Startup Vault - Exclusive SaaS Deals Platform

A production-grade platform connecting startup founders with exclusive discounts on premium SaaS tools. Features verified-only deals, deal claiming, and comprehensive dashboard management.

## Application Overview

**Startup Vault** is a full-stack web application designed specifically for startup founders and early teams. It solves the problem of SaaS cost optimization by aggregating exclusive partner discounts and verifying user eligibility through email verification.

### Core User Journey

1. **Registration & Authentication**: Users sign up with email/password, receive verification email
2. **Email Verification**: Completing verification unlocks premium (verified-only) deals
3. **Browse Deals**: Public deals visible to everyone; verified deals unlock after verification
4. **Claim Deals**: Users claim deals instantly, receiving unique coupon codes
5. **Dashboard**: Track claimed deals and their approval status

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios

---

## Architecture & Design Patterns

### Backend Structure
```
backend/
├── src/
│   ├── config/           # Database connection, env config
│   ├── middleware/       # Auth, error handling
│   ├── models/           # Mongoose schemas: User, Deal, Claim
│   ├── routes/           # API endpoints: auth, deals, claims
│   ├── types/            # TypeScript interfaces
│   └── index.ts          # Server entry point
```

### Key Design Decisions

1. **Separation of Concerns**: Routes handle HTTP layer, models handle data persistence, middleware handles cross-cutting concerns

2. **Authentication Strategy**:
   - JWT tokens stored in localStorage on frontend
   - Tokens auto-attached to all API requests via axios interceptor
   - Backend validates token on protected routes
   - Verification status (boolean) encoded in JWT for instant authorization checks

3. **Authorization Model**:
   - **Public Deals**: Accessible to all users (authenticated or not)
   - **Verified Deals**: Require `user.isVerified === true`
   - Middleware `requireVerified` enforces server-side authorization
   - Frontend UI shows locked state for restricted deals

4. **Deal Claiming Lifecycle**:
   - User claims deal → Claim record created with `status: 'pending'`
   - Unique code generated: `{dealId}-{timestamp}`
   - `currentClaims` counter incremented on Deal
   - Prevents duplicate claims via unique compound index: `{userId, dealId}`
   - Claims appear in dashboard with status tracking

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register new user
```json
{
  "email": "founder@startup.com",
  "password": "securepass123",
  "name": "John Doe"
}
```
Returns verification token (for testing); in production, email verification link sent.

#### POST `/api/auth/login`
Login with credentials
```json
{
  "email": "founder@startup.com",
  "password": "securepass123"
}
```
Returns `{ token, user }`

#### POST `/api/auth/verify-email`
Verify email using token from registration
```json
{
  "verificationToken": "token_from_email"
}
```

#### GET `/api/auth/me`
Get current user profile (requires auth)

#### PUT `/api/auth/profile`
Update profile (requires auth)
```json
{
  "name": "Jane Doe",
  "company": "Acme Inc",
  "role": "founder"
}
```

### Deals Endpoints

#### GET `/api/deals`
List deals with filtering
```
Query Parameters:
- category: string (hosting, analytics, payment, etc.)
- search: string (searches title, description, partner name)
- accessLevel: 'public' | 'verified' | 'all'
- limit: number (default 20, max 100)
- skip: number (default 0)
```
Returns deals array with `isLocked` and `isClaimed` flags

#### GET `/api/deals/:id`
Get single deal details
Returns deal object + user's claim status if exists

#### POST `/api/deals/:dealId/claim`
Claim a deal (requires auth)
```
Business Logic:
1. Check deal exists and not expired
2. Check if user already claimed (prevents duplicates)
3. Check accessLevel: if 'verified', require user.isVerified
4. If maxClaims reached, reject
5. Create claim with unique code
6. Increment deal.currentClaims
```
Returns: `{ id, status, code, claimedAt }`

### Claims Endpoints

#### GET `/api/claims`
Get user's claims (requires auth)
```
Query Parameters:
- status: 'pending' | 'approved' | 'rejected' | 'expired'
- limit: number
- skip: number
```

#### GET `/api/claims/:claimId`
Get single claim (ownership verified)

#### GET `/api/claims/stats/overview`
Get user's claim statistics
Returns: `{ pending, approved, rejected, total }`

---

## Database Schema

### User Model
```typescript
{
  email: string (unique, indexed),
  password: string (hashed with bcryptjs),
  name: string,
  isVerified: boolean (default: false),
  verificationToken?: string (expires after 24h),
  company?: string,
  role?: 'founder' | 'cto' | 'team_member' | 'investor' | 'other',
  createdAt: Date,
  updatedAt: Date
}
```

### Deal Model
```typescript
{
  title: string,
  description: string,
  category: string (enum: hosting, analytics, etc.),
  accessLevel: 'public' | 'verified',
  discount: number,
  discountType: 'percentage' | 'flat',
  maxClaims: number,
  currentClaims: number,
  partner: {
    name: string,
    logo: string,
    description: string,
    website: string
  },
  terms: string,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
Indexes: category, accessLevel, expiresAt
```

### Claim Model
```typescript
{
  userId: ObjectId (indexed),
  dealId: ObjectId (indexed),
  status: 'pending' | 'approved' | 'rejected' | 'expired',
  claimedAt: Date,
  approvedAt?: Date,
  code: string (unique),
  createdAt: Date,
  updatedAt: Date
}
Indexes: {userId, dealId} (unique), status, dealId+status
```

---

## Frontend Architecture

### Components
- **Navigation**: Global header with auth state
- **DealCard**: Reusable card component with locked state overlay
- **LoadingSkeleton**: Animated placeholder for loading states

### Pages
1. **`/`**: Landing page with hero, features, stats, CTA
2. **`/register`**: Sign up form + email verification success state
3. **`/login`**: Login form with error handling
4. **`/deals`**: Grid view with search, category filters, pagination
5. **`/deals/[id]`**: Full deal details, partner info, claim button, code display
6. **`/dashboard`**: User profile, stats, claimed deals history

### State Management (Zustand)
```typescript
// useAuthStore: user, token, setUser(), logout()
// useUiStore: mobileMenuOpen, toggleMobileMenu()
```

### API Integration Pattern
```typescript
// lib/api.ts exports typed API functions
// axios interceptor auto-attaches JWT token
// All errors caught and displayed in UI
```

---

## Authentication & Authorization Flow

### JWT Payload
```typescript
{
  userId: string,
  email: string,
  isVerified: boolean,
  exp: number (7 days)
}
```

### Protected Routes
All routes requiring auth check Bearer token in Authorization header:
```
Authorization: Bearer {token}
```

### Authorization Rules Enforced

| Action | Requirement |
|--------|-------------|
| Login/Register | Public |
| View public deals | Public |
| View verified deals | `isVerified === true` |
| Claim public deal | Authenticated |
| Claim verified deal | Authenticated + `isVerified === true` |
| Access dashboard | Authenticated |
| View claims | Authenticated (owner) |

---

## Key Features Implemented

### ✅ Complete Feature List

1. **User Management**
   - Registration with email
   - Email verification flow
   - Profile editing (name, company, role)
   - Logout

2. **Deal Management**
   - Public and verified-only deals
   - Category filtering (9 categories)
   - Full-text search
   - Deal details page
   - Partner information
   - Expiry tracking
   - Availability tracking (currentClaims/maxClaims)

3. **Deal Claiming**
   - One-click claim with unique code generation
   - Duplicate prevention (one claim per user per deal)
   - Availability checking
   - Authorization enforcement
   - Status tracking (pending/approved/rejected/expired)

4. **Dashboard**
   - User profile with edit capability
   - Statistics (total/pending/approved/rejected claims)
   - Claimed deals history
   - Coupon code display
   - Status badges

5. **UI/UX**
   - Responsive design (mobile-first)
   - Framer Motion page/component transitions
   - Hover micro-interactions
   - Loading skeletons
   - Error handling with user feedback
   - Locked deal visual indicators
   - Verification status indicators

6. **Frontend-Backend Integration**
   - Automatic JWT token management
   - Protected API routes
   - Proper HTTP status codes (400, 401, 403, 404, 409)
   - Validation on both client and server

---

## Installation & Setup

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
   JWT_SECRET=your_super_secret_key_change_in_production
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`

---

## Seeding Sample Data

### Backend - Add Sample Deals (Manual)

Use MongoDB client or script to insert sample deals:

```javascript
db.deals.insertMany([
  {
    title: "Vercel Pro - $20/month",
    description: "Get 50% off Vercel Pro annual plan. Deploy faster with unlimited projects and advanced CI/CD.",
    category: "hosting",
    accessLevel: "public",
    discount: 50,
    discountType: "percentage",
    maxClaims: 100,
    currentClaims: 0,
    partner: {
      name: "Vercel",
      logo: "https://example.com/vercel.png",
      description: "The platform for frontend developers",
      website: "https://vercel.com"
    },
    terms: "Valid for 1 year. Use code at checkout. Cannot be combined with other offers.",
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  }
  // Add more deals...
])
```

### Manual Testing Workflow

1. **Register**: Go to `/register`, create account
2. **Email Verification**: Check console output or MongoDB for token, visit `/api/auth/verify-email` with token
3. **Browse**: Visit `/deals` - see mix of public and locked deals
4. **Claim**: Click deal → Claim → Get code
5. **Dashboard**: Visit `/dashboard` - see claimed deals

---

## Deployment

### Backend (Render/Railway)

1. Push code to GitHub
2. Create new service on Render/Railway
3. Set environment variables (same as `.env`)
4. Select Node.js environment
5. Build command: `npm run build`
6. Start command: `npm start`
7. Database URL should use production MongoDB

### Frontend (Vercel)

1. Push code to GitHub
2. Create new project on Vercel
3. Set environment variables: `NEXT_PUBLIC_API_URL` → backend URL
4. Vercel auto-deploys on push
5. Next.js automatically optimizes on build

### Pre-Deployment Checklist

- [ ] JWT_SECRET changed to strong random string
- [ ] MONGODB_URI points to production database
- [ ] FRONTEND_URL in backend matches deployed frontend
- [ ] NEXT_PUBLIC_API_URL in frontend matches deployed backend
- [ ] Email verification emails configured (currently logs to console)
- [ ] CORS properly configured for production domain
- [ ] Database indexes created (Mongoose does this automatically)

---

## Known Limitations & Production Improvements

### Email System
**Current**: Verification tokens logged to console
**Production**: Integrate SendGrid/AWS SES for real emails with links

### Deal Status Updates
**Current**: Claims created as 'pending', manual database update to 'approved'
**Production**: 
- Admin panel to manage claim approvals
- Automated approval based on rules
- Notification emails to users

### Security Enhancements Needed
- Rate limiting on auth endpoints
- HTTPS enforcement
- CSRF token protection
- Input sanitization (currently validated only)
- Request body size limits
- API key rotation for admin operations

### Scalability Considerations
- Add caching layer (Redis) for deal listings
- Implement pagination cursor instead of offset
- Add database connection pooling
- Consider CDN for static assets
- Monitor MongoDB query performance with APM

### Analytics & Monitoring
- Add application performance monitoring (New Relic/DataDog)
- Track deal claim conversion rates
- Monitor API response times
- User engagement metrics
- Error tracking (Sentry)

---

## UI/UX Performance Notes

### Animation Implementation
- **Page transitions**: Framer Motion's `AnimatePresence` for smooth nav
- **Hover effects**: Scale, color transitions, shadow changes
- **Loading states**: Skeleton loaders with pulsing animation
- **Form feedback**: Immediate validation, error animations

### Responsive Design
- Mobile-first approach using Tailwind
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons (min 44px)
- Flexible grid layouts

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Color contrast ratios meet WCAG AA
- Keyboard navigation support
- Form labels associated with inputs

---

## File Structure

```
StartupVault/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Deal.ts
│   │   │   └── Claim.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── deals.ts
│   │   │   └── claims.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── deals/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── DealCard.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── store.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next.config.js
│   └── .env.local.example
└── README.md
```

---

## Development Workflow

### Adding a New Deal Feature (Example)

1. **Backend**
   - Add new field to Deal schema in `models/Deal.ts`
   - Create route handler in `routes/deals.ts`
   - Update validation logic

2. **Frontend**
   - Update API function in `lib/api.ts`
   - Modify DealCard component if needed
   - Update deal details page

3. **Testing**
   - Test with curl/Postman on backend
   - Test UI interaction on frontend
   - Verify database changes

---

## Support & Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify MONGODB_URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**JWT Token Expired**
- Tokens expire after 7 days
- User must login again
- localStorage token cleared on logout

**CORS Error**
- Check FRONTEND_URL matches frontend domain
- Verify backend CORS configuration
- Check API URL in frontend .env.local

**Locked Deals Not Showing**
- User must verify email first
- Check user.isVerified in database
- Clear browser cache/localStorage

---

## License

MIT - This is a demonstration project.
