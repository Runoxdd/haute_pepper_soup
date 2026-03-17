import type { Db } from "mongodb";

/**
 * Generate a random order reference in the format "HP-XXXXX".
 *
 * XXXXX is a zero-padded 5-digit number (00000-99999), giving 100,000 possible
 * values. By the birthday problem, collisions begin appearing around ~400
 * orders — `ensureUniqueReference` handles this with a retry loop.
 */
export function generateReference(): string {
  const num = Math.floor(Math.random() * 100_000)
    .toString()
    .padStart(5, "0");
  return `HP-${num}`;
}

/**
 * Generate a unique order reference, retrying up to 3 times on collision.
 *
 * Checks the `orders` collection for an existing document with the same
 * reference. If all retries are exhausted, throws an error.
 *
 * @throws {Error} If a unique reference cannot be generated after 3 attempts.
 */
export async function ensureUniqueReference(db: Db): Promise<string> {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const reference = generateReference();
    const existing = await db
      .collection("orders")
      .findOne({ reference }, { projection: { _id: 1 } });

    if (!existing) {
      return reference;
    }
  }

  throw new Error(
    "Failed to generate a unique order reference after 3 attempts. " +
      "Consider migrating to a date-prefixed format (e.g. HP-0317-XXXX).",
  );
}
