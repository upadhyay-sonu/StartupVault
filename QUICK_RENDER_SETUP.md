# Quick Render Setup - 5 Minute Deployment

## Pre-Requisites (5 minutes)
```bash
# 1. Generate JWT Secret
openssl rand -base64 32

# 2. Get MongoDB Atlas URI
# Sign up at mongodb.com/cloud/atlas
# Create cluster → get connection string
```

## Render Setup (5 minutes)

### Step 1: Create Web Service
- Go to render.com
- New → Web Service
- Connect GitHub repo
- Select `main` branch

### Step 2: Configure Build
```
Name:          startup-vault-backend
Root:          backend/
Build:         npm install && npm run build
Start:         npm start
Environment:   Node 18
```

### Step 3: Add Environment Variables
```
MONGODB_URI        = mongodb+srv://user:pass@cluster.abc123.mongodb.net/startup-vault?appName=Cluster0
JWT_SECRET         = [your generated secret from step 1]
NODE_ENV           = production
FRONTEND_URL       = https://your-frontend.onrender.com
VERIFICATION_TOKEN_EXPIRY = 86400
```

### Step 4: Deploy
Click "Deploy" and wait ~2 minutes

### Step 5: Verify
```bash
curl https://startup-vault-backend.onrender.com/health
# Response: {"status":"ok"}
```

---

## Done! 🎉

Your backend is now live on Render.

Next: Update frontend API URL to:
```
https://startup-vault-backend.onrender.com/api
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check npm install works locally |
| MongoDB error | Verify MONGODB_URI is correct |
| Health check fails | Check logs in Render dashboard |
| CORS error | Update FRONTEND_URL env var |

---

## Useful Commands

```bash
# Check build locally
cd backend && npm install && npm run build

# Generate new JWT secret
openssl rand -base64 32

# View Render logs
# Render Dashboard → Web Service → Logs tab
```

---

**Status: ✅ PRODUCTION READY**

Estimated setup time: 10 minutes  
Backend deployment: 100% automated
