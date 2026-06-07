import { useEffect } from "react";

export default function SEO({ activeTab, selectedStateCode, selectedStateName, monthlyCost = 0, estimatedSavings = 0 }) {
  useEffect(() => {
    let title = "Flowtix - Smart Utility & Bill Estimator | Average Bill Calculator";
    let description = "Calculate and estimate your monthly household utility costs. Compare electricity, natural gas, and water usage in your state with our smart bill estimator.";
    let pageUrl = window.location.origin + window.location.pathname;

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

    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    // Build and Inject JSON-LD Schema
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
      "url": window.location.origin,
      "logo": `${window.location.origin}/favicon.svg`,
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
      "url": window.location.origin
    };

    // Build breadcrumbs dynamically based on path segments
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      }
    ];
    pathSegments.forEach((segment, index) => {
      const href = window.location.origin + "/" + pathSegments.slice(0, index + 1).join("/");
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

    // Remove existing schemas
    const existingScripts = document.querySelectorAll("script[data-seo-schema]");
    existingScripts.forEach(script => script.remove());

    // Inject New Schemas
    const injectSchema = (id, data) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-schema", id);
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    };

    injectSchema("webapp", webAppSchema);
    injectSchema("faq", faqSchema);
    injectSchema("org", orgSchema);
    injectSchema("website", websiteSchema);
    injectSchema("breadcrumb", breadcrumbSchema);

  }, [activeTab, selectedStateCode, selectedStateName, monthlyCost, estimatedSavings]);

  return null; // SEO updates head elements side-effectually
}
