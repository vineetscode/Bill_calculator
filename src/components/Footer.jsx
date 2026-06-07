"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Award, ShieldCheck, HelpCircle, User } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8fafc] border-t border-gray-200/60 dark:bg-[#080b13] dark:border-gray-805/40 py-12 px-4 transition-colors duration-300 print:py-4 print:mt-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Branding & Mission */}
        <div className="space-y-4 md:col-span-1.5">
          <Link href="/" className="flex items-center gap-2 group no-underline">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white select-none">
              <Leaf className="w-4.5 h-4.5 fill-current" />
            </div>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white leading-none">
              Flowtix
            </span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-sm">
            Flowtix is an independent utility analytics and estimation platform designed to help homeowners and renters understand, model, and reduce their energy, gas, and water costs.
          </p>
          
          {/* Trust Badges */}
          <div className="flex gap-4 pt-1.5">
            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              E-E-A-T Sourced
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Privacy Secure
            </span>
          </div>
        </div>

        {/* Column 2: Tools Directory */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Utility Calculators
          </h3>
          <ul className="space-y-2 list-none p-0 m-0">
            {[
              { name: "Electricity Bill Cost", href: "/tools/electricity-cost" },
              { name: "Water Cost Tier", href: "/tools/water-cost" },
              { name: "Appliance Energy Power", href: "/tools/appliance-energy" },
              { name: "EV Charging Savings", href: "/tools/ev-charging" },
              { name: "Solar Savings Estimates", href: "/tools/solar-savings" },
              { name: "Heating System Cost", href: "/tools/heating-cost" }
            ].map(item => (
              <li key={item.name} className="p-0 m-0">
                <Link href={item.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 no-underline transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Savings Guides */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Utility Savings Blog
          </h3>
          <ul className="space-y-2 list-none p-0 m-0">
            {[
              { name: "15 Electricity Savings Tips", href: "/blog/15-ways-to-reduce-electricity-bill" },
              { name: "Average Utility Bill Costs by State", href: "/blog/average-utility-costs-by-state" },
              { name: "Smart Thermostats Analysis", href: "/blog/how-smart-thermostats-save-money" },
              { name: "Peak Hour Electricity Rates Guide", href: "/blog/understanding-peak-hour-electricity-rates" },
              { name: "Insulation & Weatherization Impact", href: "/blog/insulation-weatherization-costs-impact" }
            ].map(item => (
              <li key={item.name} className="p-0 m-0">
                <Link href={item.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 no-underline transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Author & Legal info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Trust & Support
          </h3>
          
          {/* Author info */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-805/50 flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-sans">
              <span className="font-bold text-gray-800 dark:text-gray-250 block">Vineet Singh</span>
              <span className="text-gray-400 dark:text-gray-500 block mt-0.5 leading-tight">Utility Research & Cost Analysis</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 font-sans">
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 no-underline">About Us</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300 no-underline">Contact</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-gray-700 dark:hover:text-gray-300 no-underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 no-underline">Terms</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-gray-700 dark:hover:text-gray-300 no-underline">Disclaimer</Link>
          </div>
        </div>

      </div>

      {/* Copyright Disclaimer Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-200/60 dark:border-gray-805/40 text-center">
        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-relaxed max-w-3xl mx-auto">
          &copy; {new Date().getFullYear()} Flowtix. All rights reserved. Utility rates are compiled from national datasets (e.g. EIA) and regional municipal reports. Estimates generated by Flowtix are for educational calculations and modeling purposes only and should not be used as official utility billing assertions.
        </p>
      </div>
    </footer>
  );
}
