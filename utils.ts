import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateDaysSince(date: string | Date): number {
  const diffTime = Math.abs(Date.now() - new Date(date).getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
