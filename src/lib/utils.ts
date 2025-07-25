import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractInstrumentKey(instrument: Record<string, string> | undefined | null): string {
  if (!instrument || typeof instrument !== 'object') return 'default';

  const priorityKeys = [
    'bank',        // netbanking
    'issuer',      // cards
    'network',     // cards
    'psp',         // UPI
    'vpa_handle',  // UPI
    'flow',        // fallback
  ];

  for (const key of priorityKeys) {
    const val = instrument[key];
    if (val && typeof val === 'string') {
      return val.toLowerCase();
    }
  }

  return 'default';
}


