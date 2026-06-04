// Flowtix - U.S. Energy Information Administration (EIA) API Sync Script
// This script is designed to run via cron (e.g., GitHub Actions, Vercel Cron, or server scheduler) once a week.

import { createClient } from "@supabase/supabase-js";

// Retrieve configuration variables from environment
const EIA_API_KEY = process.env.EIA_API_KEY || "YOUR_EIA_API_KEY_HERE";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://your-supabase-project.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_SERVICE_KEY";

// Initialize Supabase Client (uses service role key to bypass RLS policies during admin cron)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// List of all 50 US State Codes
const states = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY"
];

async function syncEiaRates() {
  console.log("🚀 Starting EIA API Sync script...");
  
  if (EIA_API_KEY === "YOUR_EIA_API_KEY_HERE") {
    console.error("❌ Aborting: EIA_API_KEY is not configured.");
    return;
  }

  const syncedRates = {};

  // 1. Fetch Electricity Rates from EIA API v2
  // Endpoint: electricity/retail-sales
  // Description: Average retail price of electricity to ultimate customers (Residential sector)
  try {
    console.log("⚡ Fetching electricity rates from EIA...");
    
    // We request the most recent monthly residential pricing data for all states
    const electricityUrl = new URL("https://api.eia.gov/v2/electricity/retail-sales/data/");
    electricityUrl.searchParams.append("api_key", EIA_API_KEY);
    electricityUrl.searchParams.append("frequency", "monthly");
    electricityUrl.searchParams.append("data[]", "price");
    electricityUrl.searchParams.append("facets[sectorid][]", "RES"); // Residential customers only
    electricityUrl.searchParams.append("sort[0][column]", "period");
    electricityUrl.searchParams.append("sort[0][direction]", "desc");
    electricityUrl.searchParams.append("length", "100"); // covers all states in the latest month

    const response = await fetch(electricityUrl);
    if (!response.ok) {
      throw new Error(`EIA Electricity API request failed with status: ${response.status}`);
    }

    const json = await response.json();
    const dataList = json.response?.data || [];

    dataList.forEach(item => {
      const state = item.stateid;
      const price = parseFloat(item.price); // Price in cents per kWh
      
      // If we haven't stored a rate for this state (keeps the latest month due to sort)
      if (state && !isNaN(price) && !syncedRates[state]) {
        // Convert cents per kWh to dollars (e.g. 15.4 cents -> $0.154)
        syncedRates[state] = {
          stateCode: state,
          electricityRate: price / 100
        };
      }
    });
    console.log(`✅ Electricity rates fetched for ${Object.keys(syncedRates).length} states.`);
  } catch (error) {
    console.error("❌ Error fetching electricity rates from EIA API:", error.message);
  }

  // 2. Fetch Natural Gas Rates from EIA API v2
  // Endpoint: natural-gas/price
  // Description: Natural Gas Residential Price by State (PD2)
  try {
    console.log("🔥 Fetching natural gas rates from EIA...");
    
    const gasUrl = new URL("https://api.eia.gov/v2/natural-gas/price/data/");
    gasUrl.searchParams.append("api_key", EIA_API_KEY);
    gasUrl.searchParams.append("frequency", "monthly");
    gasUrl.searchParams.append("data[]", "value");
    gasUrl.searchParams.append("facets[process][]", "PD2"); // Price to Residential Consumers
    gasUrl.searchParams.append("sort[0][column]", "period");
    gasUrl.searchParams.append("sort[0][direction]", "desc");
    gasUrl.searchParams.append("length", "100");

    const response = await fetch(gasUrl);
    if (!response.ok) {
      throw new Error(`EIA Gas API request failed with status: ${response.status}`);
    }

    const json = await response.json();
    const dataList = json.response?.data || [];

    dataList.forEach(item => {
      const state = item.stateid;
      const pricePerKcf = parseFloat(item.value); // Price in Dollars per Thousand Cubic Feet (Kcf)
      
      // 1 Kcf ≈ 10 Therms. Convert price per Kcf to price per Therm
      // e.g. $12.00/Kcf -> $1.20/Therm
      const pricePerTherm = pricePerKcf / 10;
      
      if (state && !isNaN(pricePerTherm) && syncedRates[state]) {
        syncedRates[state].gasRate = pricePerTherm;
      }
    });
    console.log("✅ Natural gas rates converted and compiled.");
  } catch (error) {
    console.error("❌ Error fetching natural gas rates from EIA API:", error.message);
  }

  // 3. Write Compiled Rates to Supabase Serverless Table
  try {
    console.log("💾 Upserting rates cache to Supabase utility_rates table...");
    
    const rowsToUpsert = Object.values(syncedRates).map(item => ({
      state_code: item.stateCode,
      electricity_rate: item.electricityRate || 0.15,
      gas_rate: item.gasRate || 1.15,
      last_synced: new Date().toISOString()
    }));

    if (rowsToUpsert.length === 0) {
      console.warn("⚠️ No rate rows compiled to sync. Check API credentials.");
      return;
    }

    // Supposing you created a Table in Supabase with structural schema:
    // TABLE utility_rates (
    //   state_code TEXT PRIMARY KEY,
    //   electricity_rate NUMERIC NOT NULL,
    //   gas_rate NUMERIC NOT NULL,
    //   last_synced TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    // )
    const { error } = await supabase
      .from("utility_rates")
      .upsert(rowsToUpsert, { onConflict: "state_code" });

    if (error) {
      throw error;
    }

    console.log(`🎉 Success! Synced and cached rates for ${rowsToUpsert.length} states in database.`);
  } catch (error) {
    console.error("❌ Supabase DB cache update failed:", error.message);
    console.log("\n💡 SQL script to initialize Supabase utility_rates table:");
    console.log(`
      CREATE TABLE IF NOT EXISTS public.utility_rates (
        state_code text PRIMARY KEY,
        electricity_rate double precision NOT NULL,
        gas_rate double precision NOT NULL,
        last_synced timestamp with time zone NOT NULL
      );
      ALTER TABLE public.utility_rates ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public read access" ON public.utility_rates FOR SELECT TO public USING (true);
    `);
  }
}

// Execute sync
syncEiaRates();
