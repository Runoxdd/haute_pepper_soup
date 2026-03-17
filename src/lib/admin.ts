/**
 * Check whether the given email belongs to an admin.
 *
 * Matches against the comma-separated `ADMIN_EMAILS` environment variable.
 * Comparison is case-insensitive and whitespace-trimmed so that
 * `" Owner@Gmail.COM "` matches `"owner@gmail.com"`.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.trim().toLowerCase());
}
