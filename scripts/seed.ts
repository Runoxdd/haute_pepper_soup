/**
 * Development seed script for Haute Pepper Soup.
 *
 * Inserts 3 sample Nigerian pepper soup dishes into the menu_items collection.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Prerequisites:
 *   - MONGODB_URI environment variable must be set (or .env file in project root)
 *   - MongoDB Atlas cluster must be accessible
 *
 * This script is idempotent — it checks for existing items by name before inserting.
 */

import { MongoClient } from "mongodb";

// Load .env if available (for local development)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "ERROR: MONGODB_URI environment variable is not set.\n" +
      "Set it in your .env file or export it before running this script.\n\n" +
      "Example:\n" +
      '  MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/haute-pepper-soup" npx tsx scripts/seed.ts'
  );
  process.exit(1);
}

const SEED_ITEMS = [
  {
    name: "Goat Pepper Soup",
    description:
      "Tender goat meat simmered in a rich, aromatic pepper soup broth with traditional Nigerian spices. A bold, hearty classic.",
    price: 5000,
    image_url:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80",
    category: "Pepper Soup",
    available_sides: ["Boiled Yam", "Fried Plantain", "White Rice", "None"],
    is_active: true,
  },
  {
    name: "Catfish Pepper Soup",
    description:
      "Fresh catfish cooked in a fragrant, spicy pepper soup base with uziza and scent leaves. Light yet deeply flavourful.",
    price: 4500,
    image_url:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    category: "Pepper Soup",
    available_sides: ["Boiled Yam", "Fried Plantain", "White Rice", "None"],
    is_active: true,
  },
  {
    name: "Chicken Pepper Soup",
    description:
      "Succulent chicken pieces in a warm, peppery broth infused with ginger, garlic, and West African spices. Comforting and nourishing.",
    price: 4000,
    image_url:
      "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&q=80",
    category: "Pepper Soup",
    available_sides: ["Boiled Yam", "Fried Plantain", "White Rice", "None"],
    is_active: true,
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    console.log("Connected successfully.");

    const db = client.db();
    const collection = db.collection("menu_items");

    const now = new Date();
    let inserted = 0;
    let skipped = 0;

    for (const item of SEED_ITEMS) {
      // Check if this dish already exists (by name) to make the script idempotent
      const existing = await collection.findOne({ name: item.name });
      if (existing) {
        console.log(`  Skipping "${item.name}" — already exists.`);
        skipped++;
        continue;
      }

      await collection.insertOne({
        ...item,
        created_at: now,
        updated_at: now,
      });
      console.log(
        `  Inserted "${item.name}" — ₦${item.price.toLocaleString()}`
      );
      inserted++;
    }

    // Create indexes for performance
    console.log("\nEnsuring indexes...");
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ is_active: 1 });
    console.log("  Indexes created on menu_items.");

    // Also ensure order indexes exist
    const ordersCollection = db.collection("orders");
    await ordersCollection.createIndex({ reference: 1 }, { unique: true });
    await ordersCollection.createIndex({ user_id: 1, created_at: -1 });
    await ordersCollection.createIndex({ status: 1 });
    await ordersCollection.createIndex({ notification_status: 1 });
    await ordersCollection.createIndex({ created_at: -1 });
    console.log("  Indexes created on orders.");

    console.log(
      `\nSeed complete: ${inserted} inserted, ${skipped} skipped.`
    );
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
