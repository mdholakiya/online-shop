// Formats a number as Indian Rupees, e.g. 1499 → "₹1,499", 1499.5 → "₹1,499.50"
const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}
