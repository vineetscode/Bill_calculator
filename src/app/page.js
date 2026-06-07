"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Flame, 
  Droplet, 
  Sun, 
  Moon, 
  Share2, 
  Check, 
  TrendingUp, 
  Leaf, 
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Settings,
  MapPin,
  Search,
  Printer,
  Camera,
  Upload,
  ShieldAlert,
  Award,
  FileText,
  Sparkles
} from "lucide-react";

import { stateUtilityData, stateProvidersData, stateCapitalsMap } from "../data/utilityRates";
import { lookupStateByZip } from "../utils/zipLookup";
import { getRatesForState } from "../services/ratesService";
import ElectricCalc from "../components/ElectricCalc";
import GasCalc from "../components/GasCalc";
import WaterCalc from "../components/WaterCalc";
import Charts from "../components/Charts";
import SEO from "../components/SEO";

// Calculation helpers
const calcElectric = (inputs, rate) => {
  const sqFt = inputs.sqFt || 1500;
  const isSummer = inputs.season === "summer";
  const acHours = inputs.acHours || 0;
  const heaterHours = inputs.heaterHours || 0;
  const evHours = inputs.evHours || 0;
  const fridgeHours = inputs.fridgeHours || 24;
  const washerHours = inputs.washerHours || 0;

  // New expansion calculators inputs
  const wfhDays = inputs.wfhDays || 0;
  const wfhHours = inputs.wfhHours || 8;
  const wfhDevices = inputs.wfhDevices || 2;
  const vampireCount = inputs.vampireCount || 12;
  const poolPumpHours = inputs.poolPumpHours || 0;
  const poolHeaterHours = inputs.poolHeaterHours || 0;

  const baselineKwh = sqFt * 0.12;
  const acKwh = isSummer ? (acHours * 3.0 * 30) : 0;
  const heaterKwh = !isSummer ? (heaterHours * 1.5 * 30) : 0;
  const evKwh = evHours * 7.2 * 30;
  const fridgeKwh = fridgeHours * 0.15 * 30;
  const washerKwh = washerHours * 2.5 * 30;

  // WFH: active monitor + pc drawn at ~100W per device
  const wfhKwh = wfhDevices * 0.1 * wfhHours * (wfhDays * 4.3);
  // Vampire load: standby drawers at ~5W per device active 24/7
  const vampireKwh = vampireCount * 0.005 * 24 * 30;
  // Pool pump (1.5kW) and Pool heater (5kW)
  const poolKwh = (poolPumpHours * 1.5 * 30) + (poolHeaterHours * 5.0 * 30);

  const totalKwh = baselineKwh + acKwh + heaterKwh + evKwh + fridgeKwh + washerKwh + wfhKwh + vampireKwh + poolKwh;
  
  // Calculate Standard Cost vs Time of Use
  const standardCost = totalKwh * rate;
  let cost = standardCost;

  if (inputs.touEnabled) {
    const peakPct = inputs.touOptimized ? 10 : (inputs.touPeakPct !== undefined ? inputs.touPeakPct : 30);
    const peakKwh = totalKwh * (peakPct / 100);
    const offPeakKwh = totalKwh * (1 - peakPct / 100);
    const peakRate = rate * 1.8;
    const offPeakRate = rate * 0.8;
    cost = (peakKwh * peakRate) + (offPeakKwh * offPeakRate);
  }

  // Scale slices to make sure their sum equals final cost (which might be lower due to TOU savings)
  const scale = standardCost > 0 ? cost / standardCost : 1;

  return {
    cost,
    kwh: totalKwh,
    breakdown: {
      baseline: (baselineKwh * rate) * scale,
      ac: (acKwh * rate) * scale,
      spaceHeater: (heaterKwh * rate) * scale,
      ev: (evKwh * rate) * scale,
      fridge: (fridgeKwh * rate) * scale,
      laundry: (washerKwh * rate) * scale,
      wfh: (wfhKwh * rate) * scale,
      vampire: (vampireKwh * rate) * scale,
      pool: (poolKwh * rate) * scale
    }
  };
};

const calcGas = (inputs, rate) => {
  const heatingType = inputs.heatingType || "furnace";
  const thermostat = inputs.thermostat || 68;

  let heatingBaseline = 0;
  if (heatingType === "furnace") heatingBaseline = 50;
  else if (heatingType === "boiler") heatingBaseline = 60;
  
  const waterHeatingBaseline = 15;
  const thermostatFactor = heatingType !== "water_only" ? (1 + (thermostat - 68) * 0.06) : 1;

  const heatingTherms = heatingBaseline * thermostatFactor;
  const totalTherms = heatingTherms + waterHeatingBaseline;
  const cost = totalTherms * rate;

  return {
    cost,
    therms: totalTherms,
    breakdown: {
      heating: heatingTherms * rate,
      waterHeating: waterHeatingBaseline * rate,
      baseline: 0
    }
  };
};

const calcWater = (inputs, rate, baseFee) => {
  const members = inputs.members || 3;
  const lawnFreq = inputs.lawnFreq || 0;
  const showerTime = inputs.showerTime || 10;

  const baselineGal = members * 50 * 30;
  const showerGal = showerTime * 2.1 * members * 30;
  const lawnGal = lawnFreq * 120 * 4.3;

  const totalGallons = baselineGal + showerGal + lawnGal;

  const tier1Limit = 3000;
  const tier2Limit = 10000;
  const r1 = rate;
  const r2 = rate * 1.5;
  const r3 = rate * 2.2;

  let cost = baseFee;
  let remainingGallons = totalGallons;

  const t1Gallons = Math.min(remainingGallons, tier1Limit);
  cost += (t1Gallons / 1000) * r1;
  remainingGallons -= t1Gallons;

  if (remainingGallons > 0) {
    const t2Gallons = Math.min(remainingGallons, tier2Limit - tier1Limit);
    cost += (t2Gallons / 1000) * r2;
    remainingGallons -= t2Gallons;
  }

  if (remainingGallons > 0) {
    cost += (remainingGallons / 1000) * r3;
  }

  const effectiveRate = totalGallons > 0 ? (cost - baseFee) / totalGallons : 0;
  const baselineCost = baseFee + (baselineGal * effectiveRate);
  const showerCost = showerGal * effectiveRate;
  const lawnCost = lawnGal * effectiveRate;

  return {
    cost,
    gallons: totalGallons,
    breakdown: {
      indoorBaseline: baselineCost,
      shower: showerCost,
      lawn: lawnCost
    }
  };
};

const defaultElectric = {
  sqFt: 1500,
  season: "summer",
  acHours: 6,
  heaterHours: 0,
  evHours: 2,
  fridgeHours: 24,
  washerHours: 1,
  wfhDays: 0,
  wfhHours: 8,
  wfhDevices: 2,
  vampireCount: 12,
  poolPumpHours: 0,
  poolHeaterHours: 0,
  touEnabled: false,
  touPeakPct: 30,
  touOptimized: false
};

const defaultGas = {
  heatingType: "furnace",
  thermostat: 68
};

const defaultWater = {
  members: 3,
  showerTime: 10,
  lawnFreq: 2
};

