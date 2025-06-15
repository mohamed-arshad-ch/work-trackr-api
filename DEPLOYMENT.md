# WorkTrackr API - Vercel Deployment Guide

## 🚀 Deploying to Vercel

This guide explains how to deploy the WorkTrackr API to Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Ensure your database is accessible from the internet

### Environment Variables

Set these environment variables in your Vercel project settings:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="production"
MAX_FILE_SIZE="2097152"
UPLOAD_PATH="uploads/logos"
```

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Project Configuration

The project includes these Vercel-specific files:

- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function entry point
- `public/.gitkeep` - Required public directory
- `.vercelignore` - Files to exclude from deployment

### API Endpoints

After deployment, your API will be available at:

```
https://your-project-name.vercel.app/api/auth/register
https://your-project-name.vercel.app/api/auth/login
https://your-project-name.vercel.app/api/user/profile
# ... etc
```

### Important Notes

1. **File Uploads**: In production, consider using cloud storage (AWS S3, Cloudinary) instead of local file storage
2. **Database**: Ensure your PostgreSQL database allows connections from Vercel's IP ranges
3. **Environment Variables**: Never commit sensitive environment variables to your repository
4. **CORS**: Update CORS settings if your frontend is on a different domain

### Troubleshooting

#### Common Issues

1. **"No Output Directory named 'public' found"**
   - ✅ Fixed: We created a `public` directory with `.gitkeep`

2. **Database Connection Issues**
   - Check your `DATABASE_URL` environment variable
   - Ensure your database allows external connections
   - Verify SSL settings in your connection string

3. **JWT Token Issues**
   - Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
   - Ensure secrets are different for access and refresh tokens

4. **File Upload Issues**
   - Consider using cloud storage for production
   - Vercel has file size limits for serverless functions

### Performance Optimization

1. **Database Connection Pooling**: Use connection pooling for better performance
2. **Caching**: Implement Redis or similar for session management
3. **CDN**: Use Vercel's CDN for static assets

### Monitoring

- Use Vercel's built-in analytics
- Monitor function execution times
- Set up error tracking (Sentry, etc.)

### Security Checklist

- ✅ Environment variables configured
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ CORS configured properly
- ✅ JWT secrets are secure
- ✅ Database connection is secure
- ✅ Input validation enabled
- ✅ Rate limiting considered

### Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Check function logs for runtime errors 