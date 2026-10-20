// Shop contact details shown in the "Get in touch" section of the home page.
// Edit these values, then commit and push to update the live site.
export const SHOP = {
  name: "Rutu Fashion",
  phones: ["9913754991", "8000192279"],
  email: "admin@rutufashion.com",
  // Typed address shown under "Visit us"
  address: "Shop 1048, Underground, Tirupati Market, Ring Road, Surat - 395002",
};

// "9913754991" → "+91 99137 54991" (display) and "+919913754991" (tel: link)
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function telHref(phone: string) {
  return `tel:+91${phone.replace(/\D/g, "").slice(-10)}`;
}
