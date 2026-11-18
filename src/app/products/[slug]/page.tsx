import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/lib/products";

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} — Atelier`, description: product.description };
}

/** Static shell: `params` is URL data, so it resolves behind Suspense. */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <main className="flex-1">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </main>
  );
}

async function ProductContent({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug, product.category, 4);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page label-micro py-6 text-mute">
        <Link href="/" className="link">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductView key={product.slug} product={product} />

      <section className="section">
        <div className="container-page">
          <h2 className="display-md mb-8 md:mb-12">You may also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div aria-busy="true" className="container-page grid grid-cols-[minmax(0,1fr)] gap-8 py-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-12 lg:gap-20">
      <div className="aspect-4/5 bg-wash md:aspect-5/4" />
      <div className="flex flex-col gap-4">
        <div className="h-3 w-24 bg-wash" />
        <div className="h-10 w-3/4 bg-wash" />
        <div className="h-5 w-20 bg-wash" />
        <div className="mt-6 h-24 bg-wash" />
        <div className="h-12 bg-wash" />
      </div>
    </div>
  );
}
