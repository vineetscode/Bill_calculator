"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Hammer, ArrowLeft, Printer, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";

export default function EvChargingCalculator() {
  const [miles, setMiles] = useState(1000);
  const [elecRate, setElecRate] = useState(0.16);
  const [evEfficiency, setEvEfficiency] = useState(3.5); // Miles per kWh
  const [gasPrice, setGasPrice] = useState(3.60); // Per gallon
  const [gasMpg, setGasMpg] = useState(28); // Average gas MPG

  // Calculations
  const evKwhNeeded = miles / evEfficiency;
  const evMonthlyCost = evKwhNeeded * elecRate;
  
  const gasGallonsNeeded = miles / gasMpg;
  const gasMonthlyCost = gasGallonsNeeded * gasPrice;

  const monthlySavings = gasMonthlyCost - evMonthlyCost;
  const annualSavings = monthlySavings * 12;

  const handleReset = () => {
    setMiles(1000);
    setElecRate(0.16);
    setEvEfficiency(3.5);
    setGasPrice(3.60);
    setGasMpg(28);
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-55 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            <Hammer className="w-3.5 h-3.5 fill-current" />
            EV Charging Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            EV Charging vs. Gasoline Travel Simulator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Compare monthly home electricity charging costs of electric vehicles against equivalent combustion engine gasoline expenditures.
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

            {/* Miles driven per month */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Monthly Mileage Driven</span>
                <span className="text-emerald-500">{miles.toLocaleString()} Miles</span>
              </div>
              <input
                type="range"
                min="100"
                max="4000"
                step="50"
                value={miles}
                onChange={(e) => setMiles(parseInt(e.target.value, 10))}
                className="w-full text-emerald-500"
              />
            </div>

            {/* EV Efficiency */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">EV Driving Efficiency (Miles / kWh)</span>
                <span className="text-emerald-500">{evEfficiency} mi/kWh</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.1"
                value={evEfficiency}
                onChange={(e) => setEvEfficiency(parseFloat(e.target.value))}
                className="w-full text-emerald-500"
              />
              <span className="text-[10px] text-gray-400 block">Typical EVs draw between 2.5 (SUVs) and 4.0 (sedans) miles per kWh.</span>
            </div>

            {/* Gas price & MPG */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="gasprice-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Gas price ($/gallon)</label>
                <input
                  id="gasprice-input"
                  type="number"
                  step="0.05"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="gasmpg-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Gas car MPG</label>
                <input
                  id="gasmpg-input"
                  type="number"
                  value={gasMpg}
                  onChange={(e) => setGasMpg(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Electricity rate input */}
            <div className="space-y-1.5">
              <label htmlFor="elecrate-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Home Electricity Rate ($/kWh)</label>
              <input
                id="elecrate-input"
                type="number"
                step="0.01"
                value={elecRate}
                onChange={(e) => setElecRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </section>

          {/* Results Panel */}
          <section className="md:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-5">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Savings Projection</h2>
              
              <div className="space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>EV Monthly Charging Cost</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">${evMonthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Gasoline Monthly Fuel Cost</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">${gasMonthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="font-bold text-gray-900 dark:text-white">Monthly Net Savings</span>
                  <span className="text-lg font-extrabold text-emerald-500">${monthlySavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-900 dark:text-white">Annual Net Savings</span>
                  <span className="text-2xl font-black text-emerald-500">${annualSavings.toFixed(2)}</span>
                </div>
              </div>

              {/* Total kWh draw box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex gap-2 items-center text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Estimated EV carbon-offset savings are substantial!</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              type="button"
              className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-855 border border-gray-205 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer print:hidden shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print Comparison Invoice
            </button>
          </section>

        </div>

        {/* Detailed Explanation */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-4 text-left">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            EV vs. Gasoline Savings Calculations
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Comparing home electric vehicle charging costs versus internal combustion engines requires mapping mileage driven to fuel efficiency benchmarks:
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 text-left space-y-1">
            • <strong>Gasoline Volume Needed:</strong> Miles Driven ÷ Fuel Efficiency (MPG).<br />
            • <strong>Gasoline Expenditure:</strong> Volume (gallons) × gasoline price per gallon.<br />
            • <strong>Electricity Power Needed:</strong> Miles Driven ÷ EV Efficiency (mi/kWh).<br />
            • <strong>Electricity Charging Cost:</strong> Power drawn (kWh) × local electricity rate per kWh.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By executing home charging during off-peak hours (usually under Time-of-Use tariffs offering discounted overnight rates), EV drivers can lower their effective electricity charging rate even further, magnifying the monthly financial savings.
          </p>
        </section>

      </div>
    </div>
  );
}
