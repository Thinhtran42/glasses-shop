# 🚀 Deploy to Vercel Guide

## 📋 Prerequisites

1. **Google Maps API Key**
   - Get from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Maps JavaScript API"
   - Follow guide in `GOOGLE_MAPS_SETUP.md`

## 🔧 Environment Variables

### For Vercel Deployment:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🚀 Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variables in Vercel dashboard:
   - `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps API key

### 3. Deploy via CLI (Alternative)
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add VITE_GOOGLE_MAPS_API_KEY
```

## ⚙️ Build Configuration

The project uses Vite and is configured for Vercel with:
- Framework: `vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `18.x`

## 🔍 Important Notes

1. **Environment Variables**: Make sure to set `VITE_GOOGLE_MAPS_API_KEY` in Vercel dashboard
2. **Domain Restrictions**: Update Google Maps API key restrictions to include your Vercel domain
3. **HTTPS**: Vercel automatically provides HTTPS
4. **Build Time**: First build might take longer due to AI dependencies (TensorFlow.js, face-api.js)

## 🌐 Post-Deployment

1. Update Google Maps API key restrictions to include your new domain
2. Test all features including virtual try-on
3. Check browser console for any errors
