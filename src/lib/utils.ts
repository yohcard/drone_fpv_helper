import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Fusionne les classes Tailwind de manière intelligente */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
