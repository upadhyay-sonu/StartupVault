# Deployment Guide

Complete step-by-step guide to deploy Startup Vault to production.

## Prerequisites

- GitHub account (for code hosting)
- MongoDB Atlas account (free tier works)
- Vercel account (for frontend)
- Render or Railway account (for backend)

---

## 1. Prepare Your Codebase

### Backend Changes

1. Update `backend/package.json` scripts for production:
   ```json
   {
     "build": "tsc",
     "start": "node dist/index.js",
     "seed": "ts-node src/scripts/seedDeals.ts"
   }
   ```

2. Create `.gitignore` for backend:
   ```
   node_modules/
   dist/
   .env
   .DS_Store
   ```

3. Update backend `src/index.ts` to log startup clearly:
   ```typescript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`🚀 Server running on port ${PORT}`);
   });
   ```

### Frontend Changes

1. Update `frontend/.gitignore`:
   ```
   node_modules/
   .next/
   .env.local
   ```

2. Ensure `frontend/next.config.js` has proper config for deployment

---

## 2. Deploy Backend (Render.com example)

### Step 1: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free tier cluster
3. Create database user (save credentials)
4. Add current IP to whitelist
5. Copy connection string: `mongodb+srv://user:password@cluster.mongodb.net/database`

### Step 2: Push Backend to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/startup-vault-backend.git
git push -u origin main
```

### Step 3: Deploy to Render

1. Visit [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository (startup-vault-backend)
4. Configure:
   - **Name**: startup-vault-backend
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to users

5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
   JWT_SECRET=generate_strong_random_string_here
   NODE_ENV=production
   PORT=10000 (or whatever Render assigns)
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   VERIFICATION_TOKEN_EXPIRY=86400
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Get deployed URL: `https://startup-vault-backend.onrender.com`

### Step 4: Seed Initial Data

After successful deployment:
```bash
# Run seed script on production database
npm run seed
```

Or manually insert sample deals via MongoDB Atlas interface.

---

## 3. Deploy Frontend (Vercel)

### Step 1: Push Frontend to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/startup-vault-frontend.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New +" → "Project"
4. Import your startup-vault-frontend repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://startup-vault-backend.onrender.com/api
   ```

7. Click "Deploy"
8. Get deployed URL: `https://startup-vault-frontend.vercel.app`

### Step 3: Update Backend FRONTEND_URL

In Render dashboard for backend service:
1. Go to Environment Variables
2. Update `FRONTEND_URL` to your Vercel URL
3. Service auto-restarts

---

## 4. Database Verification

### MongoDB Atlas Checks

1. Login to MongoDB Atlas
2. Go to Collections
3. Verify documents exist:
   - `users` collection (if you registered)
   - `deals` collection (if you seeded)
   - `claims` collection

### Sample Query to Verify Data

```mongodb
db.deals.find().limit(1)
db.users.countDocuments()
db.claims.countDocuments()
```

---

## 5. Test Production Application

### Full User Flow Test

1. **Visit**: https://your-frontend.vercel.app
2. **Register**: Create new account
3. **Check Console**: See verification token (in production, email sent)
4. **Verify**: Use token to verify email
5. **Login**: Login with credentials
6. **Browse Deals**: View public and verified deals
7. **Claim Deal**: Click deal → Claim → Get code
8. **Dashboard**: View claimed deals with status
9. **Edit Profile**: Update name/company/role

### API Testing (Postman/curl)

```bash
# Register
curl -X POST https://your-backend/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@startup.com","password":"testpass123","name":"Test"}'

# Login
curl -X POST https://your-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@startup.com","password":"testpass123"}'

# Get deals
curl https://your-backend/api/deals

# Get user profile (requires token)
curl -H "Authorization: Bearer {token}" \
  https://your-backend/api/auth/me
```

---

## 6. Production Checklist

### Security
- [ ] JWT_SECRET is strong random string (32+ characters)
- [ ] Database credentials never in code
- [ ] HTTPS enforced everywhere
- [ ] CORS properly configured
- [ ] No console.log with sensitive data in production code

