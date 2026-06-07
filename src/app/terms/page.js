"use client";

import React from "react";
import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8 text-left font-sans">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
            <Scale className="w-3.5 h-3.5" />
            Effective: June 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Terms & Conditions
          </h1>
        </div>

        {/* Welcome */}
        <section className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Welcome to Flowtix! These terms and conditions outline the rules and regulations for the use of Flowtix's Website, located at Flowtix.com.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Flowtix if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </section>

        {/* Terminology */}
        <section className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
          </p>
        </section>

        {/* License */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            1. Intellectual Property License
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Unless otherwise stated, Flowtix and/or its licensors own the intellectual property rights for all material on Flowtix. All intellectual property rights are reserved. You may access this from Flowtix for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            You must not:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Republish material or utility calculators from Flowtix.</li>
            <li>Sell, rent, or sub-license material or tools from Flowtix.</li>
            <li>Reproduce, duplicate, or copy code algorithms from Flowtix.</li>
            <li>Redistribute content from Flowtix.</li>
          </ul>
        </section>

        {/* User Comments & Contributions */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            2. User Comments & Feedback
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Parts of this website offer an opportunity for users to submit messages or feedback regarding utility rates in certain areas. Flowtix does not filter, edit, publish or review comments prior to their presence on the website. Comments do not reflect the views and opinions of Flowtix, its agents and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
          </p>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            Flowtix reserves the right to monitor all comments and feedback and to remove any comments which can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.
          </p>
        </section>

        {/* Hyperlinking to our Content */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            3. Hyperlinking to our Content
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed">
            The following organizations may link to our Website without prior written approval:
          </p>
          <ul className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed space-y-1.5 list-disc pl-5">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</li>
          </ul>
        </section>

        {/* Reservation of Rights */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            4. Reservation of Rights
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
          </p>
        </section>

        {/* Disclaimer of Calculator Math */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            5. Limitation of Liability & Calculator Estimates Disclaimer
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            The calculators and estimators provided on Flowtix are for educational and planning simulation purposes only. The mathematical projections, carbon reduction savings estimates, and utility tariff mappings are modeled based on standard state averages and are not intended to represent actual utility bills or invoices. 
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
            We do not warrant that the calculations are 100% accurate, complete, or up-to-date. Your actual utility rates, grid transmission surcharges, local franchise fees, and household consumption behaviors will vary based on regional weather events and individual provider terms. We are not liable for any financial decisions or actions taken based on Flowtix models.
          </p>
        </section>

      </div>
    </div>
  );
}
