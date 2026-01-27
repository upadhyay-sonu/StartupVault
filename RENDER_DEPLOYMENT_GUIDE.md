# Render Deployment Guide - Backend (Node.js + Express + MongoDB)

## Pre-Deployment Checklist

- ✅ TypeScript compiles without errors (`npm run build`)
- ✅ All environment variables documented
- ✅ MongoDB Atlas cluster configured and running
- ✅ Git repository with latest code committed
- ✅ Lock files tracked (`package-lock.json`)

---

## Step 1: Prepare MongoDB Atlas

### Create a MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Create a new cluster (free tier available)
4. Create a database user with username & password
5. Get the connection string

### Connection String Format
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?appName=<appname>
```

Example:
```
mongodb+srv://user:password@cluster0.abc123.mongodb.net/startup-vault?appName=Cluster0
```

**Save this for Render environment variables.**

---

## Step 2: Generate JWT Secret

### Create a Strong JWT Secret
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Max 256}))
```

**Example output:**
```
kT9mPqL2X5vN7bR4FjH8wS6yU1oC3dE9zG0aB2kM5nQ
```

**Save this for Render environment variables.**

---

## Step 3: Create Render Web Service

### Connect Repository
1. Go to [Render Dashboard](https://render.com)
2. Click **New +** → **Web Service**
3. Select **Build and deploy from a Git repository**
4. Connect your GitHub account
5. Select repository: `StartupVault`
6. Select branch: `main`

### Configure Build Settings
```
Name:              startup-vault-backend
Region:            US (or closest to you)
Branch:            main
Root Directory:    backend/

Build Command:     npm install && npm run build
Start Command:     npm start

Environment:       Node
Node Version:      18
```

---

## Step 4: Add Environment Variables

### In Render Dashboard
1. Go to your Web Service
2. Click **Environment**
3. Add each variable individually:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://user:password@cluster0.abc123.mongodb.net/startup-vault?appName=Cluster0` | From MongoDB Atlas |
| `JWT_SECRET` | `kT9mPqL2X5vN7bR4FjH8wS6yU1oC3dE9zG0aB2kM5nQ` | Generate with openssl |
| `NODE_ENV` | `production` | Critical for performance |
| `PORT` | *(empty - Render sets automatically)* | Or set to `10000` if needed |
| `FRONTEND_URL` | `https://startup-vault-frontend.onrender.com` | Update with your frontend URL |
| `VERIFICATION_TOKEN_EXPIRY` | `86400` | 24 hours in seconds (optional) |

### Security Best Practice
- Never commit `.env` files
- Never share `JWT_SECRET` in code
- Regenerate `JWT_SECRET` in production
- Use strong, unique secrets for each environment

---

## Step 5: Deploy

### Manual Deploy
1. In Render dashboard, click **Deploy**
2. Watch build logs for errors
3. Server should show "Live" when successful

### Auto-Deploy
1. Go to **Settings** → **Auto-Deploy**
2. Select **Yes** for auto-deployment on push to main branch
3. All future pushes to `main` will trigger automatic deployments

---

## Step 6: Verify Deployment

### Check Health Endpoint
```bash
curl https://startup-vault-backend.onrender.com/health

# Expected response:
{"status":"ok"}
```

### View Live Logs
In Render Dashboard:
1. Go to your Web Service
2. Click **Logs** (top right)
3. Watch real-time logs as requests come in

### Monitor Performance
- Render provides CPU, Memory, Disk usage metrics
- Check **Metrics** tab for performance

---

## Step 7: Connect Frontend

### Update Frontend API URL
In `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://startup-vault-backend.onrender.com/api
```

Or configure in Render environment for frontend service:
```
NEXT_PUBLIC_API_URL=https://startup-vault-backend.onrender.com/api
```

---

## Expected Build Output

### Successful Build
```
Building...
npm notice
npm notice
npm warn deprecated ...
npm WARN ...

> startup-vault-backend@1.0.0 build
> tsc

npm notice
npm WARN lifecycle ...

✓ Build successful
```

### Successful Startup
```
MongoDB connected successfully
Server running on port 10000
```

### Health Check Success
```
GET /health
{"status":"ok"}
HTTP 200 OK
```

---

## Troubleshooting

### Build Fails: "npm ERR!"
**Solution:** Check package-lock.json is tracked in Git
```bash
git ls-files | grep package-lock.json
# Should show: backend/package-lock.json
```

### Build Fails: "TypeScript error"
**Solution:** Run locally to verify
```bash
cd backend
npm install
npm run build
```

### Server Won't Start: "MONGODB_URI is not defined"
**Solution:** Verify environment variable is set in Render
1. Go to Render Dashboard → Web Service
2. Click **Environment**
3. Confirm `MONGODB_URI` is present with correct value
4. Re-deploy

### Server Won't Start: "Port already in use"
**Solution:** Remove hardcoded port (Render sets `PORT` automatically)
- Current code is correct: `const PORT = process.env.PORT || 5000`
- No changes needed

### Health Check Fails
**Solution:** Check logs and verify MongoDB connection
```bash
# Check logs in Render Dashboard
# Look for "MongoDB connected successfully" message
```

### CORS Error on Frontend
**Solution:** Update `FRONTEND_URL` environment variable
1. Frontend URL should be exact (with or without trailing slash)
2. Re-deploy backend after updating

---

## Monitoring & Maintenance

### Recommended Health Checks
**In Render Dashboard → Settings:**
```
Health Check Path: /health
Check Interval:    10 seconds
Health Check Timeout: 5 seconds
```

### Enable Auto-Restart on Failure
**In Render Dashboard → Settings:**
- Enable **Auto-restart service if it stops responding**

### Monitor Error Logs
Regularly check **Logs** tab for:
- MongoDB connection issues
- JWT verification failures
- Validation errors

### Backup Database
MongoDB Atlas provides:
- Automatic backups (daily)
- Manual backups
- Backup download options

---

## Database Connection Verification

### Test Connection Manually
In Render Logs, should see:
```
MongoDB connected successfully
```

### Verify Database Access
```bash
# From your local machine with proper IP whitelist:
mongosh "<MONGODB_URI>"

# Then:
show dbs
use startup-vault
show collections
```

---

## Security Checklist

- ✅ `JWT_SECRET` is strong and random
- ✅ `MONGODB_URI` credentials are secure
- ✅ `.env` files are in `.gitignore`
- ✅ CORS `FRONTEND_URL` is set to actual domain
- ✅ MongoDB Atlas has IP whitelist configured (allow Render IPs)
- ✅ `NODE_ENV=production` is set
- ✅ No secrets in code or git history
- ✅ HTTPS is enforced by Render

---

## Performance Optimization

### Recommended Render Settings
```
Plan:              Starter (free) or higher
CPU:               Shared or dedicated (monitor usage)
Memory:            512MB (minimum for Node.js)
Auto-scale:        Enable if upgrading to paid plan
```

### MongoDB Atlas Settings
```
Instance Size:     Free tier (M0) for testing
                   M2 or M5 for production
Region:            Same as Render region (if possible)
```

---

## Success Metrics

✅ Backend is production-ready when:
1. Build completes without errors
2. `/health` endpoint returns `{"status":"ok"}`
3. MongoDB connection successful
4. Frontend API calls succeed
5. JWT authentication works
6. No errors in logs (or only expected warnings)

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Verify health endpoint
3. ✅ Update frontend API URL
4. ✅ Deploy frontend to Render
5. ✅ Test end-to-end authentication flow
6. ✅ Monitor logs for errors
7. ✅ Set up monitoring alerts

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

**Backend Deployment Status: ✅ READY FOR PRODUCTION**