### Database
- [ ] MongoDB indexes created (automatic with Mongoose)
- [ ] Backup configured in MongoDB Atlas
- [ ] IP whitelist includes deployment IPs only
- [ ] Automatic scaling enabled if needed

### Frontend
- [ ] Environment variables set in Vercel
- [ ] API URL points to production backend
- [ ] No development console errors
- [ ] Images optimized for production
- [ ] Meta tags updated with correct domain

### Backend
- [ ] Error handling doesn't leak sensitive info
- [ ] Rate limiting considered for endpoints
- [ ] Request validation implemented
- [ ] Database connection pooling enabled
- [ ] Proper logging (without passwords/tokens)

### Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Enable database monitoring in MongoDB Atlas
- [ ] Monitor frontend performance (Vercel Analytics)
- [ ] Set up alerts for failures

---

## 7. Custom Domain Setup

### Bind Domain to Vercel Frontend

1. In Vercel Dashboard:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records with instructions provided

2. Example DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Bind Domain to Render Backend

1. In Render Dashboard:
   - Go to Service → Settings → Custom Domain
   - Add your custom domain (e.g., api.yourdomain.com)
   - Update DNS with provided values

---

## 8. Email Verification Setup (Optional but Recommended)

### Using SendGrid

1. Create SendGrid account (free tier available)
2. Get API key
3. In backend, install nodemailer:
   ```bash
   npm install nodemailer @sendgrid/mail
   ```

4. Update `backend/src/routes/auth.ts`:
   ```typescript
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   // In register route, after user.save():
   const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
   
   await sgMail.send({
     to: user.email,
     from: 'noreply@startupsault.com',
     subject: 'Verify Your Email',
     html: `Click here to verify: <a href="${verificationLink}">${verificationLink}</a>`
   });
   ```

5. Add to Render environment:
   ```
   SENDGRID_API_KEY=your_api_key
   ```

---

## 9. Troubleshooting Common Issues

### Frontend Can't Connect to Backend

**Symptom**: CORS error in console
**Fix**:
1. Check `NEXT_PUBLIC_API_URL` matches deployed backend
2. Verify CORS config in backend includes frontend domain
3. Ensure backend is running: `https://your-backend/health`

### Database Connection Fails

**Symptom**: 500 errors on API calls
**Fix**:
1. Verify MongoDB URI in Render environment
2. Check IP whitelist in MongoDB Atlas includes Render IPs
3. Test connection: `ping cluster0.mongodb.net`

### Seed Script Doesn't Work

**Symptom**: No deals in database
**Fix**:
1. Run seed locally with production URI:
   ```bash
   MONGODB_URI=production_uri npm run seed
   ```
2. Or manually insert via MongoDB Atlas UI
3. Verify deals created: `db.deals.countDocuments()`

### Email Verification Not Working

**Symptom**: Token appears valid but verification fails
**Fix**:
1. Check token expiry time (default 24 hours)
2. Verify token stored correctly in database
3. Check `VERIFICATION_TOKEN_EXPIRY` env var

### Claims Not Saving

**Symptom**: Claim button works but claim doesn't appear
**Fix**:
1. Check MongoDB compound index on Claim model
2. Verify user authenticated (check token in localStorage)
3. Check browser console for API errors

---

## 10. Post-Deployment Maintenance

### Weekly Tasks
- Monitor application logs in Render/Vercel
- Check error tracking (Sentry)
- Review database growth

### Monthly Tasks
- Update dependencies: `npm update`
- Review and rotate JWT_SECRET
- Backup MongoDB database
- Review security logs

### Quarterly Tasks
- Performance optimization
- Update certificates (auto with HTTPS)
- Review and update deployment strategy

---

## 11. Scaling Considerations

When application grows:

### Database
- Upgrade MongoDB tier for better performance
- Implement caching (Redis) for deal listings
- Consider database sharding for claims collection

### Backend
- Enable auto-scaling in Render
- Add API rate limiting
- Implement request caching

### Frontend
- Enable Vercel Image Optimization
- Use Next.js Incremental Static Regeneration (ISR)
- Implement service workers for offline support

---

## Support

For deployment issues:
- Check Render/Vercel documentation
- Review MongoDB Atlas docs
- Check application logs in respective dashboards
- Open GitHub issues with error logs

