import { asc, desc, eq, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, products, stock } from "@/db/schema";

/** Flattened product as the UI consumes it. */
export type Product = {
  slug: string;
  name: string;
  category: string;
  /** Price in cents. */
  price: number;
  image: string;
  badge?: string;
  sku: string;
  description: string;
  details: string[];
  /** Units available. 0 = sold out. */
  stock: number;
};

const columns = {
  slug: products.slug,
  name: products.name,
  category: categories.name,
  price: products.priceCents,
  image: products.imageUrl,
  badge: products.badge,
  sku: products.sku,
  description: products.description,
  details: products.details,
  stock: sql<number>`coalesce(${stock.quantity}, 0)`.mapWith(Number),
};

const base = () =>
  db
    .select(columns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stock, eq(stock.productId, products.id));

const toProduct = ({ badge, ...rest }: Awaited<ReturnType<typeof base>>[number]): Product => ({
  ...rest,
  ...(badge ? { badge } : {}),
});

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  const rows = await base().orderBy(asc(products.id));
  return rows.map(toProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((r) => r.slug);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheTag("products", `product:${slug}`);
  cacheLife("minutes");
  const [row] = await base().where(eq(products.slug, slug)).limit(1);
  return row ? toProduct(row) : undefined;
}

/** Same category first, then everything else. One query. */
export async function getRelatedProducts(slug: string, category: string, limit = 4): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  const rows = await base()
    .where(ne(products.slug, slug))
    .orderBy(desc(sql`(${categories.name} = ${category})`), asc(products.id))
    .limit(limit);
  return rows.map(toProduct);
}
