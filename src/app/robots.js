export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://flowtix-smart-bill-calculator.netlify.app/sitemap.xml",
  };
}
