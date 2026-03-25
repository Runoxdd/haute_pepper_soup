/**
 * Check whether the given email belongs to an admin.
 *
 * Matches against the comma-separated `ADMIN_EMAILS` environment variable.
 * Comparison is case-insensitive and whitespace-trimmed so that
 * `" Owner@Gmail.COM "` matches `"owner@gmail.com"`.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  const rawAdminEmails = process.env.ADMIN_EMAILS ?? "";
  const adminEmails = rawAdminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  console.log(`[isAdmin] Checking ${email}. Admin list: [${adminEmails.join(", ")}]`);

  return adminEmails.includes(email.trim().toLowerCase());
}
