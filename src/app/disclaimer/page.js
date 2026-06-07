"use client";

import React from "react";
import { Info, HelpCircle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8 text-left font-sans">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30">
            <Info className="w-3.5 h-3.5" />
            Legal Disclaimer
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Disclaimer
          </h1>
        </div>

        {/* General Disclaimer */}
        <section className="space-y-4">
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            All information and calculator utilities on Flowtix (reachable at Flowtix.com) are published in good faith and for general educational and modeling simulation purposes only. Flowtix does not make any warranties about the completeness, reliability, and accuracy of these mathematical models.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
            Any action you take upon the information you find on this website is strictly at your own risk. Flowtix will not be liable for any losses and/or damages in connection with the use of our website.
          </p>
        </section>

        {/* Specific Utility Estimations */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            1. Utility Rates & Estimates Approximation
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            The data maps pre-loaded inside Flowtix calculators represent regional averages gathered from public sources, including the U.S. Energy Information Administration (EIA), state public utility commissions, and municipal water district schedules.
          </p>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            Your actual utility charges will differ from our models because:
          </p>
          <ul className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Utility providers frequently modify their base energy tariff rates per season.</li>
            <li>Your contract may place you under special commercial, progressive tier, or demand charge tariff blocks.</li>
            <li>Grid bills include local franchise taxes, delivery surcharges, and customer service fees that are highly localized down to the municipality or neighborhood level.</li>
            <li>Household appliances vary in thermodynamic and electrical drawing efficiency based on age, insulation ratings, and exact model specifications.</li>
          </ul>
        </section>

        {/* Editorial Standards */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            2. Professional Energy Auditing Advice
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            Content found on this site is not a substitute for a professional home energy audit or certified engineering assessment. Before making capital investments—such as installing residential solar systems, purchasing premium heat pumps, re-insulating attics, or modifying utility contracts—we recommend consulting with a certified energy auditor or contacting your local utility provider's representative.
          </p>
        </section>

        {/* Outbound Links Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            3. External Links Disclaimer
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.
          </p>
        </section>

      </div>
    </div>
  );
}
