"use client";

import React from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8 text-left font-sans">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Last Updated: June 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Privacy Policy
          </h1>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            At Flowtix (reachable from Flowtix.com or its hosting locations), we prioritize the privacy and security of our visitors. This Privacy Policy details the types of information we collect, record, and how we handle and protect it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This Privacy Policy applies solely to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Flowtix. This policy is not applicable to any information collected offline or via channels other than this website.
          </p>
        </section>

        {/* Consent */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            1. Consent
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            2. Information We Collect
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Flowtix is designed as a client-side calculation utility tool. Most interactions and details are modeled and run directly inside your browser:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed space-y-2 list-disc pl-5">
            <li><strong>Local Storage Customizations:</strong> When you input custom rates under our <em>Personal Rate Customizer</em>, these variables are stored locally inside your browser cache. We do not transmit or store these custom tariffs on our servers.</li>
            <li><strong>OCR Bill Scanning:</strong> If you upload a photograph or image of your utility invoice to parse rates via our Bill Scanner, the image processing is executed client-side inside the browser using Tesseract.js libraries. No bill images or scanned texts are sent to our servers.</li>
            <li><strong>Contact Details:</strong> If you contact us directly via email or our contact forms, we collect your name, email address, phone number, the contents of the message, and any attachments you send us to resolve your support inquiry.</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            3. How We Use Your Information
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            We use the information we collect in various ways, including to:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our calculators and tools directory.</li>
            <li>Understand and analyze how visitors interact with our utility calculators.</li>
            <li>Develop new calculators, data charts, and savings tips pages.</li>
            <li>Communicate with you to provide support updates.</li>
            <li>Find and prevent fraudulent actions or security bugs.</li>
          </ul>
        </section>

        {/* Cookies and Web Beacons */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            4. Cookies & Web Beacons
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            Like any other website, Flowtix uses cookies. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </section>

        {/* Google DoubleClick DART Cookie */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            5. Google DoubleClick DART Cookie & AdSense Requirements
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-500 no-underline hover:underline">https://policies.google.com/technologies/ads</a>.
          </p>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            We use Google AdSense to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet. You can manage your ad settings by visiting your Google Ad Settings page.
          </p>
        </section>

        {/* Third Party Privacy Policies */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            6. Third-Party Privacy Policies
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            Flowtix's Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
          </p>
        </section>

        {/* GDPR & CCPA Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            7. GDPR & CCPA Data Protection Rights
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed space-y-1.5 list-disc pl-5">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
