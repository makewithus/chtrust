# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed (already done)

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy the Project
```bash
vercel --prod
```

### 3. Configure Environment Variables on Vercel
After deployment, you need to add your environment variables in the Vercel dashboard:

1. Go to your project on Vercel dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:

```
PORT=3000
NEXT_PUBLIC_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
NEXT_PUBLIC_EMAILJS_SERVICE_ID=<YOUR_EMAILJS_SERVICE_ID>
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=<YOUR_EMAILJS_TEMPLATE_ID>
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=<YOUR_EMAILJS_PUBLIC_KEY>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<YOUR_CLOUDINARY_UPLOAD_PRESET>
RAZORPAY_KEY_ID=<YOUR_RAZORPAY_KEY_ID>
```

### 4. Redeploy After Adding Environment Variables
```bash
vercel --prod
```

## Important Notes

- The `vercel.json` file is already configured
- Environment variables from `.env` won't be automatically deployed (you must add them manually in Vercel dashboard)
- Static files are served directly, API routes go through `server.js`
- The server automatically detects Vercel environment and won't call `app.listen()`

## Custom Domain (Optional)
1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Issue: 404 errors
- Check that `vercel.json` routes are correct
- Ensure all static files are committed to git

### Issue: Environment variables not working
- Double-check they're added in Vercel dashboard
- Redeploy after adding variables

### Issue: API routes not working
- Check server.js exports the app: `module.exports = app`
- Verify routes in vercel.json match your endpoints

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove a deployment
vercel remove [deployment-url]
```
