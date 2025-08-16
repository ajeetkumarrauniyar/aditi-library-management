/**
 * Generates a random 6-digit verification code
 * @returns {string} A 6-digit numeric string
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates verification code expiration date
 * @param {number} minutes - Number of minutes from now (default: 15)
 * @returns {Date} Expiration date
 */
export function generateVerificationCodeExpiry(minutes: number = 15): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Checks if verification code is expired
 * @param {Date | null} expiryDate - The expiry date to check
 * @returns {boolean} True if expired, false otherwise
 */
export function isVerificationCodeExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() > expiryDate;
}
