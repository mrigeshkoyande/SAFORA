# 🎨 SAFORA — Design System & UI Specifications

> **SAFORA Design Philosophy**
> High-contrast, reassuring, modern glassmorphic interface designed to provide immediate clarity, rapid physical accessibility, and visual calm during high-stress situations.

---

## 🎨 1. Color Palette & Design Tokens

### Core Brand Colors
| Token | Hex Code | Role | Purpose |
| :--- | :--- | :--- | :--- |
| **Midnight Plum** | `#0d040e` | Background | Primary dark theme backdrop |
| **Deep Velvet** | `#1a0718` | Container | Card & section backdrops |
| **Safety Rose** | `#f472b6` | Primary Accent | Main brand highlights & active states |
| **Crimson SOS** | `#e11d48` | Emergency | High-priority SOS alerts & danger actions |
| **Emerald Active** | `#16a34a` | Status | Active Guardian tracking indicator |

---

## 🔤 2. Typography Hierarchy

Primary Font: **Plus Jakarta Sans** (Headlines & Brand)
Secondary Font: **Inter** (Labels, UI Controls & Body Copy)

| Element | Class | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **Display Title** | `text-4xl md:text-5xl` | Bold (700) | Startup Splash & Hero Headings |
| **Section Header**| `text-xl md:text-2xl` | SemiBold (600) | Dashboard & Feature Titles |
| **Body Text** | `text-sm md:text-base` | Regular (400) / Medium (500) | Descriptions & Instructions |
| **Button Label** | `text-sm md:text-base` | Bold (700) / SemiBold (600) | Action Triggers |

---

## 💎 3. Glassmorphism & Micro-Interactions

- **Glass Cards:**
  ```css
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  ```
- **Haptic Feedback Integration:** All primary touch controls invoke haptic ticks (`heavy` for SOS, `medium` for navigation, `light` for toggles).
- **Pulse Animations:** Live location indicators and active Guardian mode badges use smooth 1.5s CSS pulse animations.

---

## 📱 4. Responsive Breakpoints

SAFORA utilizes a **Mobile-First Responsive Layout Strategy**:

- **Mobile Viewport (`< 640px`):** Floating bottom navigation bar, single-column quick actions, full-screen touch targets.
- **Tablet Viewport (`640px – 1024px`):** 2-3 column dashboard grid, responsive side paddings (`px-6`).
- **Desktop Viewport (`> 1024px`):** Left vertical icon sidebar (`w-20`), top navigation bar (`h-16`), 6-column quick action grid, centered max-width content container (`max-w-7xl`).
