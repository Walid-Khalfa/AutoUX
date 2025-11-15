# 🚀 Quick Deployment Guide for Kiroween Submission

**Goal:** Deploy AutoUX to production in 1-2 hours

---

## Option 1: Vercel + Railway (RECOMMENDED) ⚡

### Frontend on Vercel (15 minutes)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Deploy Frontend**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Navigate to frontend
   cd frontend
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     ```
     VITE_API_BASE_URL=https://your-backend-url.railway.app/api
     VITE_REGISTRY_ADDRESS=0x77b0ea1456EAD5d3F0898Dd5e5Cf26531f0DAfdf
     VITE_NFT_ADDRESS=0xdCEa73e8bce67F19A900F4af3CDa126B3DA34857
     VITE_CHAIN_NAME=Sepolia
     VITE_CHAIN_ID=11155111
     VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
     VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo
     ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

**Result:** Frontend URL (e.g., `https://autoux.vercel.app`)

---

### Backend on Railway (20 minutes)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your AutoUX repository
   - Select `backend` as root directory

3. **Configure Environment Variables**
   - In Railway dashboard, go to Variables
   - Add:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     GEMINI_MODEL=gemini-2.5-flash
     AI_PROVIDER=gemini
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     NODE_ENV=production
     PORT=3001
     ```

4. **Configure Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Deploy**
   - Railway will auto-deploy
   - Get your backend URL (e.g., `https://autoux-backend.railway.app`)

6. **Update Frontend**
   - Go back to Vercel
   - Update `VITE_API_BASE_URL` with Railway URL
   - Redeploy

**Result:** Backend URL (e.g., `https://autoux-backend.railway.app`)

---

## Option 2: Netlify + Heroku (Alternative)

### Frontend on Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Deploy**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub repository
   - Configure:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`

3. **Environment Variables**
   - Same as Vercel (see above)

### Backend on Heroku

1. **Create Heroku Account**
   - Go to https://heroku.com
   - Sign up

2. **Install Heroku CLI**
   ```bash
   # Windows
   winget install Heroku.HerokuCLI
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Deploy**
   ```bash
   # Login
   heroku login
   
   # Create app
   heroku create autoux-backend
   
   # Set environment variables
   heroku config:set GEMINI_API_KEY=your_key
   heroku config:set AI_PROVIDER=gemini
   heroku config:set CORS_ORIGIN=https://your-netlify-url.netlify.app
   heroku config:set NODE_ENV=production
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

---

## Option 3: Docker on DigitalOcean (Advanced)

### Prerequisites
- Docker installed
- DigitalOcean account

### Steps

1. **Create Dockerfiles** (already provided in DEPLOYMENT.md)

2. **Build and Push**
   ```bash
   # Build images
   docker build -t autoux-frontend ./frontend
   docker build -t autoux-backend ./backend
   
   # Push to Docker Hub
   docker push yourusername/autoux-frontend
   docker push yourusername/autoux-backend
   ```

3. **Deploy on DigitalOcean**
   - Create Droplet
   - Install Docker
   - Pull and run images

---

## 🔧 Post-Deployment Checklist

### 1. Test Frontend
- [ ] Visit frontend URL
- [ ] Check if page loads
- [ ] Test file upload
- [ ] Verify API connection

### 2. Test Backend
- [ ] Visit `https://your-backend-url/health`
- [ ] Should return `{"status":"ok"}`
- [ ] Check logs for errors

### 3. Test Full Flow
- [ ] Upload a log file
- [ ] Wait for AI analysis
- [ ] Check if dashboard displays
- [ ] Verify recommendations
- [ ] Test Web3 features (optional)

### 4. Update README
- [ ] Add live demo URL
- [ ] Add deployment status badges
- [ ] Update installation instructions

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** "Failed to fetch" error
**Solution:** Check CORS_ORIGIN in backend matches frontend URL

**Problem:** Web3 not working
**Solution:** Ensure contract addresses are correct in .env

### Backend Issues

**Problem:** "GEMINI_API_KEY not found"
**Solution:** Add environment variable in Railway/Heroku

**Problem:** 502 Bad Gateway
**Solution:** Check backend logs, ensure PORT is set correctly

---

## 📝 Submission URLs Template

Once deployed, fill in:

```
Frontend URL: https://autoux.vercel.app
Backend URL: https://autoux-backend.railway.app
Health Check: https://autoux-backend.railway.app/health
GitHub Repo: https://github.com/yourusername/autoux
Demo Video: https://youtube.com/watch?v=YOUR_VIDEO_ID
```

---

## ⚡ Super Quick Deploy (30 minutes)

If you're really short on time:

1. **Vercel for Frontend** (10 min)
   ```bash
   cd frontend
   vercel --prod
   ```

2. **Railway for Backend** (15 min)
   - Connect GitHub repo
   - Set environment variables
   - Deploy

3. **Test** (5 min)
   - Upload file
   - Verify it works

**Done!** 🎉

---

## 🎯 Deployment Priority

For Kiroween submission, you need:

1. ✅ **Frontend URL** (REQUIRED)
2. ✅ **Backend URL** (REQUIRED)
3. ⚠️ **Custom Domain** (OPTIONAL)
4. ⚠️ **HTTPS** (Auto-enabled on Vercel/Railway)
5. ⚠️ **Web3 Features** (OPTIONAL - already deployed on Sepolia)

**Minimum Viable Deployment:**
- Frontend on Vercel
- Backend on Railway
- Both with environment variables configured

**Time:** 35 minutes total

---

## 🔐 Security Notes

### Before Deploying

1. **Regenerate API Keys** (if exposed in chat)
   - New Gemini key
   - New OpenRouter key (if used)

2. **Check .gitignore**
   - Ensure .env files are not committed
   - Verify no secrets in code

3. **Update CORS**
   - Set to your actual frontend URL
   - Remove localhost in production

### After Deploying

1. **Monitor Logs**
   - Check for errors
   - Watch for suspicious activity

2. **Set Up Alerts**
   - Railway/Vercel have built-in monitoring
   - Enable email notifications

---

## 📊 Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Health check endpoint works
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] File upload works
- [ ] AI analysis works
- [ ] Dashboard displays correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] URLs added to submission form

---

**Ready to deploy? Let's go! 🚀**

Choose Option 1 (Vercel + Railway) for the fastest deployment.
