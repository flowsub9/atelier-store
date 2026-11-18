export type Collection = {
  slug: string;
  title: string;
  image: string;
};

/** Unsplash photo id -> optimizable URL (host allowed in next.config.ts). */
export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}`;

export const hero = {
  eyebrow: "Autumn / Winter",
  title: "The Evening Edit",
  image: unsplash("1566174053879-31528523f8ae", 2400),
  alt: "Woman in a deep plum off-shoulder dress against a violet backdrop",
};

export const collections: Collection[] = [
  { slug: "women", title: "Women", image: unsplash("1483985988355-763728e1935b", 1000) },
  { slug: "men", title: "Men", image: unsplash("1594938298603-c8148c4dae35", 1000) },
  { slug: "shoes", title: "Shoes", image: unsplash("1543163521-1bf539c55dd2", 1000) },
  { slug: "accessories", title: "Accessories", image: unsplash("1524592094714-0f0654e20314", 1000) },
];

/** Takes cents. Whole-dollar prices render without decimals. */
export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

export type StockState = "in" | "low" | "out";
export const stockState = (n: number): StockState => (n <= 0 ? "out" : n <= 5 ? "low" : "in");
