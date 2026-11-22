import { site } from "../config/site";

export function whatsappLink(message) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryLink(product, categoryName) {
  const msg =
    `Hello ${site.name}, I would like to enquire about *${product.name}* ` +
    `(${product.pack}) from the ${categoryName} range. ` +
    `Please share availability and details.`;
  return whatsappLink(msg);
}

export const generalEnquiryLink = () =>
  whatsappLink(`Hello ${site.name}, I would like to know more about your products.`);
