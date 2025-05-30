import { format as formatDateFns, parseISO } from "date-fns";

/**
 * Formats a date string or Date object into a more readable format.
 * @param {string | Date} dateInput - The date to format.
 * @param {string} formatString - The date-fns format string (e.g., 'PPpp', 'MMMM d, yyyy').
 * @returns {string} The formatted date string, or "Invalid Date" if input is invalid.
 */
export const formatDate = (dateInput, formatString = "PP") => {
  // PP is like 'MMM d, yyyy'
  try {
    const date =
      typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      // Check if date is valid
      return "Invalid Date";
    }
    return formatDateFns(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Formats a number as a currency string (example: USD).
 * Adjust locale and options as needed for other currencies (e.g., INR).
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency code (e.g., 'USD', 'INR').
 * @param {string} locale - The locale string (e.g., 'en-US', 'en-IN').
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length and adds an ellipsis.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum length before truncating.
 * @returns {string} The truncated string.
 */
export const truncateText = (str, maxLength = 100) => {
  if (!str || typeof str !== "string" || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};
