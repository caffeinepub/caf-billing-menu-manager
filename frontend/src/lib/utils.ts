import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatCurrencyBigInt(amount: bigint): string {
  return `₹${Number(amount).toFixed(2)}`;
}

export function formatDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  if (ts === 0) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  // ICP timestamps are in nanoseconds
  const ms = ts / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(timestamp: bigint | number): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  if (ts === 0) {
    const now = new Date();
    return now.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  const ms = ts / 1_000_000;
  return new Date(ms).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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

// Fixed category display order for the café menu
// These match the actual backend category names used in migration.mo
export const MENU_CATEGORY_ORDER = [
  'TEA',
  'COFFEE',
  'SANDWICH',
  'TOAST',
  'LIGHT SNACKS',
  'MOMOS',
  'BURGERS',
  'STARTERS',
  'REFRESHERS',
  'COMBO',
];

/**
 * Sort an array of category name strings in the canonical café menu order.
 * Categories not in the fixed list appear at the end in their original order.
 */
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

/**
 * Get a human-friendly display name for a backend category name.
 */
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    'TEA': 'Tea',
    'COFFEE': 'Coffee',
    'SANDWICH': 'Sandwich',
    'TOAST': 'Toast',
    'LIGHT SNACKS': 'Light Snacks',
    'MOMOS': 'Momos',
    'BURGERS': 'Burgers',
    'STARTERS': 'Starters',
    'REFRESHERS': 'Refreshers',
    'COMBO': 'Combo',
    // Legacy fallbacks
    'Tea (Non-Alcoholic Beverages)': 'Tea',
    'Coffee (Non-Alcoholic Beverages)': 'Coffee',
    'Momo': 'Momos',
    'Burger': 'Burgers',
    'Starter': 'Starters',
    'Refresher': 'Refreshers',
  };
  return displayNames[category] ?? category;
}
