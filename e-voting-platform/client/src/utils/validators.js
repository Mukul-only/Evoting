/**
 * Checks if a value is a valid email address.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a password meets minimum length requirements.
 * @param {string} password - The password to validate.
 * @param {number} minLength - The minimum required length.
 * @returns {boolean} True if valid, false otherwise.
 */
export const isValidPassword = (password, minLength = 6) => {
  if (!password || typeof password !== "string") return false;
  return password.length >= minLength;
};

/**
 * Checks if a value is empty (null, undefined, or empty string after trimming).
 * @param {*} value - The value to check.
 * @returns {boolean} True if empty, false otherwise.
 */
export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
};

/**
 * Validates an Aadhaar ID (must be 12 digits).
 * @param {string} aadhaarId
 * @returns {boolean}
 */
export const isValidAadhaar = (aadhaarId) => {
  if (!aadhaarId || typeof aadhaarId !== "string") return false;
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaarId);
};

// Add more validators as needed (e.g., for phone numbers, specific formats)
