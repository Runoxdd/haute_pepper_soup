import { MongoClient, type Db } from "mongodb";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  // Return a deferred-rejection promise so the module can be safely imported
  // even when MONGODB_URI is not set (mock mode). The error is only thrown
  // when the promise is actually awaited (i.e. when a DB query is attempted).
  if (!uri) {
    return new Promise((_, reject) =>
      reject(new Error("MONGODB_URI environment variable is not set"))
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      globalThis._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return globalThis._mongoClientPromise;
  }

  return new MongoClient(uri, options).connect();
}

// Exported as a lazy promise — safe to import without MONGODB_URI set.
// It only rejects when awaited, not at module-load time.
export const clientPromise: Promise<MongoClient> = getClientPromise();

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}