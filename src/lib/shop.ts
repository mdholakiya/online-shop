// Shop contact details shown in the "Get in touch" section of the home page.
// Edit these values, then commit and push to update the live site.
export const SHOP = {
  name: "Rutu Fashion",
  phones: ["9913754991", "8000192279"],
  email: "admin@rutufashion.com",
  // Typed address shown under "Visit us"
  address: "Rameshwar Society, 65, Industrial Area, Singanpor, Surat, Gujarat 395004, India",
  // Map pin: 21°11'32.0"N 72°50'28.9"E (decimal: 21.192222, 72.841361)
  location: {
    label: `21°11'32.0"N 72°50'28.9"E`,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=21.192222,72.841361",
  },
};

// "9913754991" → "+91 99137 54991" (display) and "+919913754991" (tel: link)
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function telHref(phone: string) {
  return `tel:+91${phone.replace(/\D/g, "").slice(-10)}`;
}
