import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, transactionType?: string) {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  })

  const formattedPrice = formatter.format(price)

  if (transactionType === "Rent" || transactionType === "Lease") {
    return `${formattedPrice}/month`
  }

  return formattedPrice
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

export const formatPriceInput = (value: string): string => {
  // Remove non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, "")

  // Convert to number and format with commas
  if (numericValue) {
    const number = Number.parseInt(numericValue, 10)
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(number)
  }

  return ""
}

export const parsePriceInput = (formattedValue: string): number => {
  // Remove currency symbol, commas, and other non-numeric characters
  const numericValue = formattedValue.replace(/[^0-9]/g, "")
  return numericValue ? Number.parseInt(numericValue, 10) : 0
}

export function formattedAmortization(amort: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amort)
}

export  const scrollToSection = (id: string) => {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" , block: "start"});
  }
};


export function formatDateListed(convexDate: number) {
  const roundedTimestamp = Math.floor(convexDate);
  const readableDate = new Date(roundedTimestamp);
  const now = new Date();
  const diffInSeconds = (now.getTime() - readableDate.getTime()) / 1000;

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'yesterday';

  return readableDate.toDateString();
}