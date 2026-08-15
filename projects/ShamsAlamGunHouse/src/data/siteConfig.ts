/**
 * Single source of truth for business identity, contact details and
 * external links. Update this file first when re-branding or launching
 * for a real client — most components read from here rather than
 * hard-coding text.
 */

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919415281681";

export const siteConfig = {
  shopName: "Sham's Alam Gun House",
  legalName: "Sham's Alam Gun House - Licensed Gunsmiths",
  establishedYear: 1958,
  tagline: "Licensed Gun Repair & Restoration",
  heroSubline:
    "Four generations of hand craftsmanship, built on trust, precision, and an unbroken respect for the tools we are entrusted with.",

  license: {
    label: "Licensed under the Arms Act, 1959",
    number: "FAL-DL-000000", // Replace with the real firearms dealer licence number
  },

  contact: {
    phoneDisplay: "094152 81681",
    phoneHref: "tel:+919415281681",
    email: "info@shamsalamgunhouse.example.in", // Replace with the real business email
    whatsappNumber,
    whatsappHref: (message: string) =>
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    address: {
      line1: "Kotwali Road",
      line2: "Miyan Bazar",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      pincode: "273005",
      country: "India",
    },
    hours: [
      { day: "Wed – Mon", time: "10:00 AM – 7:00 PM" },
      { day: "Tuesday", time: "Closed" },
    ],
  },

  links: {
    googleReviews:
      import.meta.env.VITE_GOOGLE_REVIEWS_URL ||
      "https://g.page/r/example-review-link",
    googleMapsEmbed:
      import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
      "https://www.google.com/maps?q=Kotwali+Road,+Miyan+Bazar,+Gorakhpur,+Uttar+Pradesh+273005&output=embed",
    instagram: "https://instagram.com/shamsalamgunhouse.example",
    facebook: "https://facebook.com/shamsalamgunhouse.example",
  },

  legalDisclaimer:
    "Sham's Alam Gun House is a licensed firearms dealer and repair workshop operating in strict compliance with the Arms Act, 1959 and the Arms Rules, 2016. We service and restore licensed firearms for licence holders only. We do not sell, manufacture, or deal in firearms or live ammunition. All accessories sold are legal for civilian purchase in India.",
};
