"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Printer, RefreshCw, Sparkles, HelpCircle } from "lucide-react";

export default function HeatingCostCalculator() {
  const [sqFt, setSqFt] = useState(1500);
  const [elecRate, setElecRate] = useState(0.16);
  const [gasRate, setGasRate] = useState(1.10);
  const [climate, setClimate] = useState("moderate"); // moderate, cold, mild

  // BTU requirements per month based on size and climate
  let btuMultiplier = 3500; // Moderate climate default BTUs per sqft per month
  if (climate === "cold") btuMultiplier = 6000;
  if (climate === "mild") btuMultiplier = 2000;

  const totalBtusNeeded = sqFt * btuMultiplier;

  // 1. Electric Resistance Space Heaters (100% efficient, 3412 BTUs per kWh)
  const spaceHeaterKwh = totalBtusNeeded / 3412;
  const spaceHeaterCost = spaceHeaterKwh * elecRate;

  // 2. Gas Furnace (assume 80% AFUE efficiency, 100,000 BTUs per Therm)
  const gasTherms = totalBtusNeeded / 100000 / 0.8;
  const gasFurnaceCost = gasTherms * gasRate;

  // 3. Electric Heat Pump (assume average COP of 3.2, which is 320% efficiency)
  const heatPumpKwh = (totalBtusNeeded / 3412) / 3.2;
  const heatPumpCost = heatPumpKwh * elecRate;

  const handleReset = () => {
    setSqFt(1500);
    setElecRate(0.16);
    setGasRate(1.10);
    setClimate("moderate");
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-455 border border-orange-100 dark:border-orange-900/30">
            <Flame className="w-3.5 h-3.5 fill-current text-orange-500" />
            Heating Cost Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Home Space Heating Cost Estimator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Compare monthly operating expenses of natural gas furnaces, electric resistance space heaters, and high-efficiency electric heat pumps.
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

            {/* Square footage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Heated Home Size (Sq. Ft.)</span>
                <span className="text-orange-500">{sqFt.toLocaleString()} Sq. Ft.</span>
              </div>
              <input
                type="range"
                min="300"
                max="4000"
                step="50"
                value={sqFt}
                onChange={(e) => setSqFt(parseInt(e.target.value, 10))}
                className="w-full text-orange-500"
              />
            </div>

            {/* Climate Selector */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="climate-select" className="text-xs font-bold text-gray-500 dark:text-gray-400">Winter Climate Severity</label>
              <select
                id="climate-select"
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="mild">Mild (Sustained temps over 45°F)</option>
                <option value="moderate">Moderate (Typical winter dips to 32°F)</option>
                <option value="cold">Severe Cold (Sub-freezing winter extremes)</option>
              </select>
            </div>

            {/* Electricity rate input */}
            <div className="space-y-1.5">
              <label htmlFor="elecrate-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Electricity Rate ($/kWh)</label>
              <input
                id="elecrate-input"
                type="number"
                step="0.01"
                value={elecRate}
                onChange={(e) => setElecRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Gas rate input */}
            <div className="space-y-1.5">
              <label htmlFor="gasrate-input" className="text-xs font-bold text-gray-500 dark:text-gray-400">Natural Gas Rate ($/Therm)</label>
              <input
                id="gasrate-input"
                type="number"
                step="0.05"
                value={gasRate}
                onChange={(e) => setGasRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </section>

          {/* Results Panel */}
          <section className="md:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-5">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white font-sans">Monthly Operating Cost Summary</h2>
              
              <div className="space-y-4 font-sans text-xs">
                {/* 1. Space heater */}
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Electric Space Heaters</span>
                  <span className="font-extrabold text-rose-500">${spaceHeaterCost.toFixed(2)}</span>
                </div>
                {/* 2. Gas furnace */}
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Gas Furnace (80% AFUE)</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">${gasFurnaceCost.toFixed(2)}</span>
                </div>
                {/* 3. Heat pump */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Electric Heat Pump (COP 3.2)</span>
                  <span className="text-2xl font-black text-emerald-500">${heatPumpCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              type="button"
              className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-855 border border-gray-205 dark:border-gray-800 text-xs font-bold text-gray-650 dark:text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer print:hidden shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print Heating Comparison
            </button>
          </section>

        </div>

        {/* Detailed Explanation */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-4 text-left">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            Thermodynamic Heating Comparison Formulas
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            To compare operational heating efficiency between electric resistance, natural gas, and refrigerant heat pumps, we measure system outputs using British Thermal Units (BTUs):
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 text-left space-y-1">
            • <strong>Electric Resistance Heat:</strong> Converts 100% of electrical energy to heat. 1 kWh of electricity yields exactly 3,412 BTUs of heat.<br />
            • <strong>Natural Gas Furnace:</strong> Converts gas volume (Ccf) to Therms. One Therm represents 100,000 BTUs. High efficiency furnaces deliver 80% to 95% of this value to the home ducts.<br />
            • <strong>Electric Heat Pump:</strong> Moves heat from outdoors instead of creating it. A Coefficient of Performance (COP) of 3.2 delivers 320% efficiency, meaning 1 kWh of electrical draw yields 10,918 BTUs of indoor heat (3,412 × 3.2).
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            While heat pumps are three times more efficient than electric space heaters, their efficiency drops in sub-zero winter weather. High-efficiency natural gas furnaces remain the most popular, high-output solutions in extreme northern climate zones.
          </p>
        </section>

      </div>
    </div>
  );
}
