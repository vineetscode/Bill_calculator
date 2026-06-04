// ZIP Code Lookup Helper
// Maps 5-digit ZIP code strings (or their prefix ranges) to US State Codes (e.g. "90210" -> "CA")

export function lookupStateByZip(zipString) {
  if (!zipString || typeof zipString !== "string") return null;
  
  // Clean string
  const cleanZip = zipString.replace(/\D/g, "").slice(0, 5);
  if (cleanZip.length < 5) return null;
  
  const zipNum = parseInt(cleanZip, 10);
  if (isNaN(zipNum)) return null;

  // Prefix range matching (Based on standard USPS routing)
  if (zipNum >= 1000 && zipNum <= 2799) return "MA";
  if (zipNum >= 2800 && zipNum <= 2999) return "RI";
  if (zipNum >= 3000 && zipNum <= 3899) return "NH";
  if (zipNum >= 3900 && zipNum <= 4999) return "ME";
  if (zipNum >= 5000 && zipNum <= 5999) return "VT";
  if (zipNum >= 6000 && zipNum <= 6999) return "CT";
  if (zipNum >= 7000 && zipNum <= 8999) return "NJ";
  if (zipNum >= 10000 && zipNum <= 14999) return "NY";
  if (zipNum >= 15000 && zipNum <= 19699) return "PA";
  if (zipNum >= 19700 && zipNum <= 19999) return "DE";
  if ((zipNum >= 20000 && zipNum <= 20099) || (zipNum >= 20200 && zipNum <= 20599)) return "DC";
  if (zipNum >= 20600 && zipNum <= 21999) return "MD";
  if ((zipNum >= 20100 && zipNum <= 20199) || (zipNum >= 22000 && zipNum <= 24699)) return "VA";
  if (zipNum >= 24700 && zipNum <= 26999) return "WV";
  if (zipNum >= 27000 && zipNum <= 28999) return "NC";
  if (zipNum >= 29000 && zipNum <= 29999) return "SC";
  if (zipNum >= 30000 && zipNum <= 31999) return "GA";
  if (zipNum >= 32000 && zipNum <= 34999) return "FL";
  if (zipNum >= 35000 && zipNum <= 36999) return "AL";
  if (zipNum >= 37000 && zipNum <= 38599) return "TN";
  if (zipNum >= 38600 && zipNum <= 39999) return "MS";
  if (zipNum >= 40000 && zipNum <= 42799) return "KY";
  if (zipNum >= 43000 && zipNum <= 45999) return "OH";
  if (zipNum >= 46000 && zipNum <= 47999) return "IN";
  if (zipNum >= 48000 && zipNum <= 49999) return "MI";
  if (zipNum >= 50000 && zipNum <= 52899) return "IA";
  if (zipNum >= 53000 && zipNum <= 54999) return "WI";
  if (zipNum >= 55000 && zipNum <= 56799) return "MN";
  if (zipNum >= 57000 && zipNum <= 57799) return "SD";
  if (zipNum >= 58000 && zipNum <= 58899) return "ND";
  if (zipNum >= 59000 && zipNum <= 59999) return "MT";
  if (zipNum >= 60000 && zipNum <= 62999) return "IL";
  if (zipNum >= 63000 && zipNum <= 65899) return "MO";
  if (zipNum >= 66000 && zipNum <= 67999) return "KS";
  if (zipNum >= 68000 && zipNum <= 69399) return "NE";
  if (zipNum >= 70000 && zipNum <= 71499) return "LA";
  if (zipNum >= 71600 && zipNum <= 72999) return "AR";
  if (zipNum >= 73000 && zipNum <= 74999) return "OK";
  if ((zipNum >= 75000 && zipNum <= 79999) || (zipNum >= 88500 && zipNum <= 88599)) return "TX";
  if (zipNum >= 80000 && zipNum <= 81699) return "CO";
  if (zipNum >= 82000 && zipNum <= 83199) return "WY";
  if (zipNum >= 83200 && zipNum <= 83899) return "ID";
  if (zipNum >= 84000 && zipNum <= 84799) return "UT";
  if (zipNum >= 85000 && zipNum <= 86599) return "AZ";
  if (zipNum >= 87000 && zipNum <= 88499) return "NM";
  if (zipNum >= 89000 && zipNum <= 89899) return "NV";
  if (zipNum >= 90000 && zipNum <= 96199) return "CA";
  if (zipNum >= 96700 && zipNum <= 96899) return "HI";
  if (zipNum >= 97000 && zipNum <= 97999) return "OR";
  if (zipNum >= 98000 && zipNum <= 99499) return "WA";
  if (zipNum >= 99500 && zipNum <= 99999) return "AK";

  return null;
}
