import { MongoClient, type Db } from "mongodb";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      globalThis._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return globalThis._mongoClientPromise;
  }

  return new MongoClient(uri, options).connect();
}

export const clientPromise: Promise<MongoClient> = getClientPromise();

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}