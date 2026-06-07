import React, { useState, useEffect } from "react";

export default function SEO({ activeTab, selectedStateCode, selectedStateName, monthlyCost = 0, estimatedSavings = 0 }) {
  // Initialize with server-safe defaults to ensure SSR and initial hydration render match exactly
  const [origin, setOrigin] = useState("https://flowtix-smart-bill-calculator.netlify.app");
  const [pageUrl, setPageUrl] = useState("https://flowtix-smart-bill-calculator.netlify.app");
  const [pathSegments, setPathSegments] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      setPageUrl(window.location.origin + window.location.pathname);
      setPathSegments(window.location.pathname.split("/").filter(Boolean));
    }
  }, []);

  let title = "Flowtix - Smart Utility & Bill Estimator | Average Bill Calculator";
  let description = "Calculate and estimate your monthly household utility costs. Compare electricity, natural gas, and water usage in your state with our smart bill estimator.";

  const formattedCost = monthlyCost > 0 ? `$${monthlyCost.toFixed(2)}` : "";
  const stateSuffix = selectedStateName ? ` in ${selectedStateName}` : "";

  switch (activeTab) {
    case "electric":
      title = `Average Electric Bill Calculator${stateSuffix} | Flowtix`;
      description = `Estimate your monthly electricity bill${stateSuffix}. Calculate air conditioner cost per hour, EV charging, and appliance consumption to save up to $${estimatedSavings.toFixed(0)}/month.`;
      break;
    case "gas":
      title = `Average Gas Bill Calculator${stateSuffix} | Heating Cost | Flowtix`;
      description = `Calculate your home gas bill${stateSuffix} based on furnace, boiler, or water heater systems. Adjust thermostat sliders to see instant cost savings.`;
      break;
    case "water":
      title = `Estimate My Water Bill${stateSuffix} | Tiered Cost Calculator | Flowtix`;
      description = `Calculate your monthly water bill${stateSuffix} based on family size, shower duration, and lawn irrigation. See how state water tier rates impact your costs.`;
      break;
    default:
      break;
  }

  // Build JSON-LD Schemas
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Flowtix - Smart Utility & Bill Estimator",
    "alternateName": "Flowtix",
    "url": pageUrl,
    "description": description,
    "applicationCategory": "BusinessApplication, Calculator",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How is my electric bill calculated in ${selectedStateName || 'my state'}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Your electric bill is calculated by combining a baseline usage based on your home's square footage with the total monthly power draw of active appliances (like your air conditioner, space heater, and EV charger), then multiplying the total kWh by the average rate of $${formattedCost || 'recent standard'} per kWh in ${selectedStateName || 'your state'}.`
        }
      },
      {
        "@type": "Question",
        "name": "How does thermostat setting affect the natural gas bill?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every degree you turn your thermostat down in the winter or up in the summer can reduce your heating or cooling system's fuel usage by approximately 5% to 6%. Our calculator estimates this change dynamically based on standard furnace and boiler fuel usage models."
        }
      },
      {
        "@type": "Question",
        "name": "What are water tiers and how do they impact my water cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Many municipal water systems charge using a tiered rate system. Tier 1 covers baseline usage (up to 3,000 gallons) at a lower rate. Tier 2 covers moderate usage (3,001 to 10,000 gallons) at a 1.5x rate, and Tier 3 covers luxury usage (over 10,000 gallons, such as heavy lawn watering) at a 2.2x rate."
        }
      }
    ]
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Flowtix",
    "alternateName": "Flowtix Smart Utility & Bill Estimator",
    "url": origin,
    "logo": `${origin}/favicon.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-512-555-0198",
      "contactType": "customer service",
      "email": "support@flowtix.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Flowtix",
    "url": origin
  };

  // Build breadcrumbs dynamically based on path segments
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": origin
    }
  ];
  pathSegments.forEach((segment, index) => {
    const href = origin + "/" + pathSegments.slice(0, index + 1).join("/");
    const name = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    itemListElement.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": href
    });
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
