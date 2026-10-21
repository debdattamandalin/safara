# 🛡️ Safara — National Tourist Safety Infrastructure

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.5-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Android Ready](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-green.svg)](https://developer.android.com/)

**Safara** is a comprehensive, real-time Tourist Safety and Emergency Response Ecosystem designed to protect domestic and international travelers across unfamiliar terrains while seamlessly connecting them with emergency response units and official authorities.

Built with a mobile-first philosophy, Safara combines cryptographic identity generation, live geofenced risk assessments, multi-lingual support across 10 languages, and a high-priority, fail-safe SOS beacon.

---

## 🚀 Key Features

* **🛡️ Cryptographic Digital Identity**:
  * Automatically hashes traveler credentials client-side using `SHA-256` (`crypto.subtle.digest`).
  * Generates a privacy-preserving unique traveler identifier (`SAF-XXXXXXXX`) that masks personal sensitive documents while ensuring verifiable authenticity.
* **🛂 Dual-Path Traveler Onboarding**:
  * **Domestic Citizens**: Fast-track onboarding with Aadhaar identification, emergency contacts, and vital medical/blood type registration.
  * **International Visitors**: Passport-based intake linked with an **Immigration Checkpoint QR Scanner** that issues an ephemeral, visa-bound `Journey ID` tied to port-of-entry and validity windows.
* **🚨 Fail-Safe Global SOS Beacon**:
  * Press-and-hold radial safety countdown (prevents accidental triggers).
  * Synthesized multi-tone emergency siren with hardware audio feedback.
  * Instant transmission of high-accuracy GPS coordinates (`@capacitor/geolocation`) to the central command dispatch via PostgreSQL Realtime feeds.
* **📡 Live Safety Radar & AI Risk Scoring**:
  * Real-time calculation of dynamic **Safety Score (0–100)** using the Haversine distance formula against verified geographical hazard zones (landslides, high-crime zones, natural hazard areas).
* **🌐 10-Language Native Localization**:
  * **Indian Languages**: हिन्दी (Hindi), தமிழ் (Tamil), বাংলা (Bengali), తెలుగు (Telugu), मराठी (Marathi).
  * **World Languages**: English, Français (French), Español (Spanish), 中文 (Chinese), العربية (Arabic).
* **🔒 Privacy & Instant Data Purge**:
  * "Sign Out & Erase ID" one-click action wipes all local identity data, sessions, and cached credentials.

---

## 🏗️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Effects** | [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **Mobile Runtime** | [Capacitor 8.5](https://capacitorjs.com/) (Android & iOS) |
| **Native Plugins** | Geolocation, Native Audio, Local Notifications |
| **Database & Realtime** | [Supabase](https://supabase.com/) (PostgreSQL + WebSocket Realtime CDC) |
| **Mapping & GIS** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) |
| **Internationalization** | [i18next](https://www.i18next.com/) + `react-i18next` |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Repository Structure

```text
safara/
├── android/                   # Native Android Studio project (Capacitor)
├── src/
│   ├── assets/                # App artwork and branding
│   ├── components/            # Reusable UI widgets & GlobalSOSOverlay
│   ├── layouts/               # Traveler mobile shell and bottom navigation
│   ├── lib/                   # Supabase client, audio player, & utility helpers
│   ├── locales/               # JSON localization files for 10 languages
│   ├── pages/                 # Main screens
│   │   ├── TravelerHome.tsx       # Live Safety Radar, Map & Danger Zones
│   │   ├── Onboarding.tsx         # Multi-step onboarding & verification
│   │   ├── TravelerID.tsx         # Digital Identity & Ephemeral Journey ID
│   │   ├── ImmigrationVerify.tsx  # Checkpoint QR scan simulation
│   │   └── TravelerSettings.tsx   # Language switch, profile, & ID purge
│   ├── App.tsx                # Routing and global state
│   ├── i18n.ts                # Internationalization config
│   └── main.tsx               # App entrypoint
├── capacitor.config.ts        # Capacitor configuration
├── vite.config.ts             # Vite bundler configuration
└── package.json
```

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **Android Studio**: (Only required if building the native Android APK)

### 1. Clone & Install
```bash
git clone https://github.com/debdattamandalin/safara.git
cd safara
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-instance.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Locally (Web / PWA)
Start the Vite development server with local network exposure:
```bash
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 📱 Compiling the Native Android APK

Safara is built to run natively on mobile devices through Capacitor. Follow these steps to build the release/debug APK:

### 1. Build Production Web Assets
```bash
npm run build
```

### 2. Synchronize Assets with Android Project
```bash
npx cap sync android
```

### 3. Compile the APK using Gradle
Ensure your `JAVA_HOME` points to a compatible JDK (Android Studio's bundled JBR is recommended):
```bash
# macOS with Android Studio installed
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

# Navigate to android directory and compile
cd android
./gradlew assembleDebug
```

### 4. Locate the Built APK
The compiled binary will be ready at:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```
You can install it directly onto your Android device or emulator via:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚨 Emergency Operations Workflow

1. **Activation**: Traveler triggers SOS by holding the emergency button for 3 seconds (or tapping trigger).
2. **Telemetry Capture**: Device captures high-precision coordinates (`lat`, `lng`) and appends timestamp with user ID.
3. **Realtime Broadcast**: Payload is inserted into Supabase's `incidents` table.
4. **Command Center Ingestion**: Admin dispatch portal receives the distress event via Postgres Realtime WebSocket within milliseconds.
5. **Dispatch & Resolution**: First responders dispatch units and mark incidents as resolved, synchronizing status back to the traveler ecosystem.

---

## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
