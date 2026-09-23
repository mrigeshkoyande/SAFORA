# 🧠 SAFORA — System Architecture & Brain Documentation

> **SAFORA (Safety & AI Personal Protection Companion)**
> Architectural blueprint, decision engine specifications, emergency trigger protocols, and data flow models.

---

## 🏛️ 1. Architecture Overview

SAFORA is structured around a **decoupled, event-driven hybrid architecture** designed for sub-second emergency response, high availability, and offline resiliency.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SAFORA Client Layer                             │
│    (React 19 + TypeScript + TailwindCSS + Capacitor Native Bridge)    │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        Local Safety State Engine     │  │    Platform Abstraction      │
│  - Reactive App Context              │  │  - Haptics Service           │
│  - Local Storage Vault Backup        │  │  - GPS Geolocation           │
│  - Emergency Trigger Handlers        │  │  - Native Camera & Audio     │
└───────────────────┬──────────────────┘  └──────────────┬───────────────┘
                    │                                    │
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SAFORA Express API Gateway                      │
│                  - Authentication & JWT Middleware                     │
│                  - Emergency SOS Dispatch Engine                       │
│                  - Evidence Vault Encrypted Pipeline                   │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│      Google Gemini 2.5 Flash AI       │  │    Database & CDN Storage    │
│  - Real-time Crisis De-escalation    │  │  - Supabase PostgreSQL       │
│  - Threat Level Classification       │  │  - Prisma ORM Schema         │
│  - Tactical Escape Guidance          │  │  - Cloudinary Media Vault    │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## ⚡ 2. Emergency Trigger Protocol (Covert SOS Engine)

The Emergency SOS system supports three discrete operation modes:

### A. Overt SOS (Standard)
1. User holds the SOS button for **3 seconds**.
2. A 3-second visual countdown commences with heavy haptic feedback.
3. If uncancelled, `sosApi.triggerSOS()` dispatches an emergency broadcast payload to all designated contacts in the **Guardian Circle**.
4. Audio recording initiates in the background and is encrypted in local cache.

### B. Covert / Hidden SOS (Silent Trigger)
- **Fake PIN Decoy:** Entering a user-configured decoy PIN opens a simulated normal state interface while quietly initiating background location streaming and silent audio recording.
- **Panic Gesture:** Multi-click side key or gesture pattern bypasses visual countdowns and dispatches immediate silent alerts without altering the screen state.

---

## 🤖 3. AI Escape Coach Decision Model

The **AI Escape Coach** utilizes Google Gemini (`gemini-2.5-flash`) tailored for high-stress crisis scenarios:

### Prompt Engineering & Safety Guardrails
- **Conciseness Directive:** All recommendations are capped at a maximum of 3 sentences.
- **Action-Oriented Guidance:** Instructions prioritize immediate physical movement toward illuminated, populated safe havens (cafés, pharmacies, police precincts).
- **Tone:** Calm, decisive, empathetic, and authoritative.

---

## 🔒 4. Evidence Vault Cryptographic Pipeline

1. **Client Encryption:** Captured photo/audio media is encrypted prior to transmission.
2. **CDN Synchronization:** Uploads stream directly to Cloudinary under isolated user namespaces (`safora_evidence/`).
3. **Immutability:** Metadata records retain cryptographic timestamps and GPS coordinates for legal admissibility.

---

## 🌐 5. Resilient Offline-First Strategy

- **Firebase Graceful Fallback:** If Firebase credentials are missing or blocked by browser extensions, SAFORA seamlessly transitions to local token authentication without UI disruption.
- **Pre-warming Pinger:** The frontend automatically pre-warms backend service endpoints on mount to ensure zero-latency startup on serverless runtimes.
