import React from "react";
import { Flame, HelpCircle } from "lucide-react";

export default function GasCalc({
  inputs,
  onChange,
  stateRate = 1.15,
  stateName = "your state"
}) {
  const handleInputChange = (field, value) => {
    onChange("gas", {
      ...inputs,
      [field]: value
    });
  };

  const heatingType = inputs.heatingType || "furnace";
  const thermostat = inputs.thermostat || 68;

  // Heating types configs
  const heatingOptions = [
    { id: "furnace", title: "Gas Furnace", desc: "Forced-air central heating system (~50 Therms baseline)", icon: "💨" },
    { id: "boiler", title: "Gas Boiler", desc: "Steam or hot-water radiator system (~60 Therms baseline)", icon: "💧" },
    { id: "water_only", title: "Water Heater Only", desc: "Heating systems are electric or zone-controlled; gas only for hot water (~15 Therms baseline)", icon: "🚿" }
  ];

  const hasCentralHeating = heatingType !== "water_only";

  return (
    <div className="space-y-6">
      
      {/* 1. Heating Type Selector - Premium Clickable Cards */}
      <div>
        <span className="text-base font-semibold text-gray-700 dark:text-gray-300 block mb-3">
          Primary Gas Heating System
        </span>
        
        <div className="grid grid-cols-1 gap-3">
          {heatingOptions.map((option) => {
            const isSelected = heatingType === option.id;
            return (
              <button suppressHydrationWarning={true}
                key={option.id}
                type="button"
                onClick={() => handleInputChange("heatingType", option.id)}
                className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-gray-900 border-orange-500 ring-2 ring-orange-500/20 shadow-sm"
                    : "bg-gray-50/50 dark:bg-gray-800/35 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-2xl mt-1 select-none">{option.icon}</span>
                <div>
                  <span className="font-bold text-base text-gray-800 dark:text-gray-200 block">
                    {option.title}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 block mt-0.5">
                    {option.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Thermostat Setting Slider */}
      <div className={`p-4 rounded-xl border transition-all duration-200 ${
        hasCentralHeating
          ? "bg-white dark:bg-gray-900/50 border-orange-100 dark:border-orange-950/40 shadow-sm"
          : "bg-gray-50/50 dark:bg-gray-950/20 border-gray-100 dark:border-gray-900 opacity-60"
      }`}>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="thermostat-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span>🌡️</span>
            Winter Thermostat Setting
          </label>
          <span className={`text-sm font-bold px-2.5 py-0.5 rounded-md ${
            hasCentralHeating
              ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40"
              : "text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800"
          }`}>
            {hasCentralHeating ? `${thermostat}°F` : "Disabled"}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Industry standard is 68°F. Every degree offset changes gas heating consumption by ~6%.
        </p>
        
        <input suppressHydrationWarning={true}
          id="thermostat-range"
          type="range"
          min="60"
          max="80"
          step="1"
          disabled={!hasCentralHeating}
          value={hasCentralHeating ? thermostat : 68}
          onChange={(e) => handleInputChange("thermostat", Number(e.target.value))}
          className="w-full text-orange-500 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {/* Helper values */}
        {hasCentralHeating && (
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
            <span>60°F (Eco Saving)</span>
            <span className={thermostat === 68 ? "text-orange-500 font-bold" : ""}>68°F (Standard)</span>
            <span>80°F (Max Warmth)</span>
          </div>
        )}

        {!hasCentralHeating && (
          <span className="text-xs text-orange-500 font-medium block mt-2">
            Thermostat controls only apply to central gas heating systems.
          </span>
        )}
      </div>

      {/* Rate Notice */}
      <div className="flex gap-2.5 items-start p-3 bg-orange-50 dark:bg-orange-950/20 text-xs text-orange-700 dark:text-orange-300 rounded-xl">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Calculations are customized for <strong>{stateName}</strong> using an average natural gas rate of <strong>${stateRate.toFixed(2)}/Therm</strong>.
          Formula: (Heating Baseline Therms) * (Thermostat Factor) * State Rate.
        </p>
      </div>

    </div>
  );
}
