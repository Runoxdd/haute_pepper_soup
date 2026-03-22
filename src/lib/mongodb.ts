import { MongoClient, type Db } from "mongodb";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");
  const client = new MongoClient(uri, options);
  return client.connect();
}

export const clientPromise: Promise<MongoClient> = new Proxy(
  {} as Promise<MongoClient>,
  {
    get(_, prop) {
      const promise =
        process.env.NODE_ENV === "development"
          ? (globalThis._mongoClientPromise ??= createClientPromise())
          : createClientPromise();
      return (promise as unknown as Record<string | symbol, unknown>)[prop];
    },
  }
);

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  const promise =
    process.env.NODE_ENV === "development"
      ? (globalThis._mongoClientPromise ??= createClientPromise())
      : createClientPromise();

  const client = await promise;
  return client.db();
}