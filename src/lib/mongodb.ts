import { MongoClient, type Db } from "mongodb";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI ?? "";

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { clientPromise };

/**
 * Returns the default database from the connection string.
 *
 * Usage:
 * ```ts
 * const db = await getDb();
 * const items = await db.collection("menu_items").find().toArray();
 * ```
 */
export async function getDb(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  const client = await clientPromise;
  return client.db();
}