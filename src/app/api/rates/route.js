import { NextResponse } from "next/server";
import { stateUtilityData } from "../../../data/utilityRates";
import { createClient } from "@supabase/supabase-js";

// Optional: Retrieve cached rates from Supabase if configured
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get("state")?.toUpperCase() || "CA";
  
  const localFallback = stateUtilityData[stateCode];
  if (!localFallback) {
    return NextResponse.json({ error: "Invalid US State Code" }, { status: 400 });
  }

  // If Supabase is configured, fetch live cached rates synced by our EIA cron script
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("utility_rates")
        .select("electricity_rate, gas_rate, last_synced")
        .eq("state_code", stateCode)
        .single();
        
      if (!error && data) {
        return NextResponse.json({
          source: "Supabase Cache",
          rates: {
            electricityRate: data.electricity_rate,
            gasRate: data.gas_rate,
            waterRate: localFallback.waterRate, // keeping local water tier defaults
            waterBaseFee: localFallback.waterBaseFee,
            lastSynced: data.last_synced
          }
        }, {
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
          }
        });
      }
    } catch (e) {
      console.error("Failed to fetch rates from Supabase", e.message);
    }
  }

  return NextResponse.json({
    source: "Standard Regional Estimates (Static Cache)",
    rates: {
      electricityRate: localFallback.electricityRate,
      gasRate: localFallback.gasRate,
      waterRate: localFallback.waterRate,
      waterBaseFee: localFallback.waterBaseFee,
      lastSynced: "Offline Static Cache"
    }
  }, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
