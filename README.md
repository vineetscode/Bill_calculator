# Flowtix - Smart Utility & Bill Estimator

Flowtix is a premium, client-side utility projection platform designed to help households model, analyze, and optimize their monthly energy and water consumption. Positioned as an advanced consumer energy-modelling tool, it enables users to calculate electricity, natural gas, and water costs across all 50 U.S. states and provides interactive features to incentivize utility savings.

---

## 🚀 Key Features

### 1. Premium Cinematic Hero & Design Aesthetics
* **Full-Width Viewport Backdrop**: Animated dark-mode friendly gradient mesh backdrop (`cinematic-glow` & `gradient-shift` keyframes) covering the full width of the screen, creating a grand, modern cinematic entry block.
* **Glassmorphism Elements**: ZIP/State lookup panels styled with sleek translucent cards (`backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border-white/20`).
* **Inter Typography**: Global typography upgraded to the **Inter** font family to maximize legibility and professional aesthetic appeal.
* **Translucent Selection Highlight**: Screen text selection customized to a modern, translucent emerald green (`rgba(34, 197, 94, 0.25)`).
* **Responsive Layouts & Scales**: Interactive dashboard elements scale and lift smoothly on hover. All small texts upgraded to a minimum size of `text-xs` (12px) to guarantee excellent accessibility.

### 2. Multi-Tab Contact Bubble & Integrated Chatbot
* **Interactive Chatbot Tab (Active by Default)**: Simulated support bot that replies instantly to queries regarding utility bill optimizations, water pricing tiers, and heating saving formulas. Includes quick-reply chip suggestions ("💡 Save Electricity", "💧 Water Tier Rates", etc.) and custom prompt inputs.
* **Embedded Message Form Tab**: Users can submit custom messages using an integrated form (Name, Email, Message) directly inside the popover window. Message submissions are handled dynamically via AJAX (`POST` requests to FormSubmit.co forwarded to `vineetsinghjzr28@gmail.com`) to eliminate distracting page redirects.
* **Quick Info Tab**: Displays personal contact cards (Helpline phone: `9580024955`, Email: `vineetsinghjzr28@gmail.com`, Location: `Uttar Pradesh, India`).
* **Micro-Animations**: Floating contact bubble animated with a looping bouncing effect (`bubble-float`) and smooth state icons toggle (`MessageSquare` and `X`).

### 3. Unified Dark Mode Dashboard
* A modern, high-contrast, locked dark mode interface built for visual excellence.
* Harmonious color gradients, micro-animations, and styled layouts for a professional dashboard feel.

### 4. Brand Favicon Alignment
* Replaced default metadata icons with a custom SVG brand favicon (`public/favicon.svg`) matching Flowtix's emerald leaf logo, keeping the browser tab perfectly synced with the site branding.

### 5. Multi-Calculator Suite
* **Electricity Calculator**: Models baseline square-footage draws alongside high-load expansion appliances:
  * *Work-From-Home (WFH)* laptop and monitor consumption.
  * *Vampire standby load* from modern household socket draws.
  * *Pool & Hot Tub* filtration pumps and heating loops.
* **Natural Gas Calculator**: Estimates gas therms using furnace, boiler, or water heater base draws, scaled by thermostat setpoint modifiers.
* **Water Calculator**: Models indoor baseline usage, shower averages, and lawn irrigation frequencies, with tiered water rate billing simulations.

### 6. Interactive Dropdown Navigation
* Converted the main navbar "Comparison Tools" tab into a responsive hover-triggered dropdown menu (desktop) and accordion lists (mobile), enabling fast access to each of the 6 utility calculators directly.


---

## 🛠️ Technology Stack

* **Framework**: Next.js 15 (App Router, React 19)
* **Styling**: Tailwind CSS v4 & Vanilla CSS
* **Icons**: Lucide React
* **OCR Processor**: Tesseract.js (Client CDN implementation)
* **Weather Service**: Open-Meteo API (No-key client integration)

---

## ⚙️ Development Environment & Stability Fix

### The Hot Module Replacement (HMR) Fix
During Windows development, Next.js's bundler can suffer from a path backslash issue when compiling its internal devtools segment explorer (`segment-explorer-node.js`). This leads to a `Could not find the module in the React Client Manifest` error, corrupting compiler memory and causing dynamic chunks to return `404 Not Found`.

**Solution Implemented**:
* We created a local mock component [`SegmentExplorerMock.js`](file:///c:/Users/Vineet%20Singh/OneDrive/Desktop/calculator/src/components/SegmentExplorerMock.js) satisfying all devtool client exports.
* We configured a Webpack alias in [`next.config.mjs`](file:///c:/Users/Vineet%20Singh/OneDrive/Desktop/calculator/next.config.mjs) directing the bundler to load the mock file. Because it resides in the workspace path rather than `node_modules`, it resolves with standard relative paths, bypassing the Windows backslash resolution bug and ensuring HMR and Fast Refresh remain **100% stable** under `npm run dev`.

---

## 📦 Getting Started

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the development server with HMR:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Compile Production Build
Create an optimized production bundle (pre-renders all 155 pages for SEO):
```bash
npm run build
```

### 4. Start Production Server
Launch the production server locally:
```bash
npm start
```

---

## ⚖️ Legal & Compliance Compliance
* This app is designed purely as an estimator and calculator.
* All references to U.S. government departments, government API feeds, or the U.S. Energy Information Administration (EIA) have been completely removed from titles, metadata, SEO schemas, and FAQs to maintain full compliance and avoid legal complications.

