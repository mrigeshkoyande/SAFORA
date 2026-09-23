# 🚀 Angel AI — Universal Deployment & CI/CD Guide

This document details the exact production deployment pipelines for running **Angel AI** across modern cloud infrastructures, static hosting providers, and native mobile distribution channels.

---

## 🌐 1. Frontend Web App (Vercel / Netlify / Cloudflare Pages)

The frontend (`Angle-AI/Angel-AI`) is a single-page React + Vite application equipped with Progressive Web App (PWA) Workbox caching.

### Vercel Deployment (Recommended)
1. Import your GitHub repository (`mrigeshkoyande/Angle-AI`) into [Vercel](https://vercel.com).
2. Configure the project settings:
   * **Root Directory:** `Angle-AI/Angel-AI`
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
3. Add your production environment variables in the Vercel Dashboard (`VITE_FIREBASE_API_KEY`, `VITE_API_URL`, etc.).
4. Click **Deploy**. Vercel will automatically apply our included `vercel.json` rewrite rules (`/(.*) -> /index.html`) to prevent 404 errors on deep client routes.

### Netlify Deployment
1. Connect your GitHub repository to [Netlify](https://netlify.com).
2. Set the Build settings:
   * **Base Directory:** `Angle-AI/Angel-AI`
   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist`
3. Netlify will automatically detect and respect the `public/_redirects` file (`/* /index.html 200`) included in our bundle.

---

## 🖥️ 2. Backend API Server (Render / Railway / Heroku / AWS)

The backend (`backend/`) is a Node.js + Express REST API integrated with Supabase PostgreSQL via Prisma ORM.

### Render / Railway Deployment
1. Create a new **Web Service** pointing to your repository (`backend/` directory).
2. Configure environment:
   * **Environment:** `Node`
   * **Build Command:** `npm install && npx prisma generate`
   * **Start Command:** `node server.js`
3. Add your production environment variables (`PORT`, `DATABASE_URL`, `DIRECT_URL`, `FIREBASE_PRIVATE_KEY`, `CLOUDINARY_API_KEY`, `GEMINI_API_KEY`).
4. **Database Migrations:** Prisma will automatically connect and validate schema instances against your pooled Supabase PostgreSQL database (`DATABASE_URL`).

### 💡 Keep-Alive (Prevent Sleep on Free Tiers)
Because free tier platforms like Render spin down containers after 15 minutes of inactivity:
1. We have added an automatic background **pre-warm ping** on the frontend. When a user lands on the website, the client app immediately calls the health check to start waking up the server early.
2. For permanent zero-latency wake-up, we recommend setting up a free monitor on [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com) pointing to your backend health check url:
   `https://your-backend.onrender.com/api/health` (pushed every 10–12 minutes).

---

## 📱 3. Native Android Application (Google Play Store)

1. Build the production web assets:
   ```bash
   cd Angle-AI/Angel-AI
   npm run build
   npx cap sync android
   ```
2. Open Android Studio and generate a signed release App Bundle (`.aab`):
   ```bash
   npx cap open android
   ```
3. In Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**.
4. Upload `android/app/release/app-release.aab` directly to your Google Play Console release track.

---

## 🧪 4. Automated Health Verification

After deployment, verify that both services are communicating cleanly:
* **Frontend Check:** Visit `https://your-app.vercel.app` and verify the PWA service worker registers (`sw.js`).
* **Backend Health Check:** Send a `GET` request to `https://your-backend.onrender.com/api/health`. You should receive:
  ```json
  {
    "success": true,
    "status": "operational",
    "service": "Angel AI Backend API",
    "timestamp": "2026-07-13T20:15:00.000Z"
  }
  ```
