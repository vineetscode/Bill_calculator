"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Droplet, ArrowLeft, Printer, RefreshCw, Sparkles } from "lucide-react";

export default function WaterCostCalculator() {
  const [members, setMembers] = useState(3);
  const [showerTime, setShowerTime] = useState(10);
  const [lawnFreq, setLawnFreq] = useState(2);
  const [baseFee, setBaseFee] = useState(25);
  const [rate, setRate] = useState(6.5); // Per 1,000 gallons

  // Calculations (baseline indoor + shower + lawn watering)
  const baselineGal = members * 50 * 30; // 50 gal/person/day
  const showerGal = showerTime * 2.1 * members * 30; // 2.1 gpm showerhead
  const lawnGal = lawnFreq * 120 * 4.3; // 120 gal per watering event
  const totalGal = baselineGal + showerGal + lawnGal;

  // Tier billing math
  const tier1Limit = 3000;
  const tier2Limit = 10000;
  const r1 = rate;
  const r2 = rate * 1.5;
  const r3 = rate * 2.2;

  let cost = baseFee;
  let remainingGal = totalGal;
  
  const t1Gal = Math.min(remainingGal, tier1Limit);
  cost += (t1Gal / 1000) * r1;
  remainingGal -= t1Gal;

  let t2Gal = 0;
  if (remainingGal > 0) {
    t2Gal = Math.min(remainingGal, tier2Limit - tier1Limit);
    cost += (t2Gal / 1000) * r2;
    remainingGal -= t2Gal;
  }

  let t3Gal = 0;
  if (remainingGal > 0) {
    t3Gal = remainingGal;
    cost += (t3Gal / 1000) * r3;
  }

  const handleReset = () => {
    setMembers(3);
    setShowerTime(10);
    setLawnFreq(2);
    setBaseFee(25);
    setRate(6.5);
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border border-blue-105 dark:border-blue-900/30">
            <Droplet className="w-3.5 h-3.5 fill-current" />
            Water Cost Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Tiered Water Bill Estimator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Calculate your monthly water bill based on household size, shower habits, lawn watering schedules, and tiered rate surcharges.
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

            {/* Occupants count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Household Members</span>
                <span className="text-blue-500">{members} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={members}
                onChange={(e) => setMembers(parseInt(e.target.value, 10))}
                className="w-full text-blue-500"
              />
            </div>

            {/* Shower time */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Average Daily Shower Duration</span>
                <span className="text-blue-500">{showerTime} Mins / person</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={showerTime}
                onChange={(e) => setShowerTime(parseInt(e.target.value, 10))}
                className="w-full text-blue-500"
              />
            </div>

            {/* Lawn watering frequency */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Lawn Irrigation Frequency</span>
                <span className="text-blue-500">{lawnFreq} Days / week</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                value={lawnFreq}
                onChange={(e) => setLawnFreq(parseInt(e.target.value, 10))}
                className="w-full text-blue-500"
              />
            </div>

            {/* Water base rate setting */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="basefee-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Base connection fee ($)</label>
                <input
                  id="basefee-input"
                  type="number"
                  value={baseFee}
                  onChange={(e) => setBaseFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tier1rate-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Tier 1 rate ($/kgal)</label>
                <input
                  id="tier1rate-input"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Results Display Panel */}
          <section className="md:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-5">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Estimated Monthly Bill</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Consumption</span>
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">{totalGal.toLocaleString()} Gallons</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Fixed Base Fee</span>
                  <span className="text-sm font-semibold text-gray-750 dark:text-gray-300">${baseFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Tier 1 cost (Standard)</span>
                  <span className="text-xs font-semibold text-gray-750 dark:text-gray-300">${((t1Gal / 1000) * r1).toFixed(2)}</span>
                </div>
                {t2Gal > 0 && (
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tier 2 cost (1.5x Surcharge)</span>
                    <span className="text-xs font-semibold text-gray-750 dark:text-gray-300">${((t2Gal / 1000) * r2).toFixed(2)}</span>
                  </div>
                )}
                {t3Gal > 0 && (
                  <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tier 3 cost (2.2x Surcharge)</span>
                    <span className="text-xs font-semibold text-gray-750 dark:text-gray-300">${((t3Gal / 1000) * r3).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Water Cost</span>
                  <span className="text-2xl font-black text-blue-500">${cost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              type="button"
              className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-855 border border-gray-205 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer print:hidden shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print Invoice Summary
            </button>
          </section>

        </div>

        {/* Detailed Explanation */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-4 text-left">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            Understanding Water Billing Tiers
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Water connections use progressive block tariffs to penalize high-volume luxury water draw, encouraging municipal resource conservation.
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 text-left space-y-1">
            • <strong>Base Tier (0 to 3,000 gallons):</strong> Billed at standard rate. Covers fundamental indoor drinking, toilet flushing, and sink needs.<br />
            • <strong>Moderate Tier (3,001 to 10,000 gallons):</strong> Billed at a 1.5x rate surcharge. Applies as laundry and long shower runtimes accumulate.<br />
            • <strong>Luxury Tier (10,001+ gallons):</strong> Billed at a 2.2x high-demand surcharge. Primarily triggered by heavy outdoor lawn sprinkler irrigation.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By limiting lawn irrigation frequencies and upgrading to low-flow showerheads (drawing 1.8 gpm instead of 2.5 gpm), households can keep total water consumption below 3,000 or 10,000 gallon brackets, avoiding expensive surcharge tiers entirely.
          </p>
        </section>

      </div>
    </div>
  );
}
