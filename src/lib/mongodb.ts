import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

const uri = process.env.MONGODB_URI;
const options = {};

// ---------------------------------------------------------------------------
// Cached connection for serverless environments
// ---------------------------------------------------------------------------
// In development, we store the client promise on `globalThis` so that HMR
// (hot-module reloading) does not exhaust the MongoDB connection pool.
// In production, a module-level variable is sufficient because the module is
// evaluated only once per cold start.
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

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
  const client = await clientPromise;
  return client.db();
}
