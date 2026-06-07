"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, Hammer, FileText, HelpCircle, PhoneCall, Home, ChevronDown, ChevronRight } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Savings Blog", href: "/blog", icon: FileText },
    { name: "About Us", href: "/about", icon: HelpCircle },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  const toolsList = [
    { name: "Electricity Cost Calculator", href: "/tools/electricity-cost" },
    { name: "Water Cost Calculator", href: "/tools/water-cost" },
    { name: "Appliance Energy Cost", href: "/tools/appliance-energy" },
    { name: "EV Charging Cost", href: "/tools/ev-charging" },
    { name: "Solar Savings", href: "/tools/solar-savings" },
    { name: "Heating Cost Calculator", href: "/tools/heating-cost" },
    { name: "All Tools Dashboard", href: "/tools", divider: true },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-[#0b0f19]/80 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2.5 group no-underline">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform select-none">
              <Leaf className="w-5.5 h-5.5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent leading-none">
                Flowtix
              </span>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                Smart Bill Estimator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Home Link */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border no-underline ${
                isActive("/")
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                  : "border-transparent text-gray-650 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>

            {/* Comparison Tools Hover Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button suppressHydrationWarning={true}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                  pathname.startsWith("/tools")
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                    : "border-transparent text-gray-650 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                Comparison Tools
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-[#0b0f19]/95 z-50 animate-fade-in font-sans">
                  {toolsList.map((tool, idx) => {
                    if (tool.divider) {
                      return (
                        <div key="divider-dash" className="my-1 border-t border-gray-100 dark:border-gray-800/60">
                          <Link
                            href={tool.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 no-underline transition-colors cursor-pointer"
                          >
                            <span>{tool.name}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-gray-650 dark:text-gray-350 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white no-underline transition-all cursor-pointer truncate"
                      >
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rest of Navigation Links */}
            {navigation.slice(1).map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border no-underline ${
                    active
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                      : "border-transparent text-gray-650 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tools"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-bold shadow-md shadow-emerald-500/10 transition-all no-underline"
            >
              All Tools
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button suppressHydrationWarning={true}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:bg-gray-150/40 dark:hover:bg-gray-800/40 focus:outline-none transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle main menu"
            >
              {mobileMenuOpen ? (
                <X className="block h-5 w-5 text-gray-500 dark:text-gray-300" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5 text-gray-500 dark:text-gray-300" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Down */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#0b0f19] px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          {/* Home Link */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border no-underline transition-all ${
              isActive("/")
                ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          {/* Collapsible Mobile Comparison Tools Accordion */}
          <div className="space-y-1">
            <button suppressHydrationWarning={true}
              type="button"
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold border cursor-pointer transition-all ${
                pathname.startsWith("/tools")
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                  : "border-transparent text-gray-600 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center gap-3">
                <Hammer className="w-4 h-4" />
                Comparison Tools
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileToolsOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileToolsOpen && (
              <div className="pl-6 space-y-1.5 py-1.5 animate-fade-in">
                {toolsList.slice(0, -1).map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileToolsOpen(false);
                    }}
                    className="block px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 no-underline transition-colors"
                  >
                    • {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Rest of Mobile Navigation Links */}
          {navigation.slice(1).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border no-underline transition-all ${
                  active
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                    : "border-transparent text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-gray-100 dark:border-gray-850">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 no-underline"
            >
              Use Comparison Tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
