// Formats a number as a price, e.g. 49.5 → "$49.50"
// Change "en-US" / "USD" to your own locale and currency.
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}
