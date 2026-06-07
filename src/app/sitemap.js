import { blogArticles } from "../data/blogArticles";

const domain = "https://flowtix-smart-bill-calculator.netlify.app";

const states = [
  "alabama", "alaska", "arizona", "arkansas", "california",
  "colorado", "connecticut", "delaware", "florida", "georgia",
  "hawaii", "idaho", "illinois", "indiana", "iowa",
  "kansas", "kentucky", "louisiana", "maine", "maryland",
  "massachusetts", "michigan", "minnesota", "mississippi", "missouri",
  "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
  "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio",
  "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
  "south-dakota", "tennessee", "texas", "utah", "vermont",
  "virginia", "washington", "west-virginia", "wisconsin", "wyoming"
];

const utilities = [
  "electric-bill-calculator",
  "gas-bill-calculator",
  "water-estimator"
];

const staticPages = [
  "",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/tools",
  "/blog"
];

const toolsList = [
  "/tools/electricity-cost",
  "/tools/water-cost",
  "/tools/appliance-energy",
  "/tools/ev-charging",
  "/tools/solar-savings",
  "/tools/heating-cost"
];

export default function sitemap() {
  const currentDate = new Date();
  const sitemapEntries = [];

  // 1. Static Pages
  staticPages.forEach((path) => {
    sitemapEntries.push({
      url: `${domain}${path}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: path === "" ? 1.0 : 0.8,
    });
  });

  // 2. Individual Tools
  toolsList.forEach((path) => {
    sitemapEntries.push({
      url: `${domain}${path}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // 3. Blog Articles
  blogArticles.forEach((article) => {
    sitemapEntries.push({
      url: `${domain}/blog/${article.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // 4. Programmatic State Calculator Combinations (150 paths)
  states.forEach((state) => {
    utilities.forEach((utility) => {
      sitemapEntries.push({
        url: `${domain}/state/${state}-${utility}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}