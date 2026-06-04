import React, { useState } from "react";
import { 
  Zap, 
  Home, 
  Sun, 
  Snowflake, 
  Car, 
  HelpCircle, 
  Laptop, 
  Tv, 
  Waves, 
  Clock, 
  ChevronDown, 
  Sparkles,
  TrendingDown
} from "lucide-react";
import { stateProvidersData } from "../data/utilityRates";

export default function ElectricCalc({
  inputs,
  onChange,
  stateRate = 0.15,
  stateName = "your state",
  selectedState = "CA",
  selectedProviderId = "default",
  onProviderChange
}) {
  const [activeAccordion, setActiveAccordion] = useState(null); // 'wfh' | 'vampire' | 'pool' | null

  const handleInputChange = (field, value) => {
    onChange("electric", {
      ...inputs,
      [field]: value
    });
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const sqFt = inputs.sqFt || 1500;
  const isSummer = inputs.season === "summer";
  const acHours = inputs.acHours || 0;
  const heaterHours = inputs.heaterHours || 0;
  const evHours = inputs.evHours || 0;
  const fridgeHours = inputs.fridgeHours || 24;
  const washerHours = inputs.washerHours || 0;

  // Expansion calculator fields (with defaults)
  const wfhDays = inputs.wfhDays || 0;
  const wfhHours = inputs.wfhHours || 8;
  const wfhDevices = inputs.wfhDevices || 2;
  const vampireCount = inputs.vampireCount || 12;
  const poolPumpHours = inputs.poolPumpHours || 0;
  const poolHeaterHours = inputs.poolHeaterHours || 0;

  // TOU fields
  const touEnabled = inputs.touEnabled || false;
  const touPeakPct = inputs.touPeakPct !== undefined ? inputs.touPeakPct : 30;
  const touOptimized = inputs.touOptimized || false;

  // Calculate local providers
  const providers = stateProvidersData[selectedState] || [
    { id: "default", name: `${stateName} Average (Standard Rate)`, electricityRate: stateRate },
    { id: "prov-a", name: `${stateName} Power & Light (Green)`, electricityRate: stateRate * 0.95 },
    { id: "prov-b", name: `${stateName} Energy Corporation`, electricityRate: stateRate * 1.12 }
  ];

  // Resolve current active provider rate
  const activeProvider = providers.find(p => p.id === selectedProviderId) || providers[0];
  const activeRate = activeProvider.electricityRate || stateRate;

  // Calculate KWh locally for the TOU simulator breakdown panel
  const baselineKwh = sqFt * 0.12;
  const acKwh = isSummer ? (acHours * 3.0 * 30) : 0;
  const heaterKwh = !isSummer ? (heaterHours * 1.5 * 30) : 0;
  const evKwh = evHours * 7.2 * 30;
  const fridgeKwh = fridgeHours * 0.15 * 30;
  const washerKwh = washerHours * 2.5 * 30;
  
  // New expansion calculators math
  const wfhKwh = wfhDevices * 0.1 * wfhHours * (wfhDays * 4.3);
  const vampireKwh = vampireCount * 0.005 * 24 * 30;
  const poolKwh = (poolPumpHours * 1.5 * 30) + (poolHeaterHours * 5.0 * 30);

  const totalKwh = baselineKwh + acKwh + heaterKwh + evKwh + fridgeKwh + washerKwh + wfhKwh + vampireKwh + poolKwh;

  // TOU cost calculations
  const standardCost = totalKwh * activeRate;
  const peakPctValue = touOptimized ? 10 : touPeakPct;
  const peakKwh = totalKwh * (peakPctValue / 100);
  const offPeakKwh = totalKwh * (1 - peakPctValue / 100);
  
  const peakRate = activeRate * 1.8;
  const offPeakRate = activeRate * 0.8;
  const touCost = (peakKwh * peakRate) + (offPeakKwh * offPeakRate);
  const touSavings = standardCost - touCost;

  return (
    <div className="space-y-6">
      
      {/* Utility Provider Dropdown Selector */}
      <div className="p-4.5 rounded-2xl bg-gray-50/50 dark:bg-gray-950/20 border border-gray-200/60 dark:border-gray-800/80 shadow-sm space-y-2">
        <label htmlFor="provider-select" className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wide block">
          Select Utility Provider (Hyper-Local Pricing)
        </label>
        <div className="relative">
          <select
            id="provider-select"
            value={selectedProviderId}
            onChange={(e) => onProviderChange(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-200 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (${(p.electricityRate || stateRate).toFixed(3)}/kWh)
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 1. Basic Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Square Footage Input */}
        <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/35 border border-gray-100 dark:border-gray-800/60">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="sqFt-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Home className="w-4 h-4 text-sky-500" />
              Home Size (Sq Ft)
            </label>
            <input
              id="sqFt-number"
              type="number"
              aria-label="Home square footage"
              value={sqFt}
              min="500"
              max="5000"
              step="100"
              onChange={(e) => handleInputChange("sqFt", Math.max(500, Math.min(5000, Number(e.target.value))))}
              className="w-24 px-2 py-1 text-right text-base font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sky-600 dark:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <input
            id="sqFt-range"
            type="range"
            min="500"
            max="5000"
            step="100"
            value={sqFt}
            onChange={(e) => handleInputChange("sqFt", Number(e.target.value))}
            className="w-full text-sky-500"
          />
          <span className="text-xs text-gray-400 dark:text-gray-500 block mt-1">
            Baseline usage accounts for idle phantom power (~0.12 kWh/sq ft/mo).
          </span>
        </div>

        {/* Seasonal Selector Toggle */}
        <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/35 border border-gray-100 dark:border-gray-800/60 flex flex-col justify-between">
          <div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              {isSummer ? <Sun className="w-4 h-4 text-amber-500" /> : <Snowflake className="w-4 h-4 text-blue-400" />}
              Calculation Season
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 block mb-3">
              Switches heating/cooling logic. Summer runs AC, Winter runs Space Heaters.
            </span>
          </div>
          
          <div className="grid grid-cols-2 p-1.5 bg-gray-200 dark:bg-gray-900 rounded-xl relative">
            <button
              type="button"
              onClick={() => handleInputChange("season", "summer")}
              className={`py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 z-10 cursor-pointer ${
                isSummer
                  ? "bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Sun className="w-4 h-4" />
              Summer
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("season", "winter")}
              className={`py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 z-10 cursor-pointer ${
                !isSummer
                  ? "bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Snowflake className="w-4 h-4" />
              Winter
            </button>
          </div>
        </div>

      </div>

      {/* 2. Appliance Sliders Grid */}
      <div>
        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-500" />
          Active Appliance Power Usage (Hours / Day)
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Air Conditioner Slider - Active only in Summer */}
          <div className={`p-4 rounded-xl border transition-all duration-200 ${
            isSummer 
              ? "bg-white dark:bg-gray-900/50 border-sky-100 dark:border-sky-950/40 shadow-sm" 
              : "bg-gray-50/50 dark:bg-gray-950/20 border-gray-100 dark:border-gray-900/40 opacity-60"
          }`}>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="ac-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>❄️</span>
                Air Conditioner
              </label>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md">
                {isSummer ? `${acHours} hrs` : "0 hrs (Off)"}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Standard central unit draws ~3.0 kW (3,000 Watts).
            </p>
            <input
              id="ac-range"
              type="range"
              min="0"
              max="24"
              step="0.5"
              disabled={!isSummer}
              value={isSummer ? acHours : 0}
              onChange={(e) => handleInputChange("acHours", Number(e.target.value))}
              className="w-full text-sky-500 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          {/* Space Heater Slider - Active only in Winter */}
          <div className={`p-4 rounded-xl border transition-all duration-200 ${
            !isSummer 
              ? "bg-white dark:bg-gray-900/50 border-sky-100 dark:border-sky-950/40 shadow-sm" 
              : "bg-gray-50/50 dark:bg-gray-950/20 border-gray-100 dark:border-gray-900/40 opacity-60"
          }`}>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="heater-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🔥</span>
                Space Heater
              </label>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md">
                {!isSummer ? `${heaterHours} hrs` : "0 hrs (Off)"}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Typical space heater draws ~1.5 kW (1,500 Watts).
            </p>
            <input
              id="heater-range"
              type="range"
              min="0"
              max="24"
              step="0.5"
              disabled={isSummer}
              value={!isSummer ? heaterHours : 0}
              onChange={(e) => handleInputChange("heaterHours", Number(e.target.value))}
              className="w-full text-sky-500 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          {/* EV Charger Slider */}
          <div className="p-4 rounded-xl border bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="ev-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Car className="w-4 h-4 text-sky-500" />
                EV Charger (Level 2)
              </label>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md">
                {evHours} hrs
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Standard 240V Level 2 home charger draws ~7.2 kW.
            </p>
            <input
              id="ev-range"
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={evHours}
              onChange={(e) => handleInputChange("evHours", Number(e.target.value))}
              className="w-full text-sky-500 cursor-pointer"
            />
          </div>

          {/* Refrigerator Slider */}
          <div className="p-4 rounded-xl border bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="fridge-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🧊</span>
                Refrigerator
              </label>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md">
                {fridgeHours} hrs
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Compressor runs intermittently, averaging ~0.15 kW draw.
            </p>
            <input
              id="fridge-range"
              type="range"
              min="0"
              max="24"
              step="1"
              value={fridgeHours}
              onChange={(e) => handleInputChange("fridgeHours", Number(e.target.value))}
              className="w-full text-sky-500 cursor-pointer"
            />
          </div>

          {/* Washer & Dryer Slider */}
          <div className="p-4 rounded-xl border bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-sm sm:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="washer-range" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🌀</span>
                Washer & Dryer Combined
              </label>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md">
                {washerHours} hrs/day
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Average wash + dry cycle draws ~2.5 kW.
            </p>
            <input
              id="washer-range"
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={washerHours}
              onChange={(e) => handleInputChange("washerHours", Number(e.target.value))}
              className="w-full text-sky-500 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* 3. Time-of-Use (TOU) Program Simulator Card */}
      <div className="p-5 rounded-2xl bg-[#f0f9ff]/50 dark:bg-sky-950/10 border border-sky-100/70 dark:border-sky-950/30 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500" />
            <h4 className="text-sm font-extrabold text-gray-800 dark:text-white uppercase tracking-wider">
              Time-of-Use (TOU) Tariff Simulator
            </h4>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={touEnabled}
              onChange={(e) => handleInputChange("touEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-sky-500"></div>
            <span className="ml-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {touEnabled ? "Active" : "Disabled"}
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          TOU rates price electricity higher during peak hours (<strong>4 PM - 9 PM</strong>, e.g. 1.8x base rate) and cheaper off-peak (e.g. 0.8x rate).
        </p>

        {touEnabled && (
          <div className="space-y-4 pt-2 border-t border-sky-100/50 dark:border-sky-950/20 animate-fade-in">
            {/* Peak Share Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Peak Usage Share (4 PM - 9 PM)
                </span>
                <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400">
                  {touOptimized ? "10% (Forced Opt)" : `${touPeakPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                disabled={touOptimized}
                value={touOptimized ? 10 : touPeakPct}
                onChange={(e) => handleInputChange("touPeakPct", Number(e.target.value))}
                className="w-full text-sky-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-1">
                Typical homes consume ~30% during peak. EV charging and dishwashing shift this.
              </span>
            </div>

            {/* Peak Shift Optimizer Toggle */}
            <label htmlFor="tou-opt" className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-sky-100/40 dark:border-sky-950/40 cursor-pointer select-none">
              <input
                id="tou-opt"
                type="checkbox"
                checked={touOptimized}
                onChange={(e) => handleInputChange("touOptimized", e.target.checked)}
                className="w-4 h-4 text-sky-500 focus:ring-sky-400 border-gray-300 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-gray-800 dark:text-gray-200 block">
                  Optimize Run Times (Shift EV, AC & Laundry to 11 PM)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                  Shifts peak share down to 10% automatically.
                </span>
              </div>
            </label>

            {/* Cost Comparison mini-dashboard */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-950/20">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Standard Rate</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">${standardCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">TOU Program</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">${touCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Shift Savings</span>
                {touSavings > 0 ? (
                  <span className="font-extrabold text-emerald-500 flex items-center justify-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    +${touSavings.toFixed(2)}
                  </span>
                ) : (
                  <span className="font-bold text-rose-500">
                    -${Math.abs(touSavings).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {touSavings < 0 && (
              <p className="text-[10px] text-amber-500 font-semibold leading-relaxed">
                ⚠️ Peak usage is too high! You are paying a surge rate during 4 PM - 9 PM. Turn on "Optimize Run Times" to shift load off-peak.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4. Horizontal Expansion Accordions (WFH, Vampire, Pool) */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          Additional Utility Add-Ons & Cost Calculators
        </h4>

        {/* Accordion 1: WFH Cost Estimator */}
        <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/80 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <button
            type="button"
            onClick={() => toggleAccordion("wfh")}
            className="w-full px-4 py-3.5 flex justify-between items-center text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-sky-500" />
              Work-From-Home (WFH) Estimator
            </span>
            <ChevronDown className={`w-4.5 h-4.5 text-gray-400 transform transition-transform ${activeAccordion === "wfh" ? "rotate-180" : ""}`} />
          </button>
          
          {activeAccordion === "wfh" && (
            <div className="px-4 pb-5 pt-1 space-y-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Computers, monitors, chargers, and daytime workspace lighting add up. Calculate the exact electrical footprint of WFH.
              </p>
              
              <div className="space-y-4">
                {/* WFH Days slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="wfhDays-range" className="text-xs font-semibold text-gray-600 dark:text-gray-350">WFH Days / Week</label>
                    <span className="text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">{wfhDays} days</span>
                  </div>
                  <input
                    id="wfhDays-range"
                    type="range"
                    min="0"
                    max="7"
                    step="1"
                    value={wfhDays}
                    onChange={(e) => handleInputChange("wfhDays", Number(e.target.value))}
                    className="w-full text-sky-500 cursor-pointer"
                  />
                </div>

                {/* WFH Hours slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="wfhHours-range" className="text-xs font-semibold text-gray-600 dark:text-gray-350">Work Hours / Day</label>
                    <span className="text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">{wfhHours} hrs</span>
                  </div>
                  <input
                    id="wfhHours-range"
                    type="range"
                    min="1"
                    max="14"
                    step="1"
                    value={wfhHours}
                    onChange={(e) => handleInputChange("wfhHours", Number(e.target.value))}
                    className="w-full text-sky-500 cursor-pointer"
                  />
                </div>

                {/* Device Count slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="wfhDevices-range" className="text-xs font-semibold text-gray-600 dark:text-gray-350">Active Workstation Devices</label>
                    <span className="text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">{wfhDevices} devices</span>
                  </div>
                  <input
                    id="wfhDevices-range"
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={wfhDevices}
                    onChange={(e) => handleInputChange("wfhDevices", Number(e.target.value))}
                    className="w-full text-sky-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Calculates ~100 Watts draw per active laptop + display monitor setup.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Vampire Energy Drain */}
        <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/80 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <button
            type="button"
            onClick={() => toggleAccordion("vampire")}
            className="w-full px-4 py-3.5 flex justify-between items-center text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-sky-500" />
              Vampire Energy Drain Calculator
            </span>
            <ChevronDown className={`w-4.5 h-4.5 text-gray-400 transform transition-transform ${activeAccordion === "vampire" ? "rotate-180" : ""}`} />
          </button>
          
          {activeAccordion === "vampire" && (
            <div className="px-4 pb-5 pt-1 space-y-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Devices plugged into walls consume power on standby (e.g. microwaves, TVs, chargers, game consoles). Estimate the hidden cost.
              </p>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="vampireCount-range" className="text-xs font-semibold text-gray-600 dark:text-gray-350">Number of Standby/Plugged Devices</label>
                  <span className="text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">{vampireCount} devices</span>
                </div>
                <input
                  id="vampireCount-range"
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={vampireCount}
                  onChange={(e) => handleInputChange("vampireCount", Number(e.target.value))}
                  className="w-full text-sky-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Assumes a baseline standby drain of ~5 Watts per active outlet connector, running 24/7.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Pool & Hot Tub Calculator */}
        <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/80 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <button
            type="button"
            onClick={() => toggleAccordion("pool")}
            className="w-full px-4 py-3.5 flex justify-between items-center text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-500" />
              Pool & Hot Tub Calculator
            </span>
            <ChevronDown className={`w-4.5 h-4.5 text-gray-400 transform transition-transform ${activeAccordion === "pool" ? "rotate-180" : ""}`} />
          </button>
          
          {activeAccordion === "pool" && (
            <div className="px-4 pb-5 pt-1 space-y-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Filter pumps and electric resistance heaters are massive energy loads. Model their impact below.
              </p>
              
              <div className="space-y-4">
                {/* Pump Hours */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="poolPump-range" className="text-xs font-semibold text-gray-600 dark:text-gray-350">Pool Filter Pump (Hours / Day)</label>
                    <span className="text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">{poolPumpHours} hrs</span>
                  </div>
                  <input
                    id="poolPump-range"
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    value={poolPumpHours}
                    onChange={(e) => handleInputChange("poolPumpHours", Number(e.target.value))}
                    className="w-full text-sky-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Typical pool pumps draw ~1.5 kW. 8 hours is standard for turnover.
                  </span>
                </div>

                {/* Heater Hours */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="poolHeater-range" className="text-xs font-semibold text-gray-600 dark:text-gray-350">Electric Heater Runtime (Hours / Day)</label>
                    <span className="text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">{poolHeaterHours} hrs</span>
                  </div>
                  <input
                    id="poolHeater-range"
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={poolHeaterHours}
                    onChange={(e) => handleInputChange("poolHeaterHours", Number(e.target.value))}
                    className="w-full text-sky-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Typical electric pool heaters draw a massive ~5.0 kW when firing.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Rate notice */}
      <div className="flex gap-2.5 items-start p-3 bg-sky-50 dark:bg-sky-950/20 text-xs text-sky-700 dark:text-sky-300 rounded-xl">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Calculations are customized for <strong>{activeProvider.name}</strong> using an average residential rate of <strong>${activeRate.toFixed(3)}/kWh</strong>. 
          Formula: (Baseline SqFt consumption + Active Appliance usage + Sub-Calculators) * Provider Rate {touEnabled && "(factoring TOU peak multipliers)"}.
        </p>
      </div>

    </div>
  );
}
