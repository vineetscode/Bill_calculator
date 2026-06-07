"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, ArrowLeft, Printer, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

export default function SolarSavingsCalculator() {
  const [bill, setBill] = useState(180); // Average monthly electric bill
  const [sunlight, setSunlight] = useState(4.5); // Average daily peak sunlight hours
  const [costPerWatt, setCostPerWatt] = useState(3.00); // Standard installation cost per watt
  const [offsetPct, setOffsetPct] = useState(100); // Desired billing offset

  // Calculations
  const averageRate = 0.16; // Assumed standard average rate
  const monthlyKwhUsed = bill / averageRate;
  const dailyKwhNeeded = (monthlyKwhUsed / 30) * (offsetPct / 100);
  
  // System size in kW = daily kWh / peak sunlight hours / efficiency factor (assume 0.8)
  const systemSizeKw = dailyKwhNeeded / sunlight / 0.8;
  const systemSizeWatts = systemSizeKw * 1000;
  
  const grossCost = systemSizeWatts * costPerWatt;
  const taxCredit = grossCost * 0.30; // 30% Federal ITC
  const netCost = grossCost - taxCredit;

  const monthlySavings = bill * (offsetPct / 100);
  const annualSavings = monthlySavings * 12;
  const paybackYears = netCost / (annualSavings || 1);

  const handleReset = () => {
    setBill(180);
    setSunlight(4.5);
    setCostPerWatt(3.00);
    setOffsetPct(100);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div className="text-left print:hidden">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Comparison Tools
          </Link>
        </div>

        {/* Title Block */}
        <section className="text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border border-amber-100 dark:border-amber-900/30">
            <Sun className="w-3.5 h-3.5 fill-current text-amber-550" />
            Solar Savings Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Solar Panel Size & Payback Estimator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Estimate the size of the residential solar system needed to offset your monthly electric bill and calculate the system's net financial payback.
          </p>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section */}
          <section className="md:col-span-7 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-850 pb-4">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white font-sans">Calculator Controls</h2>
              <button
                onClick={handleReset}
                type="button"
                className="text-[10px] font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            {/* Current monthly electric bill */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Current Monthly Electric Bill</span>
                <span className="text-amber-500">${bill} / month</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="10"
                value={bill}
                onChange={(e) => setBill(parseInt(e.target.value, 10))}
                className="w-full text-amber-500"
              />
            </div>

            {/* Sunlight hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Daily Peak Sunlight Hours</span>
                <span className="text-amber-500">{sunlight} Hours</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="7.0"
                step="0.1"
                value={sunlight}
                onChange={(e) => setSunlight(parseFloat(e.target.value))}
                className="w-full text-amber-500"
              />
              <span className="text-[10px] text-gray-400 block">Varies by geography: Southwest US averages 5.5+ hours, Northeast averages ~4.0 hours.</span>
            </div>

            {/* Cost per watt installation setting */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="installcost-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Install Cost ($/watt)</label>
                <input
                  id="installcost-input"
                  type="number"
                  step="0.10"
                  value={costPerWatt}
                  onChange={(e) => setCostPerWatt(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="offsetpct-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Target Offset (%)</label>
                <input
                  id="offsetpct-input"
                  type="number"
                  value={offsetPct}
                  onChange={(e) => setOffsetPct(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          {/* Results Panel */}
          <section className="md:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-5">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Estimated Solar Investment</h2>
              
              <div className="space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>System Capacity Required</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">{systemSizeKw.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Gross Installation Cost</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">${grossCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Federal Tax Credit (30% ITC)</span>
                  <span className="text-emerald-500 font-semibold">-${taxCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="font-bold text-gray-900 dark:text-white">Net System Cost</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">${netCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">System Payback Period</span>
                  <span className="text-2xl font-black text-amber-500">{paybackYears.toFixed(1)} Years</span>
                </div>
              </div>

              {/* Total kWh offset info box */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex gap-2 items-center text-[10px] font-bold text-amber-700 dark:text-amber-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Payback model factors 30% federal clean energy credit.</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              type="button"
              className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-855 border border-gray-205 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer print:hidden shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print System Specifications
            </button>
          </section>

        </div>

        {/* Detailed Explanation */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-4 text-left">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            Solar Sizing and Payback Calculations
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            To estimate the size and cost effectiveness of a rooftop solar array, our calculator runs the following equations:
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 text-left space-y-1">
            • <strong>Daily Generation Target (kWh):</strong> (Monthly kWh draw ÷ 30) × target offset %.<br />
            • <strong>System Size (kW):</strong> Target kWh ÷ Peak Sunlight Hours ÷ System Efficiency Factor (modeled at 80% to account for inverter and wiring losses).<br />
            • <strong>Federal Clean Energy Tax Credit (ITC):</strong> 30% discount off gross installer invoice cost.<br />
            • <strong>Net Financial Payback:</strong> Net investment cost ÷ annual utility savings.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Typically, solar panels have an operating warranty of 25 to 30 years. After recovering the initial installation investment (usually between 6 and 9 years depending on state-level solar sunlight and utility pricing), the system provides essentially free electricity for the remaining decades of panel life.
          </p>
        </section>

      </div>
    </div>
  );
}
