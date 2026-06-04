import "./globals.css";

export const metadata = {
  title: "Flowtix - Smart Utility & Bill Estimator",
  description: "Calculate and estimate your monthly household utility costs. Compare electricity, natural gas, and water usage in your state with our smart bill estimator.",
  metadataBase: new URL("https://flowtix.com")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
