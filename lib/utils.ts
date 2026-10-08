// ============================================================================
// Utility Functions for Bazar Dor (বাজার দর)
// Contains helper functions for Bengali number conversion, price formatting,
// unit localization, and dynamic Bengali date formatting.
// ============================================================================

// Mapping from English digits (0-9) to Bengali digits (০-৯)
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

// Bengali month names in order (0-indexed matching JavaScript Date.getMonth())
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

// Bengali weekday names
export const BANGLA_DAYS: string[] = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

/**
 * Converts English numbers/digits to Bengali numbers.
 * Example: 148 -> "১৪৮", 1850 -> "১,৮৫০"
 *
 * NOTE: Internal application calculations and sorting must always use numeric
 * values. We only call toBanglaNumber() when displaying text in the UI.
 */
export function toBanglaNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  
  const str = String(value);
  return str.replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
}

/**
 * Formats a numeric price into a user-friendly Bengali price string with "টাকা".
 * Example: 148 -> "১৪৮ টাকা"
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "০ টাকা";
  const numStr = toBanglaNumber(price);
  return `${numStr} টাকা`;
}

/**
 * Converts English unit keys into Bengali unit phrases.
 * Example:
 * "kg" -> "প্রতি কেজি"
 * "litre" -> "প্রতি লিটার"
 * "dozen" -> "প্রতি ডজন"
 * "piece" -> "প্রতি পিস"
 */
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

/**
 * Formats a percentage change with appropriate direction arrow and Bengali digits.
 * Example:
 * (2.1, "up") -> "▲ ২.১%"
 * (1.5, "down") -> "▼ ১.৫%"
 * (0.0, "flat") -> "— ০.০%"
 */
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

/**
 * Generates the formatted Bengali date for the given Date object (or current time).
 * Example: Date(2026-10-09) -> "৯ অক্টোবর ২০২৬" or "শুক্রবার, ৯ অক্টোবর ২০২৬"
 */
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
