# Quick Start Guide

Get Startup Vault running locally in 5 minutes.

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git

## Step 1: Clone & Setup

```bash
# Create project directories
mkdir startup-vault && cd startup-vault

# Copy all backend files to ./backend
# Copy all frontend files to ./frontend
# Copy .gitignore and README.md to project root
```

## Step 2: Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free tier cluster
3. Create user with password
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/...`

## Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
# JWT_SECRET=your_super_secret_key_here
```

## Step 4: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# .env.local should have:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 5: Run Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:3000`

## Step 6: Test the App

1. **Open**: http://localhost:3000
2. **Register**: Click "Sign Up" → create account
3. **Check Console**: Backend logs verification token
4. **Verify Email**: Copy token, POST to: 
   ```
   curl -X POST http://localhost:5000/api/auth/verify-email \
     -H "Content-Type: application/json" \
     -d '{"verificationToken":"your_token_here"}'
   ```
5. **Login**: Use your credentials
6. **Browse Deals**: Go to `/deals`
7. **Claim Deal**: Click any deal → "Claim This Deal"
8. **Dashboard**: View claimed deals at `/dashboard`

## Step 7: Seed Sample Deals (Optional)

```bash
cd backend
npm run build
npm run seed
```

Then refresh browser to see deals.

## Troubleshooting

### Can't connect to MongoDB
- Verify connection string in .env
- Check IP whitelist in MongoDB Atlas includes your IP
- Try connection from MongoDB compass

### CORS errors
- Ensure frontend .env.local has correct API URL
- Backend must have `FRONTEND_URL` in .env

### Port conflicts
- Backend: Change `PORT` in .env
- Frontend: `npm run dev -- -p 3001`

## Project Structure

```
startup-vault/
├── backend/                 # Express + MongoDB
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Database schemas
│   │   ├── middleware/     # Auth, errors
│   │   └── index.ts        # Server entry
│   └── package.json
├── frontend/               # Next.js + React
│   ├── app/               # Pages & layouts
│   ├── components/        # React components
│   ├── lib/               # API & state
│   └── package.json
└── README.md              # Full documentation
```

## Key Files

**Backend**
- `src/models/User.ts` - User schema with password hashing
- `src/models/Deal.ts` - Deal with partner info & availability
- `src/models/Claim.ts` - Claim tracking with unique codes
- `src/routes/auth.ts` - Login, register, verify
- `src/routes/deals.ts` - Deal listing & claiming
- `src/routes/claims.ts` - User's claimed deals

**Frontend**
- `app/page.tsx` - Landing page with hero
- `app/register/page.tsx` - Signup form
- `app/deals/page.tsx` - Deal grid with filters
- `app/deals/[id]/page.tsx` - Deal details & claim button
- `app/dashboard/page.tsx` - User dashboard & claims history
- `lib/api.ts` - API client with JWT handling
- `lib/store.ts` - Auth state management

## API Endpoints

```
POST   /api/auth/register              - Create account
POST   /api/auth/login                 - Login
POST   /api/auth/verify-email          - Verify token
GET    /api/auth/me                    - Get profile (auth required)
PUT    /api/auth/profile               - Update profile (auth required)

GET    /api/deals                      - List deals (with filters)
GET    /api/deals/:id                  - Get deal details
POST   /api/deals/:id/claim            - Claim deal (auth required)

GET    /api/claims                     - Get user's claims (auth required)
GET    /api/claims/:id                 - Get claim details (auth required)
GET    /api/claims/stats/overview      - Get stats (auth required)
```

## Next Steps

1. **Customize**: Update colors in `frontend/tailwind.config.ts`
2. **Add Deals**: Use MongoDB interface or seed script
3. **Email Verification**: Integrate SendGrid for real emails
4. **Deploy**: See `DEPLOYMENT.md` for Render/Vercel setup
5. **Styling**: Modify Tailwind classes in components

## Need Help?

1. Check `README.md` for detailed documentation
2. Review `DEPLOYMENT.md` for production setup
3. Check console logs for error messages
4. Verify `.env` files have correct values

Happy coding! 🚀
