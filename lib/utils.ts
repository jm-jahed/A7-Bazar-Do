// Helper utility functions for formatting numbers, prices, units, and dates

// Mapping from English digits to Bengali digits
const BANGLA_DIGITS: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

// Bengali month names
export const BANGLA_MONTHS: string[] = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

// Bengali day names
export const BANGLA_DAYS: string[] = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

// Converts English numbers to Bengali digits
export function toBanglaNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  
  const str = String(value);
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
}

// Formats number into price string with Taka (e.g. "১৪৮ টাকা")
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "০ টাকা";
  const numStr = toBanglaNumber(price);
  return `${numStr} টাকা`;
}

// Converts English unit into Bengali (e.g. "kg" -> "প্রতি কেজি")
export function formatUnitBn(unit: string | null | undefined): string {
  if (!unit) return "";
  const normalized = unit.toLowerCase().trim();

  switch (normalized) {
    case "kg":
      return "প্রতি কেজি";
    case "litre":
    case "liter":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
    case "pc":
      return "প্রতি পিস";
    default:
      return `প্রতি ${unit}`;
  }
}

// Formats percentage change with arrow
export function formatPriceChange(pct: number, dir: "up" | "down" | "flat" = "flat"): string {
  const absPct = Math.abs(pct);
  const banglaPct = toBanglaNumber(absPct.toFixed(1));
  
  if (dir === "up") {
    return `▲ ${banglaPct}%`;
  }
  if (dir === "down") {
    return `▼ ${banglaPct}%`;
  }
  return `— ${banglaPct}%`;
}

// Formats a date into Bengali text
export function getBanglaDate(dateInput?: Date, includeDayName = false): string {
  const date = dateInput || new Date();
  const day = toBanglaNumber(date.getDate());
  const month = BANGLA_MONTHS[date.getMonth()];
  const year = toBanglaNumber(date.getFullYear());
  const dayName = BANGLA_DAYS[date.getDay()];

  if (includeDayName) {
    return `${dayName}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}
