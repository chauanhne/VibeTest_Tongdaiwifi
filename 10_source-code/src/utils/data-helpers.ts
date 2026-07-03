/**
 * Data helpers — parsers/formatters cho test data (vi-VN, en-US, etc.)
 */

/**
 * Parse vi-VN number format: "1.234,56" → 1234.56
 */
export function parseViVNNumber(str: string): number {
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

/**
 * Format number to vi-VN: 1234.56 → "1.234,56"
 */
export function formatViVNNumber(num: number, decimals = 0): string {
  return num.toLocaleString('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Parse ISO date string.
 */
export function parseISODate(str: string): Date {
  return new Date(str);
}

/**
 * Tolerance comparison cho float values.
 */
export function approxEqual(actual: number, expected: number, tolerance = 0.01): boolean {
  return Math.abs(actual - expected) <= tolerance;
}
