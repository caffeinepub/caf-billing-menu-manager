import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num / 100);
}

// Alias kept for any remaining usages
export const formatCurrencyBigInt = formatCurrency;

export function formatDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (ts === 0) {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  const ms = ts / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(timestamp: bigint | number): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (ts === 0) {
    return new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const ms = ts / 1_000_000;
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dateToNanoseconds(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Category order matches the exact backend category names (mixed case)
export const MENU_CATEGORY_ORDER = [
  "Tea",
  "Coffee",
  "Sandwich",
  "Toast",
  "Light Snacks",
  "Momos",
  "Burgers",
  "Starters",
  "Refreshers",
  "Beverages",
  "Combo",
  // Legacy uppercase fallbacks
  "TEA",
  "COFFEE",
  "SANDWICH",
  "TOAST",
  "LIGHT SNACKS",
  "MOMOS",
  "BURGERS",
  "STARTERS",
  "REFRESHERS",
  "BEVERAGES",
  "COMBO",
];

export function sortMenuCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ai = MENU_CATEGORY_ORDER.indexOf(a);
    const bi = MENU_CATEGORY_ORDER.indexOf(b);
    const aIdx = ai === -1 ? MENU_CATEGORY_ORDER.length : ai;
    const bIdx = bi === -1 ? MENU_CATEGORY_ORDER.length : bi;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.localeCompare(b);
  });
}

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  // Mixed case (actual backend values)
  Tea: "Tea",
  Coffee: "Coffee",
  Sandwich: "Sandwich",
  Toast: "Toast",
  "Light Snacks": "Light Snacks",
  Momos: "Momos",
  Burgers: "Burgers",
  Starters: "Starters",
  Refreshers: "Refreshers",
  Beverages: "Beverages",
  Combo: "Combo",
  // Legacy uppercase fallbacks
  TEA: "Tea",
  COFFEE: "Coffee",
  SANDWICH: "Sandwich",
  TOAST: "Toast",
  "LIGHT SNACKS": "Light Snacks",
  MOMOS: "Momos",
  BURGERS: "Burgers",
  STARTERS: "Starters",
  REFRESHERS: "Refreshers",
  BEVERAGES: "Beverages",
  COMBO: "Combo",
  // Other legacy fallbacks
  "Tea (Non-Alcoholic Beverages)": "Tea",
  "Coffee (Non-Alcoholic Beverages)": "Coffee",
  Momo: "Momos",
  Burger: "Burgers",
  Starter: "Starters",
  Refresher: "Refreshers",
};

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_DISPLAY_MAP[category] ?? category;
}
