# Safara - National Tourist Safety

Safara is an enterprise-grade National Tourist Safety infrastructure designed to seamlessly integrate with official immigration flows. It provides secure digital identities, real-time emergency SOS capabilities, and a comprehensive admin dashboard for monitoring active travelers.

## Features
- **Dual-Path Onboarding**: Custom onboarding flows for Indian Citizens (via DigiLocker integration) and International Travelers.
- **Immigration Checkpoint Simulation**: Secure ephemeral Journey Session provisioning triggered by scanning official immigration QR codes.
- **Dual-ID Architecture**: Separates persistent Safara Account profiles from temporary, visa-bound Journey IDs.
- **Real-Time SOS Overlay**: Global, accessible SOS button that broadcasts the traveler's live location to the central Admin Dashboard.
- **Admin Emergency Operations Center**: A real-time map interface for monitoring active emergencies, dispatching assistance, and resolving incidents.

## Tech Stack
This project is built using modern, performant web and mobile technologies:
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (for smooth micro-animations)
- **Routing**: React Router DOM
- **Mobile Deployment**: Capacitor (iOS and Android)
- **Mapping**: React-Leaflet
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started (Development)

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Android Studio (if you plan to build the Android APK)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/debdattamandalin/safara.git
   cd safara
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (with live reload):
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173` to view the web app.

## Building and Hosting

### Web Hosting
To host the web application (e.g., on Vercel, Netlify, or an Nginx server):
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. The compiled static files will be located in the `dist` directory. You can upload this directory to your hosting provider.

### Mobile App Deployment (Android)
This project uses Capacitor to package the web app into a native Android APK.
1. Build the web project:
   ```bash
   npm run build
   ```
2. Sync the assets to the Android folder:
   ```bash
   npx cap sync android
   ```
3. Build the APK using Gradle (Requires Java 21 or the Java bundled with Android Studio):
   ```bash
   cd android
   # Point JAVA_HOME to a compatible JDK, for example Android Studio's bundled JBR:
   export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
   ./gradlew assembleDebug
   ```
4. The generated APK will be located at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

## Contributing
To contribute to the project, please ensure that you follow the established design aesthetics (gradient meshes, glassmorphism, responsive components) and utilize the predefined Tailwind utility classes for consistency.
