import Image from "next/image";
import Link from "next/link";
import { formatPrice, stockState } from "@/lib/catalog";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const soldOut = stockState(product.stock) === "out";

  return (
    <article className="product-card bg-paper">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="media-product relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
          {(soldOut || product.badge) && (
            <span className="label-micro absolute left-3 top-3 bg-paper px-2 py-1">
              {soldOut ? "Sold out" : product.badge}
            </span>
          )}
        </div>
        <div className="px-3 pb-8 pt-4 sm:px-4">
          <p className="label-micro text-mute">{product.category}</p>
          <h3 className="product-name mt-1 font-sans">{product.name}</h3>
          <p className="product-price mt-1">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
