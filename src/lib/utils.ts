import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "PHP",
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "PHP", notation = "standard" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice);
}
export function generateBuyerId(): string {
  const prefix = "B-";
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNumber}`;
}

export function generateSellerId(): string {
  const prefix = "S-";
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNumber}`;
}

export function generateAdminId(): string {
  const prefix = "A-";
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNumber}`;
}

export function getConvexErrorMessage(error: Error): string {
  try {
    // If it's not a string, return default message
    if (typeof error.message !== 'string') {
      return "Something went wrong";
    }

    // If message contains ConvexError, extract it
    if (error.message.includes("ConvexError:")) {
      // Split the message by "ConvexError:"
      const parts = error.message.split("ConvexError:");

      if (parts.length < 2) return "Something went wrong";

      // Get the part after "ConvexError:"
      let errorMessage = parts[1].trim();

      // Remove everything after "at handler" if it exists
      const handlerIndex = errorMessage.indexOf(" at handler");
      if (handlerIndex !== -1) {
        errorMessage = errorMessage.substring(0, handlerIndex);
      }

      // Clean up any remaining artifacts
      return errorMessage.replace(/\s+/g, ' ').trim();
    }

    // If no ConvexError found, return the original message or default
    return error.message || "Something went wrong";
  } catch {
    // If any parsing fails, return default message
    return "Something went wrong";
  }
}

export function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount)
}

export const statusColors = {
  available: "bg-green-100 text-green-800 hover:bg-green-200",
  reserved: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  sold: "bg-blue-100 text-blue-800 hover:bg-blue-200",
}