export default function Home({ initialState = "CA", initialTab = "electric" }) {
  const [theme] = useState("dark");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedState, setSelectedState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // ZIP code search states
  const [zipInput, setZipInput] = useState("");
  const [zipFeedback, setZipFeedback] = useState(null); // { status: "success"|"error", message: string }

  // Decoupled API rates state
  const [apiRates, setApiRates] = useState(() => stateUtilityData[initialState] || stateUtilityData.CA);
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Local Rate Overrides state (persisted per state code in localStorage)
  const [localOverrides, setLocalOverrides] = useState({
    electricityRate: "",
    gasRate: "",
    waterRate: "",
    waterBaseFee: ""
  });

  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Utility calculator states
  const [electricInputs, setElectricInputs] = useState(defaultElectric);
  const [gasInputs, setGasInputs] = useState(defaultGas);
  const [waterInputs, setWaterInputs] = useState(defaultWater);

  // Checklist items state (gamification)
  const [checkedTips, setCheckedTips] = useState({
    led: false,
    ac: false,
    spaceHeater: false,
    ev: false,
    thermostat: false,
    shower: false,
    lawn: false
  });

  // Hyper-Local Provider State
  const [selectedProviderId, setSelectedProviderId] = useState("default");

  // Weather States
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState(null);

  // OCR Bill Scanner States
  const [scanState, setScanState] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState("");
  const [extractedData, setExtractedData] = useState(null); // { rate: number, zip: string, provider: { state, providerId } }

  // Extended sections states
  const [stateSearch, setStateSearch] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [weatherCollapsed, setWeatherCollapsed] = useState(true);
  const [ocrCollapsed, setOcrCollapsed] = useState(true);

  // Hydration safety mount check
  useEffect(() => {
    setHasMounted(true);
    setShareUrl(window.location.href);

    const params = new URLSearchParams(window.location.search);
    if (params.has("st")) setSelectedState(params.get("st"));
    if (params.has("tab")) setActiveTab(params.get("tab"));
    document.documentElement.classList.add("dark");

    // Load Electric parameters (including WFH, Vampire, Pool & TOU)
    const updatedElectric = { ...defaultElectric };
    if (params.has("esq")) updatedElectric.sqFt = Number(params.get("esq"));
    if (params.has("esea")) updatedElectric.season = params.get("esea");
    if (params.has("eac")) updatedElectric.acHours = Number(params.get("eac"));
    if (params.has("eht")) updatedElectric.heaterHours = Number(params.get("eht"));
    if (params.has("eev")) updatedElectric.evHours = Number(params.get("eev"));
    if (params.has("efr")) updatedElectric.fridgeHours = Number(params.get("efr"));
    if (params.has("ewsh")) updatedElectric.washerHours = Number(params.get("ewsh"));
    if (params.has("ewfd")) updatedElectric.wfhDays = Number(params.get("ewfd"));
    if (params.has("ewfh")) updatedElectric.wfhHours = Number(params.get("ewfh"));
    if (params.has("ewfdv")) updatedElectric.wfhDevices = Number(params.get("ewfdv"));
    if (params.has("evmp")) updatedElectric.vampireCount = Number(params.get("evmp"));
    if (params.has("epph")) updatedElectric.poolPumpHours = Number(params.get("epph"));
    if (params.has("ephh")) updatedElectric.poolHeaterHours = Number(params.get("ephh"));
    if (params.has("etou")) updatedElectric.touEnabled = params.get("etou") === "true";
    if (params.has("etoup")) updatedElectric.touPeakPct = Number(params.get("etoup"));
    if (params.has("etoopt")) updatedElectric.touOptimized = params.get("etoopt") === "true";
    setElectricInputs(updatedElectric);

    // Load Gas parameters
    const updatedGas = { ...defaultGas };
    if (params.has("ght")) updatedGas.heatingType = params.get("ght");
    if (params.has("gth")) updatedGas.thermostat = Number(params.get("gth"));
    setGasInputs(updatedGas);

    // Load Water parameters
    const updatedWater = { ...defaultWater };
    if (params.has("wmb")) updatedWater.members = Number(params.get("wmb"));
    if (params.has("wsh")) updatedWater.showerTime = Number(params.get("wsh"));
    if (params.has("wln")) updatedWater.lawnFreq = Number(params.get("wln"));
    setWaterInputs(updatedWater);
  }, []);


  // Inputs Change Handler Fix
  const handleInputsChange = (tab, updatedInputs) => {
    if (tab === "electric") {
      setElectricInputs(updatedInputs);
    } else if (tab === "gas") {
      setGasInputs(updatedInputs);
    } else if (tab === "water") {
      setWaterInputs(updatedInputs);
    }
  };

  // Checklist Tips Toggle Fix
  const handleCheckboxChange = (tipKey) => {
    setCheckedTips(prev => ({
      ...prev,
      [tipKey]: !prev[tipKey]
    }));
  };

  // Reset selected provider and fetch weather when state changes
  useEffect(() => {
    if (!hasMounted) return;
    setSelectedProviderId("default");

    const capital = stateCapitalsMap[selectedState];
    if (!capital) return;

    async function fetchWeather() {
      setWeatherLoading(true);
      setWeatherData(null);
      setWeatherAlert(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${capital.lat}&longitude=${capital.lon}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.daily) {
            const tempsMax = data.daily.temperature_2m_max || [];
            const tempsMin = data.daily.temperature_2m_min || [];
            const maxTemp = tempsMax[0] !== undefined ? tempsMax[0] : 75;
            const minTemp = tempsMin[0] !== undefined ? tempsMin[0] : 55;
            
            setWeatherData({
              capitalName: capital.name,
              maxTemp,
              minTemp,
              forecastMax: tempsMax.slice(0, 5),
              forecastMin: tempsMin.slice(0, 5),
              dates: (data.daily.time || []).slice(0, 5)
            });

            // Analyze 7-day temps for alerts
            const highestTemp = Math.max(...tempsMax);
            const lowestTemp = Math.min(...tempsMin);
            
            if (highestTemp >= 85) {
              setWeatherAlert({
                type: "warning",
                message: `Expect a ${highestTemp.toFixed(0)}°F heatwave next week in ${stateUtilityData[selectedState]?.name || selectedState} — your AC costs could spike by 25%.`
              });
            } else if (lowestTemp <= 40) {
              setWeatherAlert({
                type: "caution",
                message: `Expect freezing weather (${lowestTemp.toFixed(0)}°F) in ${stateUtilityData[selectedState]?.name || selectedState} next week — heating costs could spike by 30%.`
              });
            } else {
              setWeatherAlert({
                type: "info",
                message: `Mild weather expected in ${stateUtilityData[selectedState]?.name || selectedState} (average ${((highestTemp + lowestTemp) / 2).toFixed(0)}°F). Great time to open windows and save on utility costs!`
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchWeather();
  }, [selectedState, hasMounted]);

  // Fetch rates dynamically from decoupled cache API when state changes
  useEffect(() => {
    if (!hasMounted) return;

    async function loadRates() {
      setIsRatesLoading(true);
      const rates = await getRatesForState(selectedState);
      setApiRates(rates);
      setIsRatesLoading(false);
    }
    loadRates();

    // Check localStorage for user-centric custom overrides
    const key = `flowtix_override_${selectedState}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setLocalOverrides(JSON.parse(saved));
    } else {
      setLocalOverrides({
        electricityRate: "",
        gasRate: "",
        waterRate: "",
        waterBaseFee: ""
      });
    }
  }, [selectedState, hasMounted]);

  // Update URL search parameters silently as inputs change
  useEffect(() => {
    if (!hasMounted) return;

    const params = new URLSearchParams();
    params.set("st", selectedState);
    params.set("tab", activeTab);
    params.set("theme", theme);
    
    // Electric parameters
    params.set("esq", electricInputs.sqFt);
    params.set("esea", electricInputs.season);
    params.set("eac", electricInputs.acHours);
    params.set("eht", electricInputs.heaterHours);
    params.set("eev", electricInputs.evHours);
    params.set("efr", electricInputs.fridgeHours);
    params.set("ewsh", electricInputs.washerHours);
    params.set("ewfd", electricInputs.wfhDays || 0);
    params.set("ewfh", electricInputs.wfhHours || 8);
    params.set("ewfdv", electricInputs.wfhDevices || 2);
    params.set("evmp", electricInputs.vampireCount || 12);
    params.set("epph", electricInputs.poolPumpHours || 0);
    params.set("ephh", electricInputs.poolHeaterHours || 0);
    params.set("etou", electricInputs.touEnabled ? "true" : "false");
    params.set("etoup", electricInputs.touPeakPct || 30);
    params.set("etoopt", electricInputs.touOptimized ? "true" : "false");

    // Gas
    params.set("ght", gasInputs.heatingType);
    params.set("gth", gasInputs.thermostat);

    // Water
    params.set("wmb", waterInputs.members);
    params.set("wsh", waterInputs.showerTime);
    params.set("wln", waterInputs.lawnFreq);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
    setShareUrl(window.location.href);
  }, [selectedState, activeTab, theme, electricInputs, gasInputs, waterInputs, hasMounted]);

  // Handle ZIP Code Pin Search lookup
  const handleZipSearch = (e) => {
    e.preventDefault();
    setZipFeedback(null);

    const detectedState = lookupStateByZip(zipInput);
    if (detectedState) {
      setSelectedState(detectedState);
      const stateName = stateUtilityData[detectedState]?.name || detectedState;
      setZipFeedback({
        status: "success",
        message: `📍 Located: ${stateName} (${detectedState})`
      });
    } else {
      setZipFeedback({
        status: "error",
        message: "❌ Invalid US ZIP code."
      });
    }
  };

  // Compile active rates (prefer user overrides and utility provider selections)
  const getActiveRates = () => {
    let baseElec = apiRates.electricityRate;
    let baseGas = apiRates.gasRate;

    // Resolve providers list
    const providers = stateProvidersData[selectedState] || [
      { id: "default", name: `${stateUtilityData[selectedState]?.name || selectedState} Average (Standard Rate)`, electricityRate: stateUtilityData[selectedState]?.electricityRate || 0.15, gasRate: stateUtilityData[selectedState]?.gasRate || 1.1 },
      { id: "prov-a", name: `${stateUtilityData[selectedState]?.name || selectedState} Power & Light (Green)`, electricityRate: (stateUtilityData[selectedState]?.electricityRate || 0.15) * 0.95, gasRate: (stateUtilityData[selectedState]?.gasRate || 1.1) * 0.9 },
      { id: "prov-b", name: `${stateUtilityData[selectedState]?.name || selectedState} Energy Corporation`, electricityRate: (stateUtilityData[selectedState]?.electricityRate || 0.15) * 1.12, gasRate: (stateUtilityData[selectedState]?.gasRate || 1.1) * 1.15 }
    ];

    const provider = providers.find(p => p.id === selectedProviderId) || providers[0];
    if (provider && provider.id !== "default") {
      baseElec = provider.electricityRate || baseElec;
      baseGas = provider.gasRate || baseGas;
    }

    const elecRate = localOverrides.electricityRate ? Number(localOverrides.electricityRate) : baseElec;
    const gasRate = localOverrides.gasRate ? Number(localOverrides.gasRate) : baseGas;
    const waterRate = localOverrides.waterRate ? Number(localOverrides.waterRate) : apiRates.waterRate;
    const waterFee = localOverrides.waterBaseFee ? Number(localOverrides.waterBaseFee) : apiRates.waterBaseFee;

    return {
      name: provider.name || apiRates.name || stateUtilityData[selectedState].name,
      electricityRate: elecRate,
      gasRate: gasRate,
      waterRate: waterRate,
      waterBaseFee: waterFee
    };
  };

  const activeRates = getActiveRates();

  // Run Calculations
  const electricResult = calcElectric(electricInputs, activeRates.electricityRate);
  const gasResult = calcGas(gasInputs, activeRates.gasRate);
  const waterResult = calcWater(waterInputs, activeRates.waterRate, activeRates.waterBaseFee);

  const electricCost = electricResult.cost;
  const gasCost = gasResult.cost;
  const waterCost = waterResult.cost;
  const totalCost = electricCost + gasCost + waterCost;

  // WFH, Vampire, and Pool savings optimization calculations
  const calcSavingsDetails = () => {
    const optElectricInputs = { ...electricInputs };
    if (optElectricInputs.acHours > 2) optElectricInputs.acHours -= 2;
    if (optElectricInputs.heaterHours > 2) optElectricInputs.heaterHours -= 2;
    // Optimize WFH & Vampire
    if (optElectricInputs.wfhDays > 0) optElectricInputs.wfhHours = Math.max(4, optElectricInputs.wfhHours - 2);
    if (optElectricInputs.vampireCount > 0) optElectricInputs.vampireCount = Math.max(2, optElectricInputs.vampireCount - 8);
    // Optimize Pool
    if (optElectricInputs.poolPumpHours > 0) optElectricInputs.poolPumpHours = Math.max(6, optElectricInputs.poolPumpHours - 2);
    if (optElectricInputs.poolHeaterHours > 0) optElectricInputs.poolHeaterHours = Math.max(0, optElectricInputs.poolHeaterHours - 1);
    
    const optElectricResult = calcElectric(optElectricInputs, activeRates.electricityRate);
    const baselineOptKwh = electricInputs.sqFt * 0.12 * 0.2;
    const baselineOptCost = baselineOptKwh * activeRates.electricityRate;
    
    const evSavings = electricResult.breakdown.ev * 0.3;
    const laundrySavings = electricResult.breakdown.laundry * 0.25;
    
    const rawElectricSavings = (electricCost - optElectricResult.cost) + baselineOptCost + evSavings + laundrySavings;
    const finalElectricSavings = Math.max(0, Math.min(electricCost, rawElectricSavings));

    // Gas
    const optGasInputs = { ...gasInputs };
    if (optGasInputs.thermostat > 62) optGasInputs.thermostat -= 2;
    const optGasResult = calcGas(optGasInputs, activeRates.gasRate);
    const gasWaterSavings = gasResult.breakdown.waterHeating * 0.10;
    
    const rawGasSavings = (gasCost - optGasResult.cost) + gasWaterSavings;
    const finalGasSavings = Math.max(0, Math.min(gasCost, rawGasSavings));

    // Water
    const optWaterInputs = { ...waterInputs };
    if (optWaterInputs.showerTime > 7) optWaterInputs.showerTime -= 2;
    if (optWaterInputs.lawnFreq > 0) optWaterInputs.lawnFreq -= 1;
    const optWaterResult = calcWater(optWaterInputs, activeRates.waterRate, activeRates.waterBaseFee);
    
    const rawWaterSavings = waterCost - optWaterResult.cost;
    const finalWaterSavings = Math.max(0, Math.min(waterCost, rawWaterSavings));

    return {
      electric: finalElectricSavings,
      gas: finalGasSavings,
      water: finalWaterSavings,
      total: finalElectricSavings + finalGasSavings + finalWaterSavings,
      individualTips: {
        led: baselineOptCost,
        ac: (electricResult.breakdown.ac / (electricInputs.acHours || 1)) * 2,
        spaceHeater: (electricResult.breakdown.spaceHeater / (electricInputs.heaterHours || 1)) * 2,
        ev: evSavings,
        thermostat: gasCost - optGasResult.cost,
        shower: (waterResult.breakdown.shower / (waterInputs.showerTime || 1)) * 2,
        lawn: (waterResult.breakdown.lawn / (waterInputs.lawnFreq || 1)) * 1
      }
    };
  };

  const savingsPotential = calcSavingsDetails();

  // OCR Upload Handler
  const handleOcrUpload = async (file) => {
    if (!file) return;
    setScanState("loading");
    setScanProgress(0);
    setScanError("");

    try {
      // Dynamically load Tesseract from CDN on demand to prevent Next.js SSR build resolution crashes (.js.js lookup errors)
      let TesseractLib = window.Tesseract;
      if (!TesseractLib) {
        TesseractLib = await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
          script.onload = () => {
            if (window.Tesseract) {
              resolve(window.Tesseract);
            } else {
              reject(new Error("Tesseract not available on window"));
            }
          };
          script.onerror = () => reject(new Error("Failed to load Tesseract from CDN"));
          document.body.appendChild(script);
        });
      }

      const result = await TesseractLib.recognize(
        file,
        "eng",
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setScanProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const text = result.data.text.toLowerCase();
      console.log("OCR Extracted Text:", text);

      let detectedRate = null;
      let detectedZip = null;
      let detectedProvider = null;

      // Extract ZIP
      const zipMatch = text.match(/\b(zip|postal|code)\b\D*(\d{5})\b/) || text.match(/\b\d{5}\b/);
      if (zipMatch) {
        detectedZip = zipMatch[1] && /^\d{5}$/.test(zipMatch[2]) ? zipMatch[2] : zipMatch[0];
      }

      // Extract Rate (like 0.384, 0.145 kwh)
      const elecMatch = text.match(/(\d\.\d{3,4})\s*\/?\s*kwh/) || text.match(/rate\D*(\d\.\d{3,4})/) || text.match(/\b0\.\d{2,4}\b/);
      if (elecMatch) {
        detectedRate = Number(elecMatch[1] || elecMatch[0]);
      }

      // Extract Provider
      if (text.includes("pg&e") || text.includes("pacific gas")) detectedProvider = { state: "CA", providerId: "pge" };
      else if (text.includes("sce") || text.includes("edison")) detectedProvider = { state: "CA", providerId: "sce" };
      else if (text.includes("coned") || text.includes("conedison")) detectedProvider = { state: "NY", providerId: "coned" };
      else if (text.includes("oncor")) detectedProvider = { state: "TX", providerId: "oncor" };
      else if (text.includes("txu")) detectedProvider = { state: "TX", providerId: "txu" };
      else if (text.includes("fpl") || text.includes("florida power")) detectedProvider = { state: "FL", providerId: "fpl" };

      if (detectedRate || detectedZip || detectedProvider) {
        setExtractedData({
          rate: detectedRate,
          zip: detectedZip,
          provider: detectedProvider
        });
        setScanState("success");
      } else {
        setScanError("We scanned the text but couldn't identify clear utility rates or ZIPs. Please try a sample preset below to see the scanner in action!");
        setScanState("error");
      }
    } catch (err) {
      console.error(err);
      setScanError("Bill OCR processing failed. Check network or try a preset sample bill below!");
      setScanState("error");
    }
  };

  const applyOcrData = () => {
    if (!extractedData) return;
    if (extractedData.zip) {
      setZipInput(extractedData.zip);
      const state = lookupStateByZip(extractedData.zip);
      if (state) {
        setSelectedState(state);
      }
    }
    if (extractedData.provider) {
      setSelectedState(extractedData.provider.state);
      setSelectedProviderId(extractedData.provider.providerId);
    }
    if (extractedData.rate) {
      handleOverrideChange("electricityRate", extractedData.rate.toString());
    }
    setScanState("idle");
    setExtractedData(null);
  };

  const triggerSampleScan = (type) => {
    setScanState("loading");
    setScanProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        if (type === "electric") {
          setExtractedData({
            rate: 0.385,
            zip: "94103",
            provider: { state: "CA", providerId: "pge" }
          });
        } else {
          setExtractedData({
            rate: 0.288,
            zip: "10001",
            provider: { state: "NY", providerId: "coned" }
          });
        }
        setScanState("success");
      }
    }, 200);
  };

  // Compare with Neighbors Grade generator
  const getEcoScoreAndAverage = () => {
    const members = waterInputs.members || 3;
    const sqFt = electricInputs.sqFt || 1500;
    
    // Average baseline usage definitions based on home size and occupants
    const avgElecKwh = sqFt * 0.12 + 6.0 * 30 + 1.0 * 7.2 * 30 * 0.1;
    const avgGasTherms = 45 + (members * 5);
    const avgWaterGal = members * 60 * 30; // 60 Gallons/person/day is average US
    
    const avgElecCost = avgElecKwh * activeRates.electricityRate;
    const avgGasCost = avgGasTherms * activeRates.gasRate;
    const avgWaterCost = activeRates.waterBaseFee + (avgWaterGal / 1000) * activeRates.waterRate;
    
    const avgTotalCost = avgElecCost + avgGasCost + avgWaterCost;
    const ratio = totalCost / (avgTotalCost || 1);
    
    let grade = "B";
    let color = "text-sky-500 dark:text-sky-400";
    let bg = "bg-sky-500/15";
    let desc = "Average usage. You're in line with regional baseline standards.";

    if (ratio < 0.75) {
      grade = "A";
      color = "text-emerald-500 dark:text-emerald-450";
      bg = "bg-emerald-500/15";
      desc = "Eco-Champion! Your home consumes far less than state benchmarks.";
    } else if (ratio < 1.05) {
      grade = "B";
      color = "text-sky-500 dark:text-sky-405";
      bg = "bg-sky-500/15";
      desc = "Good. Your utilities are optimized near typical values.";
    } else if (ratio < 1.30) {
      grade = "C";
      color = "text-amber-500 dark:text-amber-450";
      bg = "bg-amber-500/15";
      desc = "Moderate consumption. There are simple steps to trim your bills.";
    } else {
      grade = "D";
      color = "text-rose-500 dark:text-rose-455";
      bg = "bg-rose-500/15";
      desc = "High usage! Check the energy-saving action checklist to cut costs.";
    }

    return { avgTotalCost, ratio, grade, color, bg, desc };
  };

  const ecoScore = getEcoScoreAndAverage();

  const handleOverrideChange = (field, value) => {
    const updated = {
      ...localOverrides,
      [field]: value
    };
    setLocalOverrides(updated);
    const key = `flowtix_override_${selectedState}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const clearOverrides = () => {
    const key = `flowtix_override_${selectedState}`;
    localStorage.removeItem(key);
    setLocalOverrides({
      electricityRate: "",
      gasRate: "",
      waterRate: "",
      waterBaseFee: ""
    });
  };

  const calculateAppliedSavings = () => {
    let applied = 0;
    const tips = savingsPotential.individualTips;
    if (checkedTips.led) applied += tips.led;
    if (checkedTips.ac && electricInputs.season === "summer" && electricInputs.acHours > 0) applied += tips.ac;
    if (checkedTips.spaceHeater && electricInputs.season === "winter" && electricInputs.heaterHours > 0) applied += tips.spaceHeater;
    if (checkedTips.ev && electricInputs.evHours > 0) applied += tips.ev;
    if (checkedTips.thermostat && gasInputs.heatingType !== "water_only") applied += tips.thermostat;
    if (checkedTips.shower) applied += tips.shower;
    if (checkedTips.lawn && waterInputs.lawnFreq > 0) applied += tips.lawn;
    return Math.min(totalCost, applied);
  };

  const appliedSavings = calculateAppliedSavings();

  const handleShareClick = async () => {
    const shareData = {
      title: "Flowtix Utility Estimator",
      text: `Calculate your household utility bill savings in ${activeRates.name}! Check out my calculation:`,
      url: shareUrl || window.location.href
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Native share failed:", err);
        } else {
          return;
        }
      }
    }
    
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className={`transition-colors duration-300 ${theme === "dark" ? "dark bg-[#0b0f19] text-gray-100" : "bg-[#f8fafc] text-gray-800"}`}>
      
      {/* SEO dynamic metadata tags manager */}
      <SEO 
        activeTab={activeTab} 
        selectedStateCode={selectedState} 
        selectedStateName={activeRates.name} 
        estimatedSavings={savingsPotential.total} 
      />

      {/* Cinematic Hero Section - Covers full screen width & height */}
      <div className="relative w-full min-h-[calc(100vh-64px)] border-b border-gray-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/40 shadow-xl overflow-hidden flex flex-col justify-center items-center py-12 md:py-16 print:border-none print:shadow-none print:py-2">
        {/* Background Animated Blurs */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full filter blur-3xl animate-cinematic-glow pointer-events-none" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-sky-400/15 dark:bg-sky-500/10 rounded-full filter blur-3xl animate-cinematic-glow pointer-events-none" style={{ animationDelay: '5s' }}></div>

        {/* Dashboard Actions Bar (Flex centered on mobile, absolute top-6 right-6 md:right-8 lg:right-10 on desktop - direct child of full-width container) */}
        <div className="flex justify-center md:justify-end items-center gap-2 mb-6 md:mb-0 md:absolute md:top-6 md:right-6 lg:right-10 print:hidden z-20 w-full px-4">
          <button suppressHydrationWarning={true}
            onClick={() => window.print()}
            aria-label="Download PDF Invoice report"
            className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-300 font-sans"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Export PDF Report</span>
          </button>

          <div className="relative">
            <button suppressHydrationWarning={true}
              onClick={handleShareClick}
              aria-label="Share utility settings"
              className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer text-xs font-bold font-sans text-gray-600 dark:text-gray-300"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Share Estimator</span>
                </>
              )}
            </button>

            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl z-50 py-2 animate-fade-in font-sans">
                  <button suppressHydrationWarning={true}
                    type="button"
                    onClick={() => {
                      copyToClipboard();
                      setShowShareMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gray-500" />
                    Copy Link
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my household utility estimation and savings potential on Flowtix: " + (shareUrl || ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2.5 cursor-pointer transition-colors no-underline"
                  >
                    <span className="text-emerald-500 text-sm">💬</span>
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Calculate your localized utility bills and savings in ${activeRates.name}!`)}&url=${encodeURIComponent(shareUrl || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2.5 cursor-pointer transition-colors no-underline"
                  >
                    <span className="text-sky-500 text-sm">🐦</span>
                    Twitter (X)
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Flowtix Utility & Bill Estimator Report")}&body=${encodeURIComponent("Check out my household utility estimation on Flowtix: " + (shareUrl || ""))}`}
                    onClick={() => setShowShareMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-205 flex items-center gap-2.5 cursor-pointer transition-colors no-underline"
                  >
                    <span className="text-amber-500 text-sm">✉️</span>
                    Email Report
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 w-full flex flex-col items-center">
          
          {/* Hero Content */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 print:text-left print:max-w-none print:px-0 pt-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 transition-all cursor-default print:hidden shadow-sm">
              <TrendingUp className="w-4 h-4" />
              Smart Rates Sync Active
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent leading-tight font-sans print:text-xl print:font-bold animate-text-shine">
              Utility & Bill Cost Estimator Report
            </h2>
            
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl print:hidden">
              Analyze your household utilities, estimate monthly savings, and find carbon-reducing action plans. Quickly lookup standard costs by entering your ZIP code or state below.
            </p>

            {/* ZIP Code & State Search Glassmorphic Card */}
            <div className="w-full max-w-xl p-5 rounded-2xl border border-gray-200/50 bg-white/70 dark:bg-gray-900/50 dark:border-gray-800/60 shadow-lg backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4 text-left print:hidden hover:border-emerald-500/20 hover:shadow-emerald-500/5 transition-all duration-300">
              
              {/* 1. ZIP Code Search (Pin Code option) */}
              <form onSubmit={handleZipSearch} className="space-y-2">
                <label htmlFor="zip-search" className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Find by ZIP / Pin Code:
                </label>
                <div className="relative">
                  <input suppressHydrationWarning={true}
                    id="zip-search"
                    type="text"
                    placeholder="e.g. 75001"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-250 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  />
                  <button suppressHydrationWarning={true}
                    type="submit"
                    aria-label="Submit zip search"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500 hover:text-emerald-600 hover:scale-110 transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {zipFeedback && (
                  <span className={`text-xs font-bold block text-left ${zipFeedback.status === "success" ? "text-emerald-500" : "text-rose-500"} animate-fade-in`}>
                    {zipFeedback.message}
                  </span>
                )}
              </form>

              {/* 2. State US Selector */}
              <div className="space-y-2">
                <label htmlFor="state-select" className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide block">
                  Select US State:
                </label>
                <div className="relative">
                  <select suppressHydrationWarning={true}
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-250 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/80 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    {Object.keys(stateUtilityData).map((code) => (
                      <option key={code} value={code}>
                        {stateUtilityData[code].name} ({code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 transform rotate-90" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Boxed Content Container for Dashboard Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:py-10 flex flex-col">

        {/* Dashboard Grid */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start flex-grow pb-12 print:gap-4 print:pb-4">
          
          {/* Left Column: Utility Calculators */}
          <section className="md:col-span-7 lg:col-span-8 space-y-6 print:col-span-12">
            
            {/* Tab switch bar */}
            <div className="grid grid-cols-3 p-1.5 bg-gray-100/80 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800/40 rounded-2xl shadow-sm print:hidden">
              <button suppressHydrationWarning={true}
                type="button"
                onClick={() => setActiveTab("electric")}
                className={`py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "electric"
                    ? "bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 shadow-md"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Zap className={`w-4 h-4 ${activeTab === "electric" ? "fill-sky-100 dark:fill-sky-950/20" : ""}`} />
                Electricity
              </button>
              
              <button suppressHydrationWarning={true}
                type="button"
                onClick={() => setActiveTab("gas")}
                className={`py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "gas"
                    ? "bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-500 shadow-md"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Flame className={`w-4 h-4 ${activeTab === "gas" ? "fill-orange-100 dark:fill-orange-950/20" : ""}`} />
                Gas
              </button>

              <button suppressHydrationWarning={true}
                type="button"
                onClick={() => setActiveTab("water")}
                className={`py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "water"
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-500 shadow-md"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Droplet className={`w-4 h-4 ${activeTab === "water" ? "fill-blue-100 dark:fill-blue-950/20" : ""}`} />
                Water
              </button>
            </div>

            {/* Calculator Card Container */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 shadow-md hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 hover:scale-[1.01] transition-all duration-300 print:shadow-none print:border-none print:p-0">
              {isRatesLoading ? (
                <div className="py-24 text-center text-sm font-semibold text-gray-400">
                  Retrieving serverless utility data cache...
                </div>
              ) : (
                <>
                  <div className={activeTab === "electric" ? "block animate-fade-in" : "hidden"}>
                    <ElectricCalc
                      inputs={electricInputs}
                      onChange={handleInputsChange}
                      stateRate={activeRates.electricityRate}
                      stateName={activeRates.name}
                      selectedState={selectedState}
                      selectedProviderId={selectedProviderId}
                      onProviderChange={setSelectedProviderId}
                    />
                  </div>

                  <div className={activeTab === "gas" ? "block animate-fade-in" : "hidden"}>
                    <GasCalc
                      inputs={gasInputs}
                      onChange={handleInputsChange}
                      stateRate={activeRates.gasRate}
                      stateName={activeRates.name}
                    />
                  </div>

                  <div className={activeTab === "water" ? "block animate-fade-in" : "hidden"}>
                    <WaterCalc
                      inputs={waterInputs}
                      onChange={handleInputsChange}
                      stateRate={activeRates.waterRate}
                      stateBaseFee={activeRates.waterBaseFee}
                      stateName={activeRates.name}
                    />
                  </div>
                </>
              )}
            </div>

            {/* SVG Charts */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 shadow-md hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 hover:scale-[1.01] print:shadow-none print:border-none print:p-0">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 print:text-xs">
                Visual Analytics & Split
              </h3>
              <Charts
                activeTab={activeTab}
                electricCost={electricCost}
                gasCost={gasCost}
                waterCost={waterCost}
                electricBreakdown={electricResult.breakdown}
                gasBreakdown={gasResult.breakdown}
                waterBreakdown={waterResult.breakdown}
              />
            </div>
          </section>

          {/* Right Column: Cost summaries & savings plan */}
          <section className="md:col-span-5 lg:col-span-4 space-y-6 print:col-span-12">
            <div className="sticky top-6 space-y-6 print:relative print:top-0 print:space-y-4">
              
              {/* Unified Scorecard Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 shadow-md hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 hover:scale-[1.01] space-y-5 print:shadow-none print:border-none print:p-0">
                
                {/* Scorecard Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800/60">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Energy & Cost Scorecard
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${ecoScore.bg} ${ecoScore.color} border-current/15`}>
                    Eco Grade: {ecoScore.grade}
                  </span>
                </div>

                {/* Main Costs Display */}
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-black text-gray-900 dark:text-white block tracking-tight">
                      ${totalCost.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block font-semibold leading-tight">
                      Estimated monthly bill ({activeRates.name})
                    </span>
                  </div>
                  {savingsPotential.total > 0 && (
                    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-sm shrink-0">
                      Up to {((savingsPotential.total / (totalCost || 1)) * 100).toFixed(0)}% Savings
                    </div>
                  )}
                </div>

                {/* Savings Details / Net Cost */}
                {appliedSavings > 0 ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-between text-xs gap-3">
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                        -${appliedSavings.toFixed(2)} Savings Applied
                      </span>
                      <span className="text-xs text-gray-450 dark:text-gray-500 mt-0.5 block font-semibold">
                        From checklist actions below
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-gray-900 dark:text-white block leading-none">
                        ${(totalCost - appliedSavings).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-405 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1">
                        Net Monthly Cost
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150/45 dark:border-gray-805/45 flex items-center justify-between text-xs gap-3">
                    <div>
                      <span className="font-bold text-gray-650 dark:text-gray-300 block">
                        No Savings Applied
                      </span>
                      <span className="text-xs text-gray-450 dark:text-gray-550 mt-0.5 block font-semibold">
                        Check tasks below to start saving
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 block leading-tight">
                        Save up to
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        ${savingsPotential.total.toFixed(0)} / mo
                      </span>
                    </div>
                  </div>
                )}

                {/* Neighbor comparison descriptive line */}
                <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans flex items-start gap-2 bg-gray-50/40 dark:bg-gray-950/15 p-3 rounded-2xl border border-gray-100 dark:border-gray-805/40">
                  <span className="text-base select-none mt-0.5">📊</span>
                  <p className="font-semibold text-xs text-gray-550 dark:text-gray-400">
                    Your bill is <strong className="text-gray-800 dark:text-gray-250">{ecoScore.ratio < 1 ? `${((1 - ecoScore.ratio)*100).toFixed(0)}% below` : `${((ecoScore.ratio - 1)*100).toFixed(0)}% above`}</strong> the neighbor average for your household size. {ecoScore.desc}
                  </p>
                </div>

                {/* Sub-utility cost breakdown rows */}
                <div className="space-y-2.5 pt-1.5 border-t border-gray-100 dark:border-gray-850">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 dark:text-gray-450 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-500" />
                      Electricity
                    </span>
                    <span className="font-extrabold text-gray-800 dark:text-gray-200">${electricCost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 dark:text-gray-450 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      Natural Gas
                    </span>
                    <span className="font-extrabold text-gray-800 dark:text-gray-200">${gasCost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 dark:text-gray-455 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" />
                      Water Bill
                    </span>
                    <span className="font-extrabold text-gray-800 dark:text-gray-200">${waterCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Local Rate Customizer Toggle */}
                <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4 print:hidden">
                  <button suppressHydrationWarning={true}
                    type="button"
                    onClick={() => setCustomizerOpen(!customizerOpen)}
                    className="w-full flex justify-between items-center text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider hover:text-emerald-600 dark:hover:text-emerald-405 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-gray-405" />
                      Personal Rate Customizer
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transform transition-transform duration-205 ${customizerOpen ? "rotate-180" : ""}`} />
                  </button>

                  {customizerOpen && (
                    <div className="space-y-3 mt-4.5 p-3.5 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-805/45 rounded-2xl animate-fade-in">
                      <p className="text-xs text-gray-400 dark:text-gray-505 leading-normal">
                        Type in rates directly from your bills to override average state values.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                        <div>
                          <label htmlFor="elec-or" className="font-semibold text-gray-500 dark:text-gray-400 block mb-1">Elec ($/kWh)</label>
                          <input suppressHydrationWarning={true}
                            id="elec-or"
                            type="number"
                            step="0.001"
                            placeholder={apiRates.electricityRate.toFixed(3)}
                            value={localOverrides.electricityRate}
                            onChange={(e) => handleOverrideChange("electricityRate", e.target.value)}
                            className="w-full px-2 py-1.5 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="gas-or" className="font-semibold text-gray-500 dark:text-gray-400 block mb-1">Gas ($/Therm)</label>
                          <input suppressHydrationWarning={true}
                            id="gas-or"
                            type="number"
                            step="0.01"
                            placeholder={apiRates.gasRate.toFixed(2)}
                            value={localOverrides.gasRate}
                            onChange={(e) => handleOverrideChange("gasRate", e.target.value)}
                            className="w-full px-2 py-1.5 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="water-or" className="font-semibold text-gray-500 dark:text-gray-400 block mb-1">Water ($/1k gal)</label>
                          <input suppressHydrationWarning={true}
                            id="water-or"
                            type="number"
                            step="0.01"
                            placeholder={apiRates.waterRate.toFixed(2)}
                            value={localOverrides.waterRate}
                            onChange={(e) => handleOverrideChange("waterRate", e.target.value)}
                            className="w-full px-2 py-1.5 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="water-fee-or" className="font-semibold text-gray-500 dark:text-gray-400 block mb-1">Base Water ($)</label>
                          <input suppressHydrationWarning={true}
                            id="water-fee-or"
                            type="number"
                            step="0.5"
                            placeholder={apiRates.waterBaseFee.toFixed(2)}
                            value={localOverrides.waterBaseFee}
                            onChange={(e) => handleOverrideChange("waterBaseFee", e.target.value)}
                            className="w-full px-2 py-1.5 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end mt-2">
                        <button suppressHydrationWarning={true}
                          type="button"
                          onClick={clearOverrides}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Reset Averages
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Plan Checklist Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 shadow-md hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 hover:scale-[1.01] print:border-none print:shadow-none print:p-0">
                <div className="flex justify-between items-center mb-4 print:mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white print:text-xs">
                      Energy-Saving Action Plan
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500 block mt-0.5 print:hidden">
                      Check tasks below to apply monthly cost savings.
                    </span>
                  </div>
                  <div className="text-right print:hidden shrink-0">
                    <span className="text-xs text-emerald-555 dark:text-emerald-400 font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                      Gamified Plan
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 print:space-y-2">
                  
                  {/* LED Bulb tip */}
                  <label htmlFor="tip-led" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                    <input suppressHydrationWarning={true}
                      id="tip-led"
                      type="checkbox"
                      checked={checkedTips.led}
                      onChange={() => handleCheckboxChange("led")}
                      className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                        Upgrade standard home bulbs to LEDs {checkedTips.led && "✓"}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                        Saves ~${savingsPotential.individualTips.led.toFixed(2)} / month in {selectedState}
                      </span>
                    </div>
                  </label>

                  {/* Summer AC tip */}
                  {electricInputs.season === "summer" && electricInputs.acHours > 0 && (
                    <label htmlFor="tip-ac" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                      <input suppressHydrationWarning={true}
                        id="tip-ac"
                        type="checkbox"
                        checked={checkedTips.ac}
                        onChange={() => handleCheckboxChange("ac")}
                        className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                          Reduce daily AC runtime by 2 hours {checkedTips.ac && "✓"}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          Saves ~${savingsPotential.individualTips.ac.toFixed(2)} / month in {selectedState}
                        </span>
                      </div>
                    </label>
                  )}

                  {/* Winter Space heater tip */}
                  {electricInputs.season === "winter" && electricInputs.heaterHours > 0 && (
                    <label htmlFor="tip-heater" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                      <input suppressHydrationWarning={true}
                        id="tip-heater"
                        type="checkbox"
                        checked={checkedTips.spaceHeater}
                        onChange={() => handleCheckboxChange("spaceHeater")}
                        className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                          Reduce space heater usage by 2 hours {checkedTips.spaceHeater && "✓"}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          Saves ~${savingsPotential.individualTips.spaceHeater.toFixed(2)} / month
                        </span>
                      </div>
                    </label>
                  )}

                  {/* EV peak schedule tip */}
                  {electricInputs.evHours > 0 && (
                    <label htmlFor="tip-ev" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                      <input suppressHydrationWarning={true}
                        id="tip-ev"
                        type="checkbox"
                        checked={checkedTips.ev}
                        onChange={() => handleCheckboxChange("ev")}
                        className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                          Charge EV during Off-Peak (11 PM - 6 AM) {checkedTips.ev && "✓"}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          Saves ~${savingsPotential.individualTips.ev.toFixed(2)} / month via rebates
                        </span>
                      </div>
                    </label>
                  )}

                  {/* Gas Thermostat tip */}
                  {gasInputs.heatingType !== "water_only" && (
                    <label htmlFor="tip-thermostat" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                      <input suppressHydrationWarning={true}
                        id="tip-thermostat"
                        type="checkbox"
                        checked={checkedTips.thermostat}
                        onChange={() => handleCheckboxChange("thermostat")}
                        className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                          Lower winter thermostat by 2°F {checkedTips.thermostat && "✓"}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          Saves ~${savingsPotential.individualTips.thermostat.toFixed(2)} / month in gas
                        </span>
                      </div>
                    </label>
                  )}

                  {/* Water Shower duration tip */}
                  <label htmlFor="tip-shower" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                    <input suppressHydrationWarning={true}
                      id="tip-shower"
                      type="checkbox"
                      checked={checkedTips.shower}
                      onChange={() => handleCheckboxChange("shower")}
                      className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                        Shorten showers by 2 mins/person {checkedTips.shower && "✓"}
                      </span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                        Saves ~${savingsPotential.individualTips.shower.toFixed(2)} / month in water
                      </span>
                    </div>
                  </label>

                  {/* Water Lawn tip */}
                  {waterInputs.lawnFreq > 0 && (
                    <label htmlFor="tip-lawn" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/35 dark:hover:border-emerald-500/20 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer select-none transition-all print:border-none print:p-0">
                      <input suppressHydrationWarning={true}
                        id="tip-lawn"
                        type="checkbox"
                        checked={checkedTips.lawn}
                        onChange={() => handleCheckboxChange("lawn")}
                        className="w-4 h-4 mt-0.5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer print:hidden"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-gray-700 dark:text-gray-300 block hover:text-gray-950 dark:hover:text-white transition-colors">
                          Water lawn 1 fewer day per week {checkedTips.lawn && "✓"}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          Saves ~${savingsPotential.individualTips.lawn.toFixed(2)} / month in water
                        </span>
                      </div>
                    </label>
                  )}

                </div>
              </div>

              {/* Local Weather Accordion Card */}
              {(weatherLoading || weatherData) && (
                <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 shadow-md overflow-hidden print:hidden">
                  <button suppressHydrationWarning={true}
                    type="button"
                    onClick={() => setWeatherCollapsed(!weatherCollapsed)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-xs font-extrabold uppercase">
                      <Sun className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                      Local Weather Alert Forecast
                    </span>
                    <div className="flex items-center gap-2 font-sans font-extrabold text-xs shrink-0">
                      {weatherData && (
                        <span className="text-gray-600 dark:text-gray-300">
                          {weatherData.maxTemp.toFixed(0)}°F / {weatherData.minTemp.toFixed(0)}°F
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${weatherCollapsed ? "" : "rotate-180"}`} />
                    </div>
                  </button>

                  {!weatherCollapsed && (
                    <div className="px-5 pb-5 pt-1.5 border-t border-gray-100 dark:border-gray-800/60 animate-fade-in space-y-4">
                      {weatherLoading ? (
                        <div className="text-center py-4 text-xs font-bold text-gray-400 animate-pulse">
                          Fetching Open-Meteo local forecast...
                        </div>
                      ) : weatherData ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-sans text-gray-500">
                            <span>Station Location: <strong className="text-gray-700 dark:text-gray-300">{weatherData.capitalName}</strong></span>
                          </div>
                          
                          {weatherAlert && (
                            <div className={`p-3.5 rounded-2xl border flex gap-2.5 text-xs font-bold leading-relaxed ${
                              weatherAlert.type === "warning"
                                ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                                : weatherAlert.type === "caution"
                                ? "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-405"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            }`}>
                              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                              <p>{weatherAlert.message}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-5 gap-2 text-center text-xs font-sans">
                            {weatherData.forecastMax.map((temp, idx) => {
                              const date = new Date(weatherData.dates[idx]);
                              const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
                              return (
                                <div key={idx} className="p-2 rounded-xl bg-gray-50/50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800">
                                  <span className="block font-bold text-gray-400 dark:text-gray-500 mb-0.5">{dayLabel}</span>
                                  <span className="block font-extrabold text-gray-700 dark:text-gray-200">{temp.toFixed(0)}°</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* Bill OCR Scanner Accordion Card */}
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/80 shadow-md overflow-hidden print:hidden">
                <button suppressHydrationWarning={true}
                  type="button"
                  onClick={() => setOcrCollapsed(!ocrCollapsed)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left text-xs font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold">
                    <Camera className="w-4 h-4 text-sky-500 shrink-0" />
                    Scan Utility Bill (OCR Setup)
                  </span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform duration-200 ${ocrCollapsed ? "" : "rotate-180"}`} />
                </button>

                {!ocrCollapsed && (
                  <div className="px-5 pb-5 pt-1.5 border-t border-gray-100 dark:border-gray-800/60 animate-fade-in space-y-4">
                    <p className="text-xs text-gray-500 dark:text-gray-450 leading-relaxed font-sans">
                      Upload a photo of your utility bill to automatically extract your rate and ZIP settings.
                    </p>

                    {/* Scan Area Box */}
                    {scanState === "idle" && (
                      <label htmlFor="bill-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer transition-colors group">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-sky-500 transition-colors mb-2 animate-pulse" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Click to Upload Bill Image</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Supports PNG, JPG, PDF receipt screenshots</span>
                        <input suppressHydrationWarning={true}
                          id="bill-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleOcrUpload(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}

                    {scanState === "loading" && (
                      <div className="relative border border-sky-100 dark:border-sky-950/40 rounded-2xl p-6 text-center space-y-3 bg-sky-50/25 dark:bg-sky-950/5 overflow-hidden">
                        {/* Scanning Laser Line */}
                        <div className="absolute left-0 right-0 top-0 h-[3px] bg-sky-500 shadow-md shadow-sky-500/50 animate-ocr-laser pointer-events-none"></div>
                        
                        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300 block">Extracting Rates & ZIP tables...</span>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-400 block">{scanProgress}% completed</span>
                      </div>
                    )}

                    {scanState === "success" && extractedData && (
                      <div className="p-4.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-3 text-left">
                        <span className="font-extrabold text-emerald-500 dark:text-emerald-400 block mb-1">🎉 OCR Processing Complete!</span>
                        <div className="space-y-1.5 text-gray-700 dark:text-gray-300 font-semibold leading-normal font-sans">
                          {extractedData.zip && <p>📍 ZIP Code: <span className="text-emerald-500 font-extrabold">{extractedData.zip}</span></p>}
                          {extractedData.rate && <p>⚡ Electricity Rate: <span className="text-emerald-500 font-extrabold">${extractedData.rate.toFixed(3)}/kWh</span></p>}
                          {extractedData.provider && <p>🏢 Provider: <span className="text-emerald-500 font-extrabold">{extractedData.provider.providerId.toUpperCase()}</span></p>}
                        </div>
                        <button suppressHydrationWarning={true}
                          type="button"
                          onClick={applyOcrData}
                          className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/10 cursor-pointer hover:bg-emerald-600 transition-colors"
                        >
                          Apply Bill Settings
                        </button>
                      </div>
                    )}

                    {scanState === "error" && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2 text-left">
                        <span className="font-extrabold text-rose-550 block">⚠️ Scanning Error</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal font-sans">{scanError}</p>
                        <button suppressHydrationWarning={true}
                          type="button"
                          onClick={() => setScanState("idle")}
                          className="py-1.5 px-3 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-bold cursor-pointer"
                        >
                          Reset Uploader
                        </button>
                      </div>
                    )}

                    {/* Presets Grid */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800/60 space-y-2 text-left">
                      <span className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider block">
                        No utility bill nearby? Click a preset:
                      </span>
                      <div className="grid grid-cols-2 gap-2 font-sans">
                        <button suppressHydrationWarning={true}
                          type="button"
                          onClick={() => triggerSampleScan("electric")}
                          className="py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-950/20 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 hover:border-sky-500 text-xs font-bold transition-all text-gray-600 dark:text-gray-350 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          Demo PG&E Bill
                        </button>
                        <button suppressHydrationWarning={true}
                          type="button"
                          onClick={() => triggerSampleScan("gas")}
                          className="py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-950/20 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 hover:border-sky-500 text-xs font-bold transition-all text-gray-600 dark:text-gray-350 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          Demo ConEd Bill
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Detailed Guide Section */}
        <section className="mt-12 p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-8 print:border-none print:p-0">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white font-sans flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              How Utility Bills Are Calculated
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Demystifying the equations and structures used by utility grid operators to compile your monthly bill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-250 flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-500 fill-current" />
                1. Electricity Bill Calculation
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                Most electric providers bill users based on **Kilowatt-hours (kWh)** consumed. A kilowatt-hour represents using 1,000 watts of electricity for exactly one hour (e.g. running a 100-watt TV for 10 hours). 
              </p>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-805 font-mono text-xs text-gray-700 dark:text-gray-300">
                Monthly Electric Cost = Total kWh × State Utility Rate ($/kWh) + Fixed Customer Service Fee
              </div>
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
                Our calculator computes baseline heating/AC duty cycles, EV charger wattages, and vampire standby loads to estimate total monthly kWh draw.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-250 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
                2. Natural Gas Bill Calculation
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                Gas utilities measure the volume of fuel delivered in cubic feet, but bill you based on its energy content in **Therms**. One Therm represents 100,000 British Thermal Units (BTUs) of heat energy.
              </p>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-805 font-mono text-xs text-gray-700 dark:text-gray-300">
                Monthly Gas Cost = Gas Volume (Ccf) × Therm Conversion Factor (approx. 1.03) × Gas Rate ($/Therm)
              </div>
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
                Heating systems (furnaces/boilers) and gas water heaters consume gas dynamically based on outdoor temperatures and your preferred winter thermostat settings.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-250 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-500 fill-current" />
                3. Water Bill Calculation
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                Water utilities bill you in units of **1,000 gallons (kgal)** or **Centum Cubic Feet (Ccf)** (1 Ccf = 748 gallons). Many water operators use progressive **Tiered Rates** to promote conservation.
              </p>
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-805 font-mono text-xs text-gray-700 dark:text-gray-300 text-left">
                • Tier 1 (0 - 3,000 gal): Standard Base Rate ($/kgal)<br />
                • Tier 2 (3,001 - 10,000 gal): 1.5x Premium Rate<br />
                • Tier 3 (10,001+ gal): 2.2x High-Demand Surcharge
              </div>
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
                Lawn sprinkler irrigation and long showers frequently push home usage into Tier 2 and Tier 3 brackets, significantly increasing water bills.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-250 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" />
                4. Common Utility Charges Explained
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                Apart from the commodity cost (electricity, gas, water), your bill contains structural tariff components:
              </p>
              <ul className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed space-y-1 list-disc pl-5">
                <li><strong className="text-gray-800 dark:text-gray-200">Transmission/Delivery Fees:</strong> The cost of transporting power over high-voltage towers or pipes to the local station.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Distribution Charge:</strong> The cost of local grid upkeep (lines and local meters).</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Regulatory & Environmental Charges:</strong> State-mandated carbon offset or renewable portfolio surcharges.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Charts Section */}
        <section className="mt-8 p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-8 print:hidden">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white font-sans">
              Interactive Spending & Comparison Trends
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Visualize how seasonal weather, location, and inflation affect monthly utility spend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chart 1: Seasonal Spending Spikes */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-805 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Seasonal Utility Spending Spikes (Model Output)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  See how bills peak during high AC summers and heating winters.
                </p>
              </div>

              {/* Pure SVG Line Chart */}
              <div className="relative pt-2">
                <svg className="w-full h-40 overflow-visible" viewBox="0 0 300 100">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(156,163,175,0.08)" strokeDasharray="3,3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(156,163,175,0.08)" strokeDasharray="3,3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(156,163,175,0.08)" strokeDasharray="3,3" />

                  {/* Gradient Fill under Curve */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Seasonal Bill path */}
                  <path
                    d="M 0 65 Q 25 75 50 85 T 100 45 T 150 25 T 200 45 T 250 80 T 300 55"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 0 65 Q 25 75 50 85 T 100 45 T 150 25 T 200 45 T 250 80 T 300 55 L 300 100 L 0 100 Z"
                    fill="url(#chartGrad)"
                  />

                  {/* Highlight Circles */}
                  <circle cx="150" cy="25" r="4" fill="#10b981" />
                  <text x="150" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#10b981">Summer AC Spike</text>

                  <circle cx="50" cy="85" r="4" fill="#0ea5e9" />
                  <text x="50" y="95" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0ea5e9">Spring Mild Low</text>
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[8px] font-bold text-gray-450 uppercase tracking-widest mt-2 px-1">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>

            {/* Chart 2: State Rate Comparison */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-805 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Electricity Cost Comparison: {activeRates.name} vs. Benchmarks
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Residential power rates per kWh compared to national low and high averages.
                </p>
              </div>

              {/* Bar Chart comparing rates */}
              <div className="space-y-3 pt-2">
                {[
                  { name: "Idaho (Low-Cost Hydro)", rate: 0.108, color: "bg-emerald-500" },
                  { name: "US National Average", rate: 0.158, color: "bg-gray-400 dark:bg-gray-600" },
                  { name: `${activeRates.name} (Your Select)`, rate: activeRates.electricityRate, color: "bg-sky-500" },
                  { name: "Hawaii (High-Cost Isolated)", rate: 0.452, color: "bg-rose-500" }
                ].map((bar, idx) => {
                  const maxRate = 0.50;
                  const percentWidth = (bar.rate / maxRate) * 100;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-600 dark:text-gray-300">{bar.name}</span>
                        <span className="text-gray-900 dark:text-gray-100">${bar.rate.toFixed(3)}/kWh</span>
                      </div>
                      <div className="w-full bg-gray-200/50 dark:bg-gray-800/50 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${percentWidth}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* State Average Cost Table Section */}
        <section id="rates-table" className="mt-8 p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-6 print:hidden">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white font-sans">
                State average residential utility rates table
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                EIA Average Residential Rates. Click any state row to load its values into the dashboard.
              </p>
            </div>

            {/* Filter Search Input */}
            <div className="relative max-w-xs w-full">
              <input suppressHydrationWarning={true}
                type="text"
                placeholder="Search state..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-100 dark:border-gray-805 rounded-2xl">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950/45 border-b border-gray-100 dark:border-gray-805 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <th className="py-3.5 px-4 font-bold">State</th>
                  <th className="py-3.5 px-4 font-bold text-right">Electric Rate</th>
                  <th className="py-3.5 px-4 font-bold text-right">Gas Rate</th>
                  <th className="py-3.5 px-4 font-bold text-right">Water Rate</th>
                  <th className="py-3.5 px-4 font-bold text-right">Water Base</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-805">
                {Object.keys(stateUtilityData)
                  .filter(code => {
                    const data = stateUtilityData[code];
                    return (
                      data.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
                      code.toLowerCase().includes(stateSearch.toLowerCase())
                    );
                  })
                  .slice(0, 8)
                  .map((code) => {
                    const data = stateUtilityData[code];
                    const isCurrent = selectedState === code;
                    return (
                      <tr
                        key={code}
                        onClick={() => {
                          setSelectedState(code);
                          setZipInput("");
                        }}
                        className={`group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 cursor-pointer transition-colors ${
                          isCurrent ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-gray-900 dark:text-gray-205 flex items-center gap-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          <span className="px-1.5 py-0.5 rounded bg-gray-105 dark:bg-gray-800 text-xs font-mono text-gray-500 select-none">{code}</span>
                          {data.name}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-sky-600 dark:text-sky-400">${data.electricityRate.toFixed(3)}/kWh</td>
                        <td className="py-3 px-4 text-right font-semibold text-orange-600 dark:text-orange-500">${data.gasRate.toFixed(2)}/Therm</td>
                        <td className="py-3 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">${data.waterRate.toFixed(2)}/kgal</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-500 dark:text-gray-400">${data.waterBaseFee.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${
                            isCurrent
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                          }`}>
                            {isCurrent ? "Loaded" : "Load State"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic text-right">
            Showing top search results. Type in search bar above to filter all 50 states.
          </p>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="mt-8 p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-md space-y-6 print:border-none print:p-0">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white font-sans flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Quick answers regarding home utility consumption and pricing definitions.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: "How much electricity does an average US home use?",
                a: "According to the US Energy Information Administration (EIA), the average US residential customer consumes approximately 890 kWh of electricity per month. This varies heavily by state, ranging from around 500 kWh in Hawaii to over 1,200 kWh in hot southern states like Texas and Louisiana due to heavy air conditioner runtimes."
              },
              {
                q: "How can I reduce my utility bill?",
                a: "The most effective savings actions include: (1) Installing LED bulbs (saves ~80% lighting power), (2) setting thermostats 2°F cooler in winter or warmer in summer, (3) scheduling EV charging during off-peak hours, (4) sealing air leaks with weatherstripping, and (5) turning off standby power by unplugging vampire devices or using smart power strips."
              },
              {
                q: "What is kWh?",
                a: "A Kilowatt-hour (kWh) is a unit of measurement for electrical energy. It is equivalent to using 1,000 watts of electrical power continuously for exactly one hour. For example, running a 1,500-watt hair dryer for 40 minutes consumes 1 kWh, whereas a 10-watt LED bulb takes 100 hours to consume 1 kWh."
              },
              {
                q: "Why does my bill increase in summer?",
                a: "Summer utility spikes are caused almost entirely by air conditioning. Standard central AC compressors draw between 3,000 and 5,000 watts of electrical power. Under sustained summer heatwaves, the duty cycle of your HVAC increases, forcing it to run more hours per day to maintain indoor comfort, which causes power consumption to spike."
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-150/60 dark:border-gray-805 overflow-hidden transition-all bg-white dark:bg-gray-900"
                >
                  <button suppressHydrationWarning={true}
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left font-bold text-xs text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-850 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4.5 pt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* E-E-A-T Author Information Card */}
        <section className="mt-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 dark:border-emerald-900/10 shadow-sm flex flex-col md:flex-row items-center gap-6 print:hidden">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center text-4xl font-black select-none shrink-0 border border-emerald-250 dark:border-emerald-900/30">
            VS
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Vineet Singh</h3>
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30">
                Utility Research & Cost Analysis
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-2xl">
              Vineet Singh is a dedicated energy systems researcher specializing in residential tariff modeling, energy conservation auditing, and smart grid structures. With over five years of analytics experience evaluating electricity grids and municipal rate schedules, Vineet oversees editorial standards, data audits, and equation modeling across the Flowtix calculators network.
            </p>
          </div>
        </section>

        {/* Sticky Scorecard Bar for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md px-5 py-4.5 shadow-lg flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-xs text-gray-405 dark:text-gray-500 font-extrabold uppercase tracking-widest leading-none mb-1">
              Estimated Bill
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900 dark:text-white leading-none">
                ${(appliedSavings > 0 ? totalCost - appliedSavings : totalCost).toFixed(2)}
              </span>
              {appliedSavings > 0 && (
                <span className="text-xs text-emerald-500 font-extrabold line-through leading-none">
                  ${totalCost.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-405 dark:text-gray-500 font-extrabold uppercase tracking-widest leading-none mb-1">
              Potential Savings
            </span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 leading-none">
              Save ${savingsPotential.total.toFixed(0)}/mo
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-4 shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-405 dark:text-gray-500 font-extrabold uppercase tracking-widest leading-none mb-1">
                Eco Grade
              </span>
              <span className={`text-sm font-black ${ecoScore.color} leading-none`}>{ecoScore.grade}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
