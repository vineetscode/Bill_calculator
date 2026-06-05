import "./globals.css";

export const metadata = {
  title: "Flowtix Smart Bill Calculator",
  description:
    "Free online utility and bill calculator. Estimate electricity, water, and gas costs and compare monthly household expenses.",
  metadataBase: new URL(
    "https://flowtix-smart-bill-calculator.netlify.app"
  ),

  openGraph: {
    title: "Flowtix Smart Bill Calculator",
    description:
      "Estimate electricity, water, and gas costs with Flowtix Smart Bill Calculator.",
    url: "https://flowtix-smart-bill-calculator.netlify.app",
    siteName: "Flowtix",
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        <meta
          name="google-adsense-account"
          content="ca-pub-8451288986881953"
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8451288986881953"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}