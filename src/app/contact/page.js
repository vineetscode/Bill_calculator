"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("https://formsubmit.co/ajax/vineetsinghjzr28@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "New Flowtix Utility Estimator Contact Form Message"
        })
      });

      const result = await response.json();
      if (response.ok && result.success === "true") {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(result.message || "Failed to deliver message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-150 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="text-center space-y-3.5">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-sans">
            Get in Touch with Flowtix
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed font-sans">
            Have questions about our calculations? Spotted a rate mismatch in your state? Drop us a line and our utility research team will analyze your report.
          </p>
        </section>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form */}
          <section className="md:col-span-7 p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white font-sans">
              Send a Message
            </h2>
            
            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-start gap-3 text-xs leading-relaxed animate-fade-in font-sans">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Message Sent Successfully!</span>
                  Thank you for reaching out. Vineet Singh will review your message and reply within 48 business hours.
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-3 text-xs leading-relaxed animate-fade-in font-sans">
                <div className="font-bold block">Error: {error}</div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input suppressHydrationWarning={true}
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-255 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-gray-305 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-gray-455 dark:text-gray-550 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input suppressHydrationWarning={true}
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-255 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-gray-350 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-gray-455 dark:text-gray-550 uppercase tracking-wide">
                    Message Details
                  </label>
                  <textarea suppressHydrationWarning={true}
                    id="contact-message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your utility billing query or feedback here..."
                    className="w-full px-4 py-3 rounded-xl border bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-255 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-gray-350 transition-colors"
                  />
                </div>

                <button suppressHydrationWarning={true}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-bold shadow-md shadow-emerald-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Form
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Right Column: Contact Details */}
          <section className="md:col-span-5 space-y-6">
            
            {/* Direct Channels */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-805/60 shadow-sm space-y-4 text-left hover:shadow-md transition-shadow">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white font-sans">
                Contact Information
              </h2>
              <div className="space-y-4 font-sans text-xs">
                
                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">General Support</span>
                    <a href="mailto:vineetsinghjzr28@gmail.com" className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 no-underline transition-colors mt-0.5 block truncate max-w-[200px] font-semibold">
                      vineetsinghjzr28@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">Phone Helpline</span>
                    <a href="tel:9580024955" className="text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 no-underline transition-colors mt-0.5 block font-semibold">
                      9580024955
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">Office Location</span>
                    <span className="text-gray-400 dark:text-gray-500 leading-relaxed block mt-0.5 font-semibold">
                      Uttar Pradesh, India
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Note on Data Security */}
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-950/20 border border-gray-150/60 dark:border-gray-805/60 space-y-3.5 text-left font-sans hover:shadow-md transition-shadow">
              <span className="text-xs font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/20 px-2 py-0.5 rounded text-emerald-500 border border-emerald-100/40 dark:border-emerald-900/30 font-sans">
                Privacy Certified
              </span>
              <p className="text-xs text-gray-505 dark:text-gray-400 leading-relaxed">
                Flowtix takes data protection seriously. Any information submitted via our forms is used solely to resolve your specific billing query. We never sell, lease, or share contact lists with third-party utility marketing companies.
              </p>
            </div>

          </section>

        </div>

      </div>
    </div>
  );
}
