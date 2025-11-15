# AutoUX Deployment Guide

This guide covers deploying AutoUX to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Building for Production](#building-for-production)
- [Deployment Options](#deployment-options)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- All dependencies installed (`npm install`)
- Environment variables configured
- API keys for OpenRouter
- (Optional) Deployed smart contracts on Sepolia testnet

## Environment Configuration

### Backend Environment Variables

Create a `backend/.env` file with the following variables:

```env
# Required
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free

# Required - Set to your frontend URL
CORS_ORIGIN=https://yourdomain.com

# Optional
PORT=3001
NODE_ENV=production
LOG_LEVEL=INFO
```

### Frontend Environment Variables

Create a `frontend/.env` file with the following variables:

```env
# Required - Your backend API URL
VITE_API_BASE_URL=https://api.yourdomain.com/api

# Web3 Configuration (Optional)
VITE_REGISTRY_ADDRESS=your_registry_contract_address
VITE_NFT_ADDRESS=your_nft_contract_address
VITE_CHAIN_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# IPFS Configuration (Optional)
VITE_IPFS_PROJECT_ID=
VITE_IPFS_PROJECT_SECRET=
```

## Building for Production

### 1. Build Frontend

```bash
# From project root
npm run build

# Or from frontend directory
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist/`.

### 2. Test Production Build Locally

```bash
# From project root
npm run preview

# Or from frontend directory
cd frontend
npm run preview
```

This serves the production build locally at `http://localhost:4173`.

### 3. Backend (No Build Required)

The backend is Node.js and doesn't require a build step. Just ensure environment variables are set correctly.

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Backend Deployment

1. **Copy backend files to server:**
   ```bash
   scp -r backend/ user@your-server:/var/www/autoux/
   ```

2. **Install dependencies:**
   ```bash
   ssh user@your-server
   cd /var/www/autoux/backend
   npm install --production
   ```

3. **Set up environment variables:**
   ```bash
   nano .env
   # Add your production environment variables
   ```

4. **Use PM2 to run the backend:**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name autoux-backend
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Frontend Deployment

1. **Copy built files to server:**
   ```bash
   scp -r frontend/dist/ user@your-server:/var/www/autoux/frontend/
   ```

2. **Set up Nginx to serve static files:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/autoux/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Option 2: Vercel (Frontend Only)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard**

### Option 3: Heroku

#### Backend on Heroku

1. **Create Heroku app:**
   ```bash
   heroku create autoux-backend
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set OPENROUTER_API_KEY=your_key
   heroku config:set CORS_ORIGIN=https://yourdomain.com
   heroku config:set NODE_ENV=production
   ```

3. **Create Procfile:**
   ```
   web: node backend/src/server.js
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 4: Docker

#### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - CORS_ORIGIN=${CORS_ORIGIN}
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

Deploy with:
```bash
docker-compose up -d
```

## Post-Deployment

### 1. Verify Backend Health

```bash
curl https://api.yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T..."
}
```

### 2. Test Frontend

Visit your frontend URL and:
- Upload a sample log file
- Verify AI analysis works
- Check Web3 features (if enabled)

### 3. Monitor Logs

#### PM2 Logs
```bash
pm2 logs autoux-backend
```

#### Docker Logs
```bash
docker-compose logs -f
```

### 4. Set Up SSL/TLS

Use Let's Encrypt with Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Security Checklist

- [ ] All API keys are in environment variables (not committed to git)
- [ ] `.env` files are in `.gitignore`
- [ ] CORS is configured to only allow your frontend domain
- [ ] Rate limiting is enabled (10 requests/minute per IP)
- [ ] Security headers are enabled (CSP, X-Frame-Options, etc.)
- [ ] SSL/TLS certificates are installed
- [ ] Firewall is configured to only allow necessary ports
- [ ] Backend logs are monitored for errors
- [ ] Regular security updates are applied

## Performance Optimization

### Frontend

- Vite automatically optimizes the build with:
  - Code splitting
  - Tree shaking
  - Minification
  - Asset optimization

### Backend

- Use PM2 cluster mode for multiple instances:
  ```bash
  pm2 start src/server.js -i max --name autoux-backend
  ```

- Enable compression in Express (already configured)
- Use Redis for caching (optional enhancement)

## Troubleshooting

### Backend won't start

1. Check environment variables are set correctly
2. Verify OpenRouter API key is valid
3. Check logs: `pm2 logs autoux-backend`
4. Ensure port 3001 is not in use

### Frontend can't connect to backend

1. Verify `VITE_API_BASE_URL` is set correctly
2. Check CORS configuration in backend
3. Verify backend is running and accessible
4. Check browser console for errors

### AI analysis fails

1. Verify OpenRouter API key is valid
2. Check backend logs for LLM errors
3. Ensure file format is supported
4. Check rate limits haven't been exceeded

### Web3 features not working

1. Verify contract addresses are correct
2. Check user has MetaMask installed
3. Ensure user is on Sepolia testnet
4. Verify contracts are deployed and verified

## Monitoring

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Log Management**: Papertrail, Loggly
- **Performance**: New Relic, DataDog

### Key Metrics to Monitor

- Backend response times
- API error rates
- LLM analysis success rate
- Frontend load times
- User engagement metrics

## Backup and Recovery

### Database (if added later)

- Set up automated daily backups
- Test restore procedures regularly

### Configuration

- Keep `.env.example` files updated
- Document all environment variables
- Store secrets in a secure vault (e.g., AWS Secrets Manager)

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Run multiple backend instances with PM2 cluster mode
- Consider serverless functions for API endpoints

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize LLM timeout and retry settings
- Implement caching layer (Redis)

## Support

For deployment issues:
- Check GitHub Issues
- Review logs carefully
- Verify all environment variables
- Test locally with production build first

## License

MIT License - See LICENSE file for details
