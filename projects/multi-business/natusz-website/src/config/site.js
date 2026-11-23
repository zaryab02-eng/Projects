// ─────────────────────────────────────────────────────────────
//  COMPANY DETAILS: change contact info, address and links here.
//  Everything on the site (navbar, footer, contact page, WhatsApp
//  buttons, page titles) reads from this one file.
// ─────────────────────────────────────────────────────────────
export const site = {
  // If you connect a custom domain later, change this AND the links in
  // index.html (JSON-LD) and public/robots.txt.
  url: "https://natusz.pages.dev",

  name: "Neu Natusz Healthcare Pvt Ltd",
  legalName: "Neu Natusz Healthcare Private Limited",
  legalNameShort: "Neu Natusz Healthcare Pvt Ltd",
  tagline: "Skin care, practised with care.",

  hours: "10:00 AM – 6:00 PM",

  // WhatsApp number: country code + number, digits only (no + or spaces)
  whatsappNumber: "919278450890",
  phoneDisplay: "+91 92784 50890",
  phoneTel: "+919278450890",
  email: "natuszhealthcarellp@gmail.com",

  address: {
    lines: [
      "Matru Chhaya Bangla, Block Sector, Moti Nagar,",
      "Manpada Road, Dombivli,",
      "Thane, Maharashtra 421203",
    ],
    short: "Dombivli, Thane",
  },
  // Used for the Google Map on the Contact page
  mapQuery: "Manpada Road, Dombivli, Thane, Maharashtra 421203",

  // Leave a link as "" to hide that icon in the footer
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
};
