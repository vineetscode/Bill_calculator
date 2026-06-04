import { stateUtilityData } from "../data/utilityRates";

/**
 * Fetches the latest utility rates for a specific state from our serverless cache API.
 * Falls back to local EIA 2026 averages if the cache is unreachable or before database setup.
 * @param {string} stateCode - The two-letter US State abbreviation (e.g. "TX")
 * @returns {Promise<{electricityRate: number, gasRate: number, waterRate: number, waterBaseFee: number, name: string}>}
 */
export async function getRatesForState(stateCode) {
  const localFallback = stateUtilityData[stateCode] || stateUtilityData.CA;
  
  try {
    // Queries our decoupled serverless API cache endpoint
    // In next.js client-side, we fetch relative. In next.js server-side, we supply base URL or run direct DB query.
    const baseUrl = typeof window === "undefined" ? (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") : "";
    
    const response = await fetch(`${baseUrl}/api/rates?state=${stateCode}`, {
      next: { revalidate: 3600 } // cache on next server side for 1 hour
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.rates) {
        return {
          ...localFallback,
          ...data.rates
        };
      }
    }
  } catch (error) {
    console.warn(`[Flowtix Cache] Fetch failed for state ${stateCode}, reverting to local EIA baseline.`, error.message);
  }
  
  return localFallback;
}
