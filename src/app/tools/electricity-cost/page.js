"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Printer, RefreshCw, Sparkles, ShieldAlert } from "lucide-react";

export default function ElectricityCostCalculator() {
  const [rate, setRate] = useState(0.16); // Default average US rate
  const [wattage, setWattage] = useState(1500); // Default space heater or microwave wattage
  const [hours, setHours] = useState(5); // Default hours per day
  const [days, setDays] = useState(30); // Default days in month

  // Run calculations
  const totalKwh = (wattage * hours * days) / 1000;
  const cost = totalKwh * rate;
  const dailyCost = (wattage * hours * rate) / 1000;
  const yearlyCost = dailyCost * 365;

  const handleReset = () => {
    setRate(0.16);
    setWattage(1500);
    setHours(5);
    setDays(30);
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-450 border border-sky-100 dark:border-sky-900/30">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Electricity Cost Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Appliance Electricity Cost Estimator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Calculate the exact electricity usage and cost of any household appliance. Drag the sliders below to see immediate projections.
          </p>
        </section>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Panel */}
          <section className="md:col-span-7 p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-850 pb-4">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Calculator Controls</h2>
              <button
                onClick={handleReset}
                type="button"
                className="text-[10px] font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            {/* Input 1: Electricity Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label htmlFor="rate-input" className="text-gray-500 dark:text-gray-400">Local Electricity Rate ($/kWh)</label>
                <span className="text-sky-500">${rate.toFixed(3)} / kWh</span>
              </div>
              <input
                id="rate-input"
                type="range"
                min="0.05"
                max="0.50"
                step="0.005"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full text-sky-500"
              />
              <span className="text-[10px] text-gray-400 block">Typical US average is ~$0.16/kWh. California reaches $0.32+/kWh.</span>
            </div>

            {/* Input 2: Appliance Wattage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label htmlFor="wattage-input" className="text-gray-500 dark:text-gray-400">Appliance Power Rating (Watts)</label>
                <span className="text-sky-500">{wattage} Watts</span>
              </div>
              <input
                id="wattage-input"
                type="range"
                min="10"
                max="5000"
                step="10"
                value={wattage}
                onChange={(e) => setWattage(parseInt(e.target.value, 10))}
                className="w-full text-sky-500"
              />
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-[9px] font-bold text-gray-400">
                <button type="button" onClick={() => setWattage(10)} className="py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-150 hover:border-sky-500 transition-colors">10W (LED)</button>
                <button type="button" onClick={() => setWattage(500)} className="py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-150 hover:border-sky-500 transition-colors">500W (PC)</button>
                <button type="button" onClick={() => setWattage(1500)} className="py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-150 hover:border-sky-500 transition-colors">1.5kW (Heater)</button>
                <button type="button" onClick={() => setWattage(3500)} className="py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-150 hover:border-sky-500 transition-colors">3.5kW (AC)</button>
              </div>
            </div>

            {/* Input 3: Daily Runtime */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label htmlFor="hours-input" className="text-gray-500 dark:text-gray-400">Daily Running Duration (Hours)</label>
                <span className="text-sky-500">{hours} Hours / day</span>
              </div>
              <input
                id="hours-input"
                type="range"
                min="0.5"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full text-sky-500"
              />
            </div>

            {/* Input 4: Days in Period */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label htmlFor="days-input" className="text-gray-500 dark:text-gray-400">Billing Period (Days)</label>
                <span className="text-sky-500">{days} Days</span>
              </div>
              <input
                id="days-input"
                type="range"
                min="1"
                max="90"
                step="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                className="w-full text-sky-500"
              />
            </div>
          </section>

          {/* Results Display Panel */}
          <section className="md:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-5">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Estimated Operating Costs</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Daily Cost</span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">${dailyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Cost ({days} days)</span>
                  <span className="text-2xl font-black text-sky-500">${cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Yearly Operating Cost</span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">${yearlyCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Total kWh info box */}
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 flex justify-between items-center text-xs">
                <span className="font-bold text-sky-600 dark:text-sky-400">Total Power Draw:</span>
                <span className="font-extrabold text-gray-900 dark:text-white">{totalKwh.toFixed(1)} kWh</span>
              </div>
            </div>

            {/* Print Action */}
            <button
              onClick={() => window.print()}
              type="button"
              className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-850 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer print:hidden shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print Cost Summary
            </button>
          </section>

        </div>

        {/* How the Calculation Works Guide */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-4 text-left">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            How the Calculation Works
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Electricity consumption is billed based on Kilowatt-hours (kWh). One Kilowatt-hour represents using 1,000 watts of electrical power for exactly one hour.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            The mathematical formula used to estimate cost is defined as:
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300">
            1. Power (Kilowatts) = Wattage ÷ 1,000<br />
            2. Total Consumption (kWh) = Power (kW) × Running Time (Hours/Day) × Duration (Days)<br />
            3. Estimated Bill Cost ($) = Total Consumption (kWh) × Rate ($/kWh)
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            For example, running a 1,500-watt space heater for 8 hours a day will draw 12 kWh of electricity per day (1.5 kW × 8 hours). At a standard electricity rate of $0.16 per kWh, this space heater will cost $1.92 per day, or approximately $57.60 per month.
          </p>
        </section>

      </div>
    </div>
  );
}
