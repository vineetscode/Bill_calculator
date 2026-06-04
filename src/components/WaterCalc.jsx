import React from "react";
import { Droplet, Users, ShowerHead, Trees, HelpCircle, AlertTriangle } from "lucide-react";

export default function WaterCalc({
  inputs,
  onChange,
  stateRate = 4.5,
  stateBaseFee = 25.0,
  stateName = "your state"
}) {
  const handleInputChange = (field, value) => {
    onChange("water", {
      ...inputs,
      [field]: value
    });
  };

  const members = inputs.members || 3;
  const lawnFreq = inputs.lawnFreq || 0;
  const showerTime = inputs.showerTime || 10;

  // Calculate gallons for display in explanation
  const baselineGal = members * 50 * 30; // 50 gal/day/member
  const showerGal = showerTime * 2.1 * members * 30; // 2.1 GPM showerhead
  const lawnGal = Math.round(lawnFreq * 120 * 4.3);
  const totalGal = baselineGal + showerGal + lawnGal;

  // Tier Status Evaluation
  let tierName = "Tier 1: Baseline Eco";
  let tierColor = "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40";
  let tierDesc = "Your usage falls within the basic municipal allowance. Lowest rates apply.";

  if (totalGal > 3000 && totalGal <= 10000) {
    tierName = "Tier 2: Standard Residential";
    tierColor = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40";
    tierDesc = "Average residential usage. Surcharge of 1.5x base rate applies on gallons over 3,000.";
  } else if (totalGal > 10000) {
    tierName = "Tier 3: Premium / Heavy Irrigation";
    tierColor = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40";
    tierDesc = "Heavy usage. Premium surcharge of 2.2x base rate applies on gallons over 10,000. Often triggered by frequent lawn watering.";
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Household Size */}
        <div className="p-4 rounded-xl border bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="members-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Household Members
            </label>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md">
              {members} {members === 1 ? "person" : "people"}
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Affects daily baseline usage (averages ~50 gallons/person/day).
          </p>
          <input
            id="members-range"
            type="range"
            min="1"
            max="10"
            step="1"
            value={members}
            onChange={(e) => handleInputChange("members", Number(e.target.value))}
            className="w-full text-blue-500"
          />
        </div>

        {/* Shower Duration */}
        <div className="p-4 rounded-xl border bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="shower-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ShowerHead className="w-4 h-4 text-blue-500" />
              Avg Shower Duration
            </label>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md">
              {showerTime} mins/day
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Standard showerheads run at ~2.1 gallons per minute (GPM).
          </p>
          <input
            id="shower-range"
            type="range"
            min="5"
            max="30"
            step="1"
            value={showerTime}
            onChange={(e) => handleInputChange("showerTime", Number(e.target.value))}
            className="w-full text-blue-500"
          />
        </div>

        {/* Lawn Watering Frequency */}
        <div className="p-4 rounded-xl border bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-sm sm:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="lawn-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Trees className="w-4 h-4 text-blue-500" />
              Lawn Watering Frequency
            </label>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md">
              {lawnFreq} times/week
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Irrigation draws high water volumes, averaging ~120 gallons per watering cycle.
          </p>
          <input
            id="lawn-range"
            type="range"
            min="0"
            max="7"
            step="1"
            value={lawnFreq}
            onChange={(e) => handleInputChange("lawnFreq", Number(e.target.value))}
            className="w-full text-blue-500"
          />
        </div>

      </div>

      {/* 2. Billing Tier Alert Banner */}
      <div className={`p-4 rounded-xl border-l-4 border ${tierColor} transition-all duration-300`}>
        <div className="flex items-center gap-2 font-bold text-base">
          {totalGal > 10000 ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Droplet className="w-4 h-4 shrink-0" />}
          {tierName}
        </div>
        <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
          {tierDesc}
        </p>
        <div className="mt-3 flex justify-between items-center text-xs opacity-80 font-semibold border-t border-current/10 pt-2">
          <span>Est. Gallons: {totalGal.toLocaleString()} gal/mo</span>
          <span>Fixed Base Fee: ${stateBaseFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Rate Notice */}
      <div className="flex gap-2.5 items-start p-3 bg-blue-50 dark:bg-blue-950/20 text-xs text-blue-700 dark:text-blue-300 rounded-xl">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Calculations are customized for <strong>{stateName}</strong> using a tiered water rate beginning at <strong>${stateRate.toFixed(2)} per 1,000 gallons</strong>. 
          Surcharges are automatically applied for consumption above 3,000 gal (1.5x) and 10,000 gal (2.2x).
        </p>
      </div>

    </div>
  );
}
