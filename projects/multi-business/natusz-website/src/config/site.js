// ─────────────────────────────────────────────────────────────
//  COMPANY DETAILS: change contact info, address and links here.
//  Everything on the site (navbar, footer, contact page, WhatsApp
//  buttons) reads from this one file.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "Natusz Healthcare",
  legalName: "Natusz Healthcare Pvt Ltd",
  tagline: "Skin care, practised with care.",

  // WhatsApp number: country code + number, digits only (no + or spaces)
  whatsappNumber: "919278450890",
  phoneDisplay: "+91 92784 50890",
  phoneTel: "+919278450890",
  email: "natuszhealthcarellp@gmail.com",

  address: {
    lines: [
      "Matru Chhaya Bangla, Block Sector, Moti Nagar,",
      "Manpada Road, Dombivli East,",
      "Thane, Maharashtra 421204",
    ],
    short: "Dombivli East, Thane",
  },
  // Used for the Google Map on the Contact page
  mapQuery: "Manpada Road, Dombivli East, Thane, Maharashtra 421204",

  // Leave a link as "" to hide that icon in the footer
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
};
