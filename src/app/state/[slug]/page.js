import React from "react";
import ClientDashboard from "../../page";
import { stateUtilityData } from "../../../data/utilityRates";
import { Zap, Flame, Droplet, Check, Info } from "lucide-react";

// Reverse state slug mapping to abbreviations
const stateSlugMap = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO",
  montana: "MT", nebraska: "NE", nevada: "NV", "new-hampshire": "NH", "new-jersey": "NJ",
  "new-mexico": "NM", "new-york": "NY", "north-carolina": "NC", "north-dakota": "ND", ohio: "OH",
  oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode-island": "RI", "south-carolina": "SC",
  "south-dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west-virginia": "WV", wisconsin: "WI", wyoming: "WY"
};

// Map utility slugs to active tab identifiers
const utilitySlugMap = {
  "electric-bill-calculator": "electric",
  "gas-bill-calculator": "gas",
  "water-estimator": "water"
};

function parseSlug(slug) {
  const parts = slug.split("-");
  let stateKey = "";
  let utilityKey = "";

  // Check if first two words form a two-word state name (e.g. new-york, rhode-island)
  if (parts.length >= 4 && (parts[0] === "new" || parts[0] === "north" || parts[0] === "south" || parts[0] === "west" || parts[0] === "rhode")) {
    stateKey = `${parts[0]}-${parts[1]}`;
    utilityKey = parts.slice(2).join("-");
  } else {
    stateKey = parts[0];
    utilityKey = parts.slice(1).join("-");
  }

  const stateCode = stateSlugMap[stateKey] || "CA";
  const tab = utilitySlugMap[utilityKey] || "electric";

  return { stateCode, tab, stateKey, utilityKey };
}

// Generate static routes for all 150 combinations (50 states * 3 utility types)
export async function generateStaticParams() {
  const states = Object.keys(stateSlugMap);
  const utilities = Object.keys(utilitySlugMap);
  
  const paths = [];
  states.forEach(state => {
    utilities.forEach(utility => {
      paths.push({
        slug: `${state}-${utility}`
      });
    });
  });
  return paths;
}

// Server-side Meta Tag Generation
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { stateCode, tab } = parseSlug(slug);
  const stateData = stateUtilityData[stateCode] || stateUtilityData.CA;
  
  const stateName = stateData.name;
  const url = `https://flowtix.com/state/${slug}`;

  let title = `Average Electric Bill Calculator in ${stateName} | Flowtix`;
  let description = `Calculate your monthly electric bill in ${stateName} based on average utility rates. Test space heaters, EV chargers, and air conditioning to save money.`;

  if (tab === "gas") {
    title = `Average Natural Gas Bill Calculator in ${stateName} | Flowtix`;
    description = `Estimate your average natural gas utility bill in ${stateName}. Adjust winter thermostats and furnace fuels to model structural savings.`;
  } else if (tab === "water") {
    title = `Estimate My Water Bill in ${stateName} | Tiered Rates | Flowtix`;
    description = `Calculate your monthly water bill in ${stateName} based on household size, showers, and lawn irrigation. See how local water tiers apply.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: url
    }
  };
}

export default async function StatePage({ params }) {
  const { slug } = await params;
  const { stateCode, tab, stateKey } = parseSlug(slug);
  const stateData = stateUtilityData[stateCode] || stateUtilityData.CA;
  const stateName = stateData.name;

  // Render variables based on active tab
  let h1Text = `Average ${stateName} Electricity Bill Calculator`;
  let subText = `Pre-loaded with recent standard averages of $${stateData.electricityRate.toFixed(3)}/kWh for the State of ${stateName}.`;
  let summaryParagraph = `Electricity rates in ${stateName} vary based on season and region. Our calculator runs Texas-specific algorithms, baseline square footage draw, and active appliance consumption metrics to let you estimate your monthly household costs.`;
  
  if (tab === "gas") {
    h1Text = `Average Natural Gas Bill in ${stateName} | Therm Estimator`;
    subText = `Pre-loaded with cached averages of $${stateData.gasRate.toFixed(2)}/Therm for ${stateName}.`;
    summaryParagraph = `Natural gas is commonly used for home space heating and hot water. This dedicated regional page pre-calculates baseline usage in ${stateName} according to system selections (boiler vs. furnace) and thermostat parameters.`;
  } else if (tab === "water") {
    h1Text = `Estimate My Water Bill in ${stateName} | Tier Rates`;
    subText = `Configured for ${stateName} water connections: base fee of $${stateData.waterBaseFee.toFixed(2)} and $${stateData.waterRate.toFixed(2)} per 1,000 gallons.`;
    summaryParagraph = `Municipal water connections across ${stateName} utilize progressive tiered billing blocks. This calculator parses family size, lawn watering frequencies, and shower hours to estimate where your usage fits in the regional pricing tier.`;
  }

  // Generate FAQ schema structure (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the average ${tab === "electric" ? "electricity" : tab === "gas" ? "gas" : "water"} rate in ${stateName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `According to our synced database, the average residential rate in ${stateName} is currently ${
            tab === "electric" 
              ? `$${stateData.electricityRate.toFixed(3)} per kWh` 
              : tab === "gas" 
              ? `$${stateData.gasRate.toFixed(2)} per Therm` 
              : `$${stateData.waterRate.toFixed(2)} per 1,000 gallons plus a fixed base fee of $${stateData.waterBaseFee.toFixed(2)}`
          }.`
        }
      },
      {
        "@type": "Question",
        "name": `How can I save money on my utilities in ${stateName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can lower your bills by adopting conservation behaviors. For electricity, reduce AC/space heater runtime or charge EVs off-peak. For natural gas, turn down your thermostat by 2 degrees. For water, shorten showers and reduce lawn irrigation frequency.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] transition-colors duration-300">
      
      {/* Inject Structured Search Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Programmatic SEO Heading block (Server Pre-rendered for Crawler Indexing) */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
            <Info className="w-3.5 h-3.5" />
            Programmatic State Page
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            {h1Text}
          </h1>
          <p className="text-base md:text-lg text-emerald-600 dark:text-emerald-400 font-semibold leading-normal">
            {subText}
          </p>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            {summaryParagraph}
          </p>
        </div>
      </div>

      {/* Live Interactive Client Dashboard loaded statically */}
      <div className="py-6">
        <ClientDashboard initialState={stateCode} initialTab={tab} />
      </div>

      {/* Programmatic SEO FAQ & Educational Content Block */}
      <section className="max-w-4xl mx-auto px-4 pb-16 pt-8 border-t border-gray-200 dark:border-gray-800 mt-8 space-y-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-white font-sans">
            Utility Price FAQ for the State of {stateName}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Understanding localized pricing structures and peak usage blocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              How are averages sourced?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Rates represent typical residential utility figures compiled periodically across regions. Water fees represent typical municipal averages across {stateName}.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              Is my personal usage different?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Yes. Grid configuration, contract tiers, and municipal codes differ. Use our **Personal Rate Customizer** in the sidebar to manually input rates from your last utility bill to override defaults.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
