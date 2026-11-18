import { sql } from "drizzle-orm";
import { db } from "./index";
import { categories, products, stock } from "./schema";
import { seedCategories, seedProducts } from "./seed-data";

/**
 * Idempotent: safe to re-run. Upserts by slug, so edits to seed-data.ts
 * (name, price, stock...) overwrite the DB rows. neon-http has no
 * transactions, so statements run sequentially.
 */
async function main() {
  await db
    .insert(categories)
    .values(seedCategories)
    .onConflictDoUpdate({ target: categories.slug, set: { name: sql`excluded.name` } });

  const cats = await db.select().from(categories);
  const categoryId = new Map(cats.map((c) => [c.slug, c.id]));

  for (const { category, stock: quantity, ...p } of seedProducts) {
    const cid = categoryId.get(category);
    if (!cid) throw new Error(`Unknown category slug: ${category}`);

    const [row] = await db
      .insert(products)
      .values({ ...p, categoryId: cid })
      .onConflictDoUpdate({
        target: products.slug,
        set: { ...p, categoryId: cid, updatedAt: new Date() },
      })
      .returning({ id: products.id });

    await db
      .insert(stock)
      .values({ productId: row.id, quantity })
      .onConflictDoUpdate({
        target: stock.productId,
        set: { quantity, updatedAt: new Date() },
      });
  }

  console.log(`Seeded ${seedCategories.length} categories, ${seedProducts.length} products`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
