"use client";

import React from "react";
import { Leaf, Award, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 transition-colors duration-300 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Banner */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30">
            <Sparkles className="w-3.5 h-3.5" />
            Learn About Flowtix
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Empowering Smart Household Energy Management
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Flowtix is an independent utility forecasting and estimation engine. We help homeowners, tenants, and developers break down complex grid billing policies into understandable, actionable models.
          </p>
        </section>

        {/* Brand Mission & Values */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-955 dark:text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Our Mission
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
              Household utility bills are often intentionally complicated, filled with delivery codes, seasonal adjustments, and tiered blocks that make it difficult to identify wastage. Flowtix is built on a mission to bring transparent cost modeling to everyone. By utilizing current regional averages (sourced from the EIA and municipal schedules) and combining them with granular appliance draw formulas, our estimators empower you to run local simulations and predict your bills before they arrive.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-955 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Rigorous Data Standards
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
              We compile regional averages periodically, matching standard state residential tariff rates for electricity (kWh), gas (Therms), and municipal water tiers. Our team continuously audits mathematical equations—factoring in complex variables like Time-of-Use (TOU) peak multiplier thresholds, water billing tiers, and weather-driven HVAC cycle coefficients—to ensure our models remain aligned with real utility billing frameworks.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            Flowtix Platform Features & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 space-y-2.5">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-200">Granular Bill Modeler</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Adjust baseline square footage, AC runtime, EV charging hours, pool heating, and appliance wattages to inspect immediate impacts.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 space-y-2.5">
              <span className="text-2xl">📸</span>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-200">AI Bill Scanning (OCR)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Skip manual entries. Drag and drop your electric bill to extract regional ZIP identifiers and electricity tariff rates automatically using Tesseract.js.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 space-y-2.5">
              <span className="text-2xl">🌱</span>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-200">Savings Action Plan</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Check off optimized conservation behaviors (like laundry off-peak, lower thermostats, and water reductions) to see live projected savings.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            How to Use Flowtix
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                <strong>Select Location:</strong> Input your 5-digit ZIP code or select your state from the dropdown menu to immediately load regional average utility prices.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                <strong>Customize Inputs:</strong> Navigate between the Electricity, Gas, and Water tabs. Adjust inputs such as square footage, seasonal AC/heater runtimes, and occupant count to represent your house layout.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                <strong>Override Default Rates:</strong> Open the <em>Personal Rate Customizer</em> panel to input rates from your recent bill, enabling hyper-accurate local modeling.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Oversight */}
        <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 dark:border-emerald-900/10 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl font-extrabold shrink-0 select-none">
            VS
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              Vineet Singh
              <span className="text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                Lead Analyst & Editor
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
              Flowtix utility rate maps, calculators, and educational content are compiled and audited under the editorial guidance of **Vineet Singh**. Vineet is a veteran energy analyst with five years of experience analyzing municipal pricing tariffs, energy conservation models, and green energy investments.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
