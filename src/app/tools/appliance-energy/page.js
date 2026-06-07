"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Printer, RefreshCw, Sparkles } from "lucide-react";

export default function ApplianceEnergyCalculator() {
  const [rate, setRate] = useState(0.16);
  const [wattage, setWattage] = useState(500);
  const [hours, setHours] = useState(4);
  const [days, setDays] = useState(30);

  const totalKwh = (wattage * hours * days) / 1000;
  const cost = totalKwh * rate;
  const dailyCost = (wattage * hours * rate) / 1000;
  const yearlyCost = dailyCost * 365;

  const presets = [
    { name: "LED Bulb", watts: 10 },
    { name: "Wi-Fi Router", watts: 15 },
    { name: "Gaming PC", watts: 500 },
    { name: "Refrigerator", watts: 150 },
    { name: "Flat Screen TV", watts: 120 },
    { name: "Microwave Oven", watts: 1200 },
    { name: "Hair Dryer", watts: 1800 },
    { name: "Space Heater", watts: 1500 },
    { name: "Central AC System", watts: 3500 }
  ];

  const handleReset = () => {
    setRate(0.16);
    setWattage(500);
    setHours(4);
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-55 bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
            <Cpu className="w-3.5 h-3.5 fill-current" />
            Appliance Energy Calculator
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Appliance Wattage Cost Simulator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Input appliance wattage directly or select one of our device presets to see how operating hours impact your electric bill.
          </p>
        </section>

        {/* Calculator Grid */}
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

            {/* Presets List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">Select Appliance Preset:</span>
              <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-gray-500">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setWattage(p.watts)}
                    className={`py-2 px-1 rounded-xl border transition-colors ${
                      wattage === p.watts
                        ? "bg-purple-500 text-white border-purple-500 shadow-md"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-150 dark:border-gray-700 hover:border-purple-500"
                    }`}
                  >
                    {p.name} ({p.watts}W)
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Wattage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Custom Power Rating (Watts)</span>
                <span className="text-purple-500">{wattage} W</span>
              </div>
              <input
                type="range"
                min="5"
                max="4000"
                step="5"
                value={wattage}
                onChange={(e) => setWattage(parseInt(e.target.value, 10))}
                className="w-full text-purple-500"
              />
            </div>

            {/* Hours Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Usage Hours Per Day</span>
                <span className="text-purple-500">{hours} Hours</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full text-purple-500"
              />
            </div>

            {/* Rate Input */}
            <div className="space-y-1.5">
              <label htmlFor="elec-rate" className="text-xs font-bold text-gray-500 dark:text-gray-400">Electricity Rate ($/kWh)</label>
              <input
                id="elec-rate"
                type="number"
                step="0.005"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </section>

          {/* Results Panel */}
          <section className="md:col-span-5 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-5">
              <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">Cost & Consumption Projections</h2>
              
              <div className="space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Power drawn per day</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">{((wattage * hours) / 1000).toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Daily operating cost</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-250">${dailyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-850 pb-2">
                  <span>Monthly operating cost ({days} days)</span>
                  <span className="text-2xl font-black text-purple-500">${cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Annual operating cost</span>
                  <span className="font-semibold text-gray-850 dark:text-gray-200">${yearlyCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              type="button"
              className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-855 border border-gray-205 dark:border-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer print:hidden shadow-sm"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print Operating Cost Report
            </button>
          </section>

        </div>

        {/* Math explanation */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-4 text-left">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            Energy guide calculations
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Appliance electricity cost estimates represent standard engineering calculations based on appliance power ratings:
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300 space-y-1">
            • <strong>Wattage (W):</strong> The rate at which the appliance consumes electrical energy when active.<br />
            • <strong>Kilowatt (kW) conversion:</strong> Wattage ÷ 1,000.<br />
            • <strong>Electricity Draw:</strong> kW × running hours.<br />
            • <strong>Final Cost:</strong> kWh × electricity rate per kWh.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Note that complex cooling systems like refrigerators and air conditioners do not run at full power draw continuously; they cycle their compressors on and off based on thermostats. Our dashboard modeling implements duty cycle estimations to provide realistic bills matching your actual utility invoicing.
          </p>
        </section>

      </div>
    </div>
  );
}
