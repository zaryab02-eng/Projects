// Aadhaar number helpers. Stored as 12 digits only; shown as "1234 5678 9012".
export const cleanAadhaar = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 12);

export const formatAadhaar = (value) =>
  cleanAadhaar(value).replace(/(\d{4})(?=\d)/g, "$1 ");

/** Optional field: empty is fine, otherwise it must be exactly 12 digits. */
export const isValidAadhaar = (value) => {
  const digits = cleanAadhaar(value);
  return digits === "" || digits.length === 12;
};
