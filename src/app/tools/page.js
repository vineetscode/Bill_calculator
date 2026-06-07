"use client";

import React from "react";
import Link from "next/link";
import { Zap, Droplet, Hammer, Cpu, ShieldAlert, Sparkles, Flame, Sun, HelpCircle } from "lucide-react";

export default function ToolsDashboardPage() {
  const tools = [
    {
      name: "Electricity Cost Calculator",
      href: "/tools/electricity-cost",
      description: "Estimate monthly household power bills by inputting square footage, seasonal cooling runtime, and baseline consumption tariffs.",
      icon: Zap,
      color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30",
    },
    {
      name: "Water Cost Calculator",
      href: "/tools/water-cost",
      description: "Calculate water connection costs based on family occupants, average shower times, lawn watering schedules, and tiered billing tiers.",
      icon: Droplet,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30",
    },
    {
      name: "Appliance Energy Cost Calculator",
      href: "/tools/appliance-energy",
      description: "Check the direct operating costs of specific appliances (Gaming PCs, Space Heaters, Dryers) by adjusting wattage sliders.",
      icon: Cpu,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30",
    },
    {
      name: "EV Charging Cost Calculator",
      href: "/tools/ev-charging",
      description: "Compare electric vehicle home charging costs versus equivalent gas MPG travel costs based on monthly miles driven.",
      icon: Hammer,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
    },
    {
      name: "Solar Savings Calculator",
      href: "/tools/solar-savings",
      description: "Estimate rooftop solar panel requirements, federal tax credit rebates, monthly grid offsets, and project payback periods.",
      icon: Sun,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30",
    },
    {
      name: "Heating Cost Calculator",
      href: "/tools/heating-cost",
      description: "Compare operational expenses between high-efficiency gas furnaces, boiler systems, electric space heaters, and heat pumps.",
      icon: Flame,
      color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <section className="text-center space-y-3.5">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            <Sparkles className="w-3.5 h-3.5" />
            Comparison Tools Suite
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Specialized Utility Cost & Savings Calculators
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed font-sans">
            Benchmark your home energy draw, model dynamic upgrades, and compare utility rate brackets with our collection of interactive calculations.
          </p>
        </section>

        {/* Tools Directory Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-250/60 dark:border-gray-805/60 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="space-y-4 text-left">
                {/* Header icon block */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${tool.color}`}>
                  <tool.icon className="w-5 h-5 fill-current" />
                </div>
                
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight font-sans group-hover:text-emerald-500 transition-colors">
                  {tool.name}
                </h2>
                
                <p className="text-xs text-gray-505 dark:text-gray-400 leading-relaxed font-sans">
                  {tool.description}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={tool.href}
                  className="w-full py-2.5 rounded-xl border border-gray-205 dark:border-gray-800 text-[11px] font-bold text-center block text-gray-650 dark:text-gray-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 dark:hover:bg-emerald-600 transition-all no-underline cursor-pointer"
                >
                  Launch Calculator
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Info Note */}
        <section className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-950/20 border border-gray-150 dark:border-gray-805/50 flex gap-4 items-start max-w-3xl mx-auto text-left print:hidden">
          <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
            Our calculators use standard physics equations (wattage draw, thermal conversion ratios, gallon flow metrics) layered over regional residential energy tariffs. You can further override default rate values inside any tool to match your local grid invoices.
          </p>
        </section>

      </div>
    </div>
  );
}
