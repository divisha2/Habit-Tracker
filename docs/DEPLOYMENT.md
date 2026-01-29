# Deployment Guide

This guide covers deploying Zen Habits to various platforms.

## 🚀 Frontend Deployment

### Vercel (Recommended)

1. **Prepare the build**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set build command: `cd client && npm run build`
   - Set output directory: `client/dist`
   - Set root directory: `client`

3. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

### Netlify

1. **Build settings**
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`

2. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

3. **Redirects** (create `client/public/_redirects`)
   ```
   /*    /index.html   200
   ```

## 🖥️ Backend Deployment

### Railway (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository
   - Select the `server` directory as root

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zen-habit-tracker
   JWT_SECRET=your-super-secure-production-jwt-secret
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Build Settings**
   - Start command: `npm start`
   - Build command: `npm install`

### Heroku

1. **Prepare for Heroku**
   ```bash
   # Create Procfile in server directory
   echo "web: npm start" > server/Procfile
   ```

2. **Deploy**
   ```bash
   cd server
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   git subtree push --prefix server heroku main
   ```

### DigitalOcean App Platform

1. **App Spec** (create `.do/app.yaml`)
   ```yaml
   name: zen-habits-backend
   services:
   - name: api
     source_dir: /server
     github:
       repo: yourusername/zen-habits
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${MONGODB_URI}
     - key: JWT_SECRET
       value: ${JWT_SECRET}
     - key: CORS_ORIGIN
       value: https://your-frontend-domain.com
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster (free tier available)
   - Choose your preferred region

2. **Database Access**
   - Create a database user
   - Set username and password
   - Grant read/write access

3. **Network Access**
   - Add IP addresses (0.0.0.0/0 for all IPs)
   - Or add specific deployment platform IPs

4. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/zen-habit-tracker?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS
   brew install mongodb-community
   ```

2. **Configure**
   - Set up authentication
   - Configure firewall rules
   - Set up SSL/TLS (recommended)

3. **Connection String**
   ```
   mongodb://username:password@your-server:27017/zen-habit-tracker
   ```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong, unique JWT secrets
- Rotate secrets regularly
- Use different secrets for different environments

### Database Security
- Enable authentication
- Use SSL/TLS connections
- Restrict network access
- Regular backups
- Monitor access logs

### API Security
- Rate limiting (already implemented)
- CORS configuration
- Input validation
- SQL injection prevention (using Mongoose)
- XSS protection (using Helmet)

## 📊 Monitoring & Analytics

### Error Tracking
- **Sentry**: For error monitoring
- **LogRocket**: For session replay
- **Datadog**: For comprehensive monitoring

### Performance Monitoring
- **New Relic**: Application performance
- **Pingdom**: Uptime monitoring
- **Google Analytics**: User analytics

### Setup Example (Sentry)
```bash
npm install @sentry/node @sentry/react
```

**Backend (server/server.js)**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend (client/src/main.jsx)**
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd server && npm install && npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd client && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/dist

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - # Deploy to your backend platform
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGIN environment variable
   - Ensure frontend URL matches exactly
   - Include protocol (https://)

2. **Database Connection**
   - Verify MongoDB URI format
   - Check network access settings
   - Confirm credentials

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correct

### Debug Commands

```bash
# Check environment variables
printenv | grep -E "(NODE_ENV|MONGODB_URI|JWT_SECRET)"

# Test database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err));
"

# Test API endpoints
curl -X GET https://your-api-domain.com/health
```

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement code splitting
- Optimize images
- Enable browser caching

### Backend
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use compression middleware
- Enable HTTP/2

### Database
- Create proper indexes
- Use aggregation pipelines
- Implement data archiving
- Monitor query performance
- Regular maintenance

---

For more specific deployment questions, check the platform documentation or create an issue in the repository.