/**
 * Format a number as Nigerian Naira using the ₦ symbol directly.
 *
 * Uses `₦` (U+20A6) instead of `Intl.NumberFormat` to avoid inconsistent
 * "NGN" vs "₦" rendering across browsers (Chrome, Samsung Internet, Opera Mini).
 *
 * @example formatNGN(5000)  → "₦5,000"
 * @example formatNGN(15000) → "₦15,000"
 * @example formatNGN(0)     → "₦0"
 */
export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

/**
 * Format a Date as a human-readable relative time string.
 *
 * @example formatDate(new Date(Date.now() - 30_000))       → "Just now"
 * @example formatDate(new Date(Date.now() - 2 * 3600_000)) → "2 hours ago"
 * @example formatDate(new Date(Date.now() - 86400_000))     → "Yesterday"
 */
export function formatDate(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();

  // Guard against future dates (clock skew, etc.)
  if (diffMs < 0) {
    return "Just now";
  }

  const seconds = Math.floor(diffMs / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes === 1) {
    return "1 minute ago";
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  if (hours === 1) {
    return "1 hour ago";
  }
  if (hours < 24) {
    return `${hours} hours ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return `${days} days ago`;
  }

  if (weeks === 1) {
    return "1 week ago";
  }
  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }

  if (months === 1) {
    return "1 month ago";
  }
  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(months / 12);
  if (years === 1) {
    return "1 year ago";
  }
  return `${years} years ago`;
}
