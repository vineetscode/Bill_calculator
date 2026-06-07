"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  Send, 
  Info, 
  Sparkles, 
  Loader2, 
  Check 
} from "lucide-react";

export default function ContactBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // chat | form | info
  const popoverRef = useRef(null);

  // Chatbot State
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! 👋 I'm the Flowtix Utility Assistant. How can I help you optimize your bills today?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (activeTab === "chat" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab, isTyping]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle preset suggestions in chatbot
  const handleSuggestionClick = (suggestionText, queryKeyword) => {
    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: suggestionText
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      if (queryKeyword === "electricity") {
        replyText = "💡 **Electricity Saving Tips:**\n1. **Shift Peak Loads:** Run heavy appliances (washers, dryers, dishwashers) off-peak (before 4 PM or after 9 PM) to save up to 30% under Time-of-Use tariffs.\n2. **Manage Standby Load:** Unplug unused chargers and gaming consoles. They draw 'vampire' power continuously.\n3. **Use the Calculator:** Model expansion appliances and schedule shifts in our **Electricity Calculator**!";
      } else if (queryKeyword === "water") {
        replyText = "💧 **Water Optimization Tips:**\n1. **Lawn Irrigation:** Water accounts for 50%+ of summer utility costs. Water early in the morning and reduce frequency to stay in lower tier pricing.\n2. **Shower Efficiency:** Standard showerheads use 2.5 GPM; upgrading to low-flow (<2.0 GPM) saves thousands of gallons.\n3. **Tiered Billing:** Model your usage in our **Water Calculator** to keep within standard Tier 1 pricing.";
      } else if (queryKeyword === "gas") {
        replyText = "🔥 **Natural Gas Heating Tips:**\n1. **Thermostat Controls:** Lowering your temperature setting by 1°F in winter reduces gas consumption by roughly 3%.\n2. **Appliance Base Load:** Standardize your furnace or boiler setpoint schedules to prevent frequent short-cycling.\n3. **Model Gas Shifts:** Use the **Natural Gas Calculator** to slide setpoints and estimate gas savings.";
      } else if (queryKeyword === "contact") {
        replyText = "👤 **Contact Vineet Singh:**\n- **Email:** vineetsinghjzr28@gmail.com\n- **Phone:** 9580024955\n- **Office:** Uttar Pradesh, India\n\nYou can also click the **Send Message** tab above to email Vineet directly!";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText
      }]);
      setIsTyping(false);
    }, 800);
  };

  // Handle sending a custom chatbot message
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const query = userText.toLowerCase();
      let replyText = "";

      if (query.includes("elect") || query.includes("power") || query.includes("light") || query.includes("appliance")) {
        replyText = "💡 **Electricity Saving Tips:**\n1. **Shift Peak Loads:** High-load appliances are best run off-peak (before 4 PM or after 9 PM).\n2. **Vampire Loads:** Cut standby draws using smart power strips.\n3. **Optimizations:** You can model expansion appliances and peak shifts dynamically in our **Electricity Calculator**!";
      } else if (query.includes("water") || query.includes("shower") || query.includes("lawn") || query.includes("drip") || query.includes("irrigation")) {
        replyText = "💧 **Water Optimization Tips:**\n1. **Limit Lawn Irrigation:** Water early in the morning and reduce frequency.\n2. **Shower Heads:** High-efficiency showerheads save hot water.\n3. **Stay in Tier 1:** Use our **Water Calculator** to keep within standard Tier 1 pricing.";
      } else if (query.includes("gas") || query.includes("heat") || query.includes("furnace") || query.includes("boiler") || query.includes("therm")) {
        replyText = "🔥 **Natural Gas Heating Tips:**\n1. **Thermostat Setpoint:** Turning your thermostat down by just 1°F in winter reduces heating consumption by 3%.\n2. **Appliance Load:** Use the **Natural Gas Calculator** to slide setpoints and estimate gas savings.";
      } else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("call") || query.includes("vineet") || query.includes("address") || query.includes("location") || query.includes("office")) {
        replyText = "👤 **Contact Vineet Singh:**\n- **Email:** vineetsinghjzr28@gmail.com\n- **Phone:** 9580024955\n- **Office:** Uttar Pradesh, India\n\nYou can also click the **Send Message** tab above to email Vineet directly!";
      } else {
        replyText = "👋 I'm the Flowtix Utility Assistant!\n\nI can help you estimate your energy/water usage. Try asking about:\n- **Electricity savings** or Peak Shift optimization\n- **Water tier systems** and lawn irrigation\n- **Natural gas savings** & winter heating tips\n- How to **contact Vineet**";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText
      }]);
      setIsTyping(false);
    }, 800);
  };

  // Handle Custom Message form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;

    setFormStatus("sending");
    try {
      const response = await fetch("https://formsubmit.co/ajax/vineetsinghjzr28@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage,
          _subject: `New Message from Flowtix Bubble: ${formName}`
        })
      });

      const result = await response.json();
      if (result.success || response.ok) {
        setFormStatus("success");
        setFormName("");
        setFormEmail("");
        setFormMessage("");
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Form submission error", error);
      setFormStatus("error");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden font-sans" ref={popoverRef}>
      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl border border-gray-200/80 bg-white/95 shadow-2xl backdrop-blur-md dark:border-gray-800/80 dark:bg-slate-950/95 animate-fade-in text-left flex flex-col h-[480px]">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <div>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                  Flowtix Assistant <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                </h4>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 block">
                  Typically replies instantly
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-250 transition-colors cursor-pointer"
              aria-label="Close contact popover"
              suppressHydrationWarning={true}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-gray-50 dark:bg-slate-900/50 p-1 border-b border-gray-100 dark:border-gray-800/60 shrink-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "chat"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-250"
              }`}
              suppressHydrationWarning={true}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chatbot
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "form"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-250"
              }`}
              suppressHydrationWarning={true}
            >
              <Mail className="w-3.5 h-3.5" />
              Send Message
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "info"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-250"
              }`}
              suppressHydrationWarning={true}
            >
              <Info className="w-3.5 h-3.5" />
              Info
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            
            {/* Chatbot Tab */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-2xl shadow-sm whitespace-pre-line leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-emerald-500 text-white rounded-tr-none"
                            : "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-100 rounded-tl-none border border-gray-200/20"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-150 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips & Chat Input */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/60 shrink-0">
                  {messages.length <= 2 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <button
                        onClick={() => handleSuggestionClick("How can I save electricity?", "electricity")}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        suppressHydrationWarning={true}
                      >
                        💡 Save Electricity
                      </button>
                      <button
                        onClick={() => handleSuggestionClick("Explain the tiered water rates.", "water")}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        suppressHydrationWarning={true}
                      >
                        💧 Water Tier Rates
                      </button>
                      <button
                        onClick={() => handleSuggestionClick("Give me gas saving tips.", "gas")}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        suppressHydrationWarning={true}
                      >
                        🔥 Gas Saving Tips
                      </button>
                      <button
                        onClick={() => handleSuggestionClick("How can I contact Vineet?", "contact")}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        suppressHydrationWarning={true}
                      >
                        👤 Contact Vineet
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask utility savings advice..."
                      className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-850 dark:text-slate-100"
                      suppressHydrationWarning={true}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-650 dark:hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Send chatbot message"
                      suppressHydrationWarning={true}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Message Form Tab */}
            {activeTab === "form" && (
              <div className="h-full flex flex-col justify-between">
                {formStatus === "success" ? (
                  <div className="flex flex-col items-center justify-center text-center my-auto py-6 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-3">
                      <Check className="w-6 h-6 animate-pulse" />
                    </div>
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      Message Sent Successfully!
                    </h5>
                    <p className="text-xs text-gray-550 dark:text-gray-400 max-w-[240px]">
                      Your request has been forwarded to Vineet. We will reply to your email shortly.
                    </p>
                    <button
                      onClick={() => setFormStatus("idle")}
                      className="mt-5 text-xs font-bold text-emerald-500 hover:text-emerald-650 cursor-pointer"
                      suppressHydrationWarning={true}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 overflow-y-auto pr-1">
                      {formStatus === "error" && (
                        <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 text-[11px] font-semibold border border-red-200/25">
                          Failed to send message. Please try again.
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-550 dark:text-gray-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-800 dark:text-slate-100"
                          suppressHydrationWarning={true}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-550 dark:text-gray-400 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-800 dark:text-slate-100"
                          suppressHydrationWarning={true}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-550 dark:text-gray-400 mb-1">
                          Message
                        </label>
                        <textarea
                          required
                          rows="3"
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Write your custom message..."
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-gray-800 dark:text-slate-100 resize-none"
                          suppressHydrationWarning={true}
                        ></textarea>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                      suppressHydrationWarning={true}
                    >
                      {formStatus === "sending" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Custom Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-1">
                  Connect with us directly for custom utility auditing, partnership inquires, or technical support.
                </p>

                {/* Phone Card */}
                <a
                  href="tel:9580024955"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 hover:border-emerald-500/20 bg-gray-50/50 hover:bg-emerald-50/10 dark:border-gray-800 dark:hover:border-emerald-500/20 dark:bg-slate-900/30 dark:hover:bg-emerald-950/10 no-underline transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs text-gray-800 dark:text-gray-250">
                      Call Helpline
                    </span>
                    <span className="font-semibold block mt-0.5 text-xs text-emerald-500 dark:text-emerald-400">
                      9580024955
                    </span>
                  </div>
                </a>

                {/* Email Card */}
                <a
                  href="mailto:vineetsinghjzr28@gmail.com"
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 hover:border-emerald-500/20 bg-gray-50/50 hover:bg-emerald-50/10 dark:border-gray-800 dark:hover:border-emerald-500/20 dark:bg-slate-900/30 dark:hover:bg-emerald-950/10 no-underline transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold block text-xs text-gray-800 dark:text-gray-250">
                      Email Directly
                    </span>
                    <span className="font-semibold block mt-0.5 text-xs text-emerald-500 dark:text-emerald-400 truncate max-w-[210px]">
                      vineetsinghjzr28@gmail.com
                    </span>
                  </div>
                </a>

                {/* Location Card */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-slate-900/30">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-bold block text-xs text-gray-800 dark:text-gray-250">
                      Office Location
                    </span>
                    <span className="font-semibold block mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Uttar Pradesh, India
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-650 dark:hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-110 active:scale-95 animate-bubble-float group border border-emerald-400/20 dark:border-emerald-500/10 cursor-pointer"
        aria-label="Toggle contact help menu"
        suppressHydrationWarning={true}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform rotate-0 duration-300" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform rotate-0 group-hover:rotate-12 duration-300" />
        )}
      </button>
    </div>
  );
}

