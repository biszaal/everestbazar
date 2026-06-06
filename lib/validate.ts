/* EverestBazar — input validators (Nepal-specific). */

/** Accepts +977 followed by a 10-digit mobile starting with 9. */
export function isValidNepaliPhone(phone: string): boolean {
  return /^\+977\s?9\d{9}$/.test(phone.replace(/\s/g, ""));
}

/** True if `digits` is a valid 10-digit Nepali mobile (no country code). */
export function isValidMobileDigits(digits: string): boolean {
  return /^9\d{9}$/.test(digits.replace(/\D/g, ""));
}

/** Loose format check for a Nepal Citizenship / National ID number. */
export function isValidNIDNumber(nid: string): boolean {
  const cleaned = nid.replace(/[\s-]/g, "");
  return /^\d{7,16}$/.test(cleaned);
}
