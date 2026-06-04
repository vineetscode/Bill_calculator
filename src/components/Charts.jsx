import React from "react";
import { Zap, Flame, Droplet } from "lucide-react";

export default function Charts({
  activeTab,
  electricCost,
  gasCost,
  waterCost,
  electricBreakdown,
  gasBreakdown,
  waterBreakdown
}) {
  const totalCost = electricCost + gasCost + waterCost;
  
  // Calculate overall percentages
  const electricPct = totalCost > 0 ? (electricCost / totalCost) * 100 : 0;
  const gasPct = totalCost > 0 ? (gasCost / totalCost) * 100 : 0;
  const waterPct = totalCost > 0 ? (waterCost / totalCost) * 100 : 0;

  // Donut SVG Parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke offsets for donut chart
  const electricOffset = circumference - (electricPct / 100) * circumference;
  const gasOffset = circumference - (gasPct / 100) * circumference;
  const waterOffset = circumference - (waterPct / 100) * circumference;

  // Render sub-breakdowns based on active tab
  let currentBreakdown = [];
  let colorTheme = {
    bar: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/20"
  };

  if (activeTab === "electric") {
    const { baseline, ac, spaceHeater, ev, fridge, laundry, wfh, vampire, pool } = electricBreakdown;
    currentBreakdown = [
      { name: "Home Baseline Idle", cost: baseline, icon: "🏠" },
      { name: "Air Conditioning", cost: ac, icon: "❄️" },
      { name: "Space Heating", cost: spaceHeater, icon: "🔥" },
      { name: "EV Charger", cost: ev, icon: "⚡" },
      { name: "Refrigerator", cost: fridge, icon: "🧊" },
      { name: "Washer & Dryer", cost: laundry, icon: "🌀" },
      { name: "Work From Home (WFH)", cost: wfh || 0, icon: "💻" },
      { name: "Vampire Standby Drain", cost: vampire || 0, icon: "🧛" },
      { name: "Pool & Hot Tub", cost: pool || 0, icon: "🏊" }
    ].filter(item => item.cost > 0 || item.name === "Home Baseline Idle");
    colorTheme = {
      bar: "bg-sky-500",
      text: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/30"
    };
  } else if (activeTab === "gas") {
    const { heating, waterHeating, baseline } = gasBreakdown;
    currentBreakdown = [
      { name: "Main Home Heating", cost: heating, icon: "🔥" },
      { name: "Gas Water Heater", cost: waterHeating, icon: "🚿" },
      { name: "Baseload (Stove / Pilot)", cost: baseline, icon: "🍳" }
    ].filter(item => item.cost > 0);
    colorTheme = {
      bar: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30"
    };
  } else if (activeTab === "water") {
    const { indoorBaseline, shower, lawn } = waterBreakdown;
    currentBreakdown = [
      { name: "Indoor Baseline (Toilets, Sinks)", cost: indoorBaseline, icon: "🚰" },
      { name: "Showers & Baths", cost: shower, icon: "🚿" },
      { name: "Lawn & Gardening", cost: lawn, icon: "🌱" }
    ].filter(item => item.cost > 0);
    colorTheme = {
      bar: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30"
    };
  }

  // Sort breakdown items by cost (descending)
  currentBreakdown.sort((a, b) => b.cost - a.cost);
  const maxSubCost = currentBreakdown.length > 0 ? Math.max(...currentBreakdown.map(i => i.cost)) : 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      
      {/* 1. Donut Chart - Overall Breakdown */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Utility Cost Split
        </h3>
        
        {totalCost > 0 ? (
          <div className="relative flex items-center justify-center w-48 h-48">
            {/* SVG Circle Stack */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Outer Background Circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-gray-100 dark:stroke-gray-800"
                strokeWidth="12"
                fill="transparent"
              />
              
              {/* Electric Slice (Sky Blue) */}
              {electricPct > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-sky-500 transition-all duration-500 ease-out"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={electricOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              )}
              
              {/* Gas Slice (Orange) - Rotated by Electric Angle */}
              {gasPct > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-orange-500 transition-all duration-500 ease-out"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={gasOffset}
                  strokeLinecap="round"
                  transform={`rotate(${(electricPct / 100) * 360} 60 60)`}
                  fill="transparent"
                />
              )}
              
              {/* Water Slice (Blue) - Rotated by Electric + Gas Angle */}
              {waterPct > 0 && (
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-blue-600 transition-all duration-500 ease-out"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={waterOffset}
                  strokeLinecap="round"
                  transform={`rotate(${((electricPct + gasPct) / 100) * 360} 60 60)`}
                  fill="transparent"
                />
              )}
            </svg>
            
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                ${totalCost.toFixed(0)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Total / Mo
              </span>
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center border-4 border-dashed border-gray-200 dark:border-gray-800 rounded-full text-center p-4">
            <span className="text-xs text-gray-400">Configure values to see utility distribution</span>
          </div>
        )}

        {/* Legend Indicators */}
        <div className="grid grid-cols-3 gap-2 w-full mt-6 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{electricPct.toFixed(0)}%</span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Electric (${electricCost.toFixed(0)})</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{gasPct.toFixed(0)}%</span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Gas (${gasCost.toFixed(0)})</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Droplet className="w-3.5 h-3.5 fill-current" />
              <span>{waterPct.toFixed(0)}%</span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Water (${waterCost.toFixed(0)})</span>
          </div>
        </div>
      </div>

      {/* 2. Detailed Breakdown - Category-Specific Progress Bars */}
      <div className="flex flex-col justify-between p-6 rounded-2xl glass-panel shadow-sm self-stretch">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Cost Contributors
          </h3>
          
          <div className="space-y-4">
            {currentBreakdown.length > 0 ? (
              currentBreakdown.map((item, idx) => {
                const itemPct = maxSubCost > 0 ? (item.cost / maxSubCost) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        ${item.cost.toFixed(2)}
                      </span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${colorTheme.bar}`}
                        style={{ width: `${itemPct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                No active costs in this utility category.
              </div>
            )}
          </div>
        </div>
        
        {/* Cost Summary Helper Footer */}
        {currentBreakdown.length > 0 && (
          <div className={`mt-6 p-3 rounded-xl flex items-center justify-between text-xs font-semibold ${colorTheme.bg} ${colorTheme.text}`}>
            <span>Active Utility Total</span>
            <span className="text-sm font-extrabold">
              ${(activeTab === "electric" ? electricCost : activeTab === "gas" ? gasCost : waterCost).toFixed(2)} / month
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
