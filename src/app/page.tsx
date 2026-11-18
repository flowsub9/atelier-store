import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { collections, hero, unsplash } from "@/lib/catalog";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <main className="flex-1">
        {/* Hero: full-bleed editorial image, text anchored bottom-left */}
        <section className="relative h-[80svh] min-h-[30rem] w-full overflow-hidden bg-wash md:h-[calc(100svh-6.5rem)]">
          <Image
            src={hero.image}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_20%]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          <div className="container-page absolute inset-x-0 bottom-0 pb-10 text-paper md:pb-16">
            <p className="label">{hero.eyebrow}</p>
            <h1 className="display-lg mt-3 max-w-[14ch]">{hero.title}</h1>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#" className="btn btn-light">
                Shop women
              </a>
              <a href="#" className="btn btn-light">
                Shop men
              </a>
            </div>
          </div>
        </section>

        {/* Featured collections */}
        <section className="section">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between md:mb-12">
              <h2 className="display-md">Featured collections</h2>
              <a href="#" className="label link-underline hidden sm:inline-block">
                Explore all
              </a>
            </div>
            <div className="grid grid-cols-2 gap-[2px] lg:grid-cols-4">
              {collections.map((c, i) => (
                <a key={c.slug} href="#" className="product-card block">
                  <div className="media-product relative aspect-3/4!">
                    <Image
                      src={c.image}
                      alt={`${c.title} collection`}
                      fill
                      priority={i < 2}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                  </div>
                  <p className="label link-underline mt-4">{c.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial split */}
        <section className="split">
          <div className="relative aspect-4/5 overflow-hidden bg-wash md:aspect-auto md:min-h-176">
            <Image
              src={unsplash("1558769132-cb1aea458c5e", 1600)}
              alt="Knitwear and neutral garments on a rail"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 bg-wash px-gutter py-section md:px-16 lg:px-24">
            <p className="label text-mute">The Craft</p>
            <h2 className="display-md">Quiet materials, made to last</h2>
            <p className="max-w-md text-ink-soft">
              Soft wools, fine knits and considered tailoring. A wardrobe built on texture and
              proportion rather than noise.
            </p>
            <div>
              <a href="#" className="btn btn-secondary">
                Discover
              </a>
            </div>
          </div>
        </section>

        {/* Product focus */}
        <section className="section">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between md:mb-12">
              <div>
                <p className="label text-mute">Just arrived</p>
                <h2 className="display-md mt-2">New arrivals</h2>
              </div>
              <a href="#" className="label link-underline">
                View all
              </a>
            </div>
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>

        {/* Full-bleed closing banner */}
        <section className="relative h-[60svh] min-h-96 overflow-hidden bg-wash">
          <Image
            src={unsplash("1520975916090-3105956dac38", 2400)}
            alt="Man in a black leather jacket seated against a brick wall"
            fill
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="container-page absolute inset-0 flex flex-col items-start justify-end pb-10 text-paper md:pb-16">
            <p className="label">Outerwear</p>
            <h2 className="display-md mt-3 max-w-[16ch]">Built for the city after dark</h2>
            <a href="#" className="btn btn-light mt-8">
              Shop outerwear
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
