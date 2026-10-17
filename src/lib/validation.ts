// Shared form rules, used in the browser AND again on the server.

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

export type ProductInput = {
  name: string;
  description: string;
  price: string;
  quantity: string;
  phone: string;
  email: string;
  address: string;
};

export type FieldErrors = Partial<Record<keyof ProductInput | "image", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;

// Returns an object of error messages (empty object = all good)
export function validateProduct(input: ProductInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.name.trim()) errors.name = "Name is required.";
  else if (input.name.trim().length > 120) errors.name = "Max 120 characters.";

  if (!input.description.trim()) errors.description = "Description is required.";
  else if (input.description.length > 2000)
    errors.description = "Max 2000 characters.";

  const price = Number(input.price);
  if (input.price.trim() === "" || Number.isNaN(price) || price < 0)
    errors.price = "Enter a price of 0 or more.";
  else if (!/^\d+(\.\d{1,2})?$/.test(input.price.trim()))
    errors.price = "Use up to 2 decimals, e.g. 49.99";

  if (!/^\d+$/.test(input.quantity.trim()))
    errors.quantity = "Enter a whole number (0 or more).";

  if (!PHONE_RE.test(input.phone.trim()))
    errors.phone = "Enter a valid phone number.";

  if (!EMAIL_RE.test(input.email.trim()))
    errors.email = "Enter a valid email address.";

  if (!input.address.trim()) errors.address = "Address is required.";

  return errors;
}

// Checks the chosen image file (browser only)
export function validateImage(file: File | null): string | undefined {
  if (!file || file.size === 0) return "Please choose an image.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return "Image must be JPG, PNG, WEBP, AVIF or GIF.";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 2 MB or smaller.";
  return undefined;
}
