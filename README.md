<div align="center">
  <img src="Media/APP LOGO.png" alt="SAFORA Logo" width="160" height="160" />
  <h1>SAFORA — Personal Safety & Emergency Intelligence</h1>
  <p><strong>An enterprise-grade, proactive personal safety web and mobile platform powered by AI de-escalation coaching, covert emergency triggers, and tamper-proof evidence archiving.</strong></p>

  <p>
    <a href="https://github.com/mrigeshkoyande/SAFORA"><img src="https://img.shields.io/badge/Repository-mrigeshkoyande%2FSAFORA-pink?style=for-the-badge&logo=github" alt="GitHub Repository" /></a>
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-8E75B5?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-4CAF50?style=for-the-badge" alt="Platforms" />
  </p>

  <p>
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-environment-variables">Environment Variables</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="BRAIN.md">BRAIN.md</a> •
    <a href="DESIGN.md">DESIGN.md</a>
  </p>
</div>

---

## 🌟 Executive Summary

**SAFORA** is an intelligent personal safety companion built to provide continuous proactive journey monitoring, instant emergency SOS dispatch, and real-time AI-guided crisis de-escalation.

### Why SAFORA?
Traditional safety tools rely on manual, overt actions (such as placing a phone call) which can escalate tense situations. SAFORA solves this with **covert triggers**, **silent background audio/location streaming**, and **AI-powered escape tactics**.

---

## ✨ Key Features

### 🧠 AI Features
* **AI Escape Coach:** Powered by Google Gemini 2.5 Flash for real-time, concise (<= 3 sentences) crisis advice.
* **Proactive Guardian Monitoring:** Background anomaly detection and automated route tracking.
* **Contextual Recommendations:** Smart prompts based on current location and environmental data.

### 🛡️ Safety & Crisis Management
* **Instant Emergency SOS:** 3-second hold trigger with haptic feedback and automated contact dispatch.
* **Covert / Hidden SOS:** Decoy PIN unlock that simulates normal state while quietly streaming location & audio.
* **Guardian Mode:** ETA tracking and checkpoint check-ins.
* **Dummy Call:** Realistic simulated incoming call generator to escape uncomfortable situations.

### 📁 Evidence Vault
* **Tamper-Proof Archiving:** AES-256 encrypted media uploads directly to Cloudinary storage.
* **Metadata Stamping:** Cryptographic time and GPS location stamps on captured evidence.

---

## 🏗 Architecture & Design Docs

* 🧠 **[BRAIN.md](BRAIN.md):** Deep system architecture, decision engine specifications, offline fallback strategy, and covert trigger protocols.
* 🎨 **[DESIGN.md](DESIGN.md):** SAFORA design system, color tokens, typography, glassmorphism specs, and mobile-first responsive breakpoints.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/mrigeshkoyande/SAFORA.git
cd SAFORA

# Install all workspace dependencies (root, backend, frontend)
npm run install:all
```

### 2. Run Development Server
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173/](http://localhost:5173/)
- **Backend Express API:** [http://localhost:5000/](http://localhost:5000/)

---

## 🔑 Environment Variables

Copy `.env.example` in `Angle-AI/Angel-AI/.env.example` to `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

VITE_API_URL=http://localhost:5000/api
```

*(Note: SAFORA includes a safe fallback engine so the app runs fully even if Firebase environment variables are unconfigured.)*

---

## 🌐 Deployment

### Vercel / Netlify (Frontend)
- **Root Directory:** `Angle-AI/Angel-AI`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Render / Railway (Backend)
- **Root Directory:** `backend`
- **Start Command:** `node server.js`

---

## 📄 License

This project is licensed under the MIT License.
