# Flowtix - Smart Utility & Bill Estimator

Flowtix is a premium, client-side utility projection platform designed to help households model, analyze, and optimize their monthly energy and water consumption. Positioned as an advanced consumer energy-modelling tool, it enables users to calculate electricity, natural gas, and water costs across all 50 U.S. states and provides interactive features to incentivize utility savings.

---

## 🚀 Key Features

### 1. Unified Dark Mode Dashboard
* A modern, high-contrast, locked dark mode interface built for visual excellence.
* harmonious color gradients, micro-animations, and styled layouts for a professional dashboard feel.

### 2. Multi-Calculator Suite
* **Electricity Calculator**: Models baseline square-footage draws alongside high-load expansion appliances:
  * *Work-From-Home (WFH)* laptop and monitor consumption.
  * *Vampire standby load* from modern household socket draws.
  * *Pool & Hot Tub* filtration pumps and heating loops.
* **Natural Gas Calculator**: Estimates gas therms using furnace, boiler, or water heater base draws, scaled by thermostat setpoint modifiers.
* **Water Calculator**: Models indoor baseline usage, shower averages, and lawn irrigation frequencies, with tiered water rate billing simulations.

### 3. Hyper-Local Utility Rates & Providers
* Integrated base utility rates for all 50 U.S. states.
* Interactive provider selector with preloaded exact rates for regional companies:
  * **California**: PG&E, SCE, SDG&E
  * **New York**: ConEd, PSEG Long Island, NYSEG
  * **Texas**: Oncor, CenterPoint, TXU
  * **Florida**: FPL, Duke Energy, TECO
  * **Standard State Averages** automatically generated for other states.

### 4. Time-of-Use (TOU) Tariff Simulator
* Simulates peak-hour (4 PM - 9 PM at 1.8x base rate) vs. off-peak hours (0.8x base rate).
* **Peak-Shift Optimizer**: Lets users toggle appliance shift schedules to immediately calculate shift savings when peak usage is reduced to 10%.

### 5. Weather API Alerts (Open-Meteo)
* Integrates client-side temperature calls using capital coordinates for the active state.
* Renders a 5-day temperature outlook and raises proactive billing warning alerts if heatwaves (>85°F) or freezes (<40°F) threaten to increase HVAC consumption.

### 6. Neighbor Eco-Score Gauge
* Custom SVG needle meter comparing the household's total bill against state composites (adjusted for area and occupant size).
* Awards graded Eco-Scores (A, B, C, D) with descriptive consumption profiles.

### 7. OCR Bill Scanner (Tesseract.js)
* Client-side OCR file loader that extracts rates and ZIP codes from uploaded photos of utility statements.
* safe dynamic CDN loader (`cdn.jsdelivr.net`) to prevent Server-Side Rendering (SSR) bundle bloat.
* Includes **Demo PG&E** and **Demo ConEd** presets to instantly show scanning functionality without a real document.

### 8. Multi-Channel Share Popup
* Opens the native system share sheet on mobile devices.
* Falls back to a clean overlay popover on desktop with pre-configured sharing handlers for **WhatsApp**, **Twitter (X)**, **Email**, and **Copy Link** containing state parameters.

### 9. PDF Report Export
* Custom print layout rule overrides (`@media print`) that strip interactive controls (sliders, buttons, scanners) to format a professional, clean single-page invoice report.

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

