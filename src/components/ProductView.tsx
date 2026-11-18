"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { formatPrice, stockState } from "@/lib/catalog";
import type { Product } from "@/lib/products";

const large = (url: string) => url.replace(/w=\d+/, "w=1800");

/** Three views: full shot plus two close crops of the same photo. */
const views = [
  { label: "Front", className: "object-cover", wide: true },
  { label: "Detail", className: "object-cover scale-[1.7] object-[28%_72%]", wide: false },
  { label: "Close-up", className: "object-cover scale-[1.7] object-[72%_30%]", wide: false },
];

const stockCopy = {
  in: { dot: "bg-ok", text: "In stock" },
  low: { dot: "bg-warn", text: "Low stock" },
  out: { dot: "bg-mute", text: "Sold out" },
} as const;

export function ProductView({ product }: { product: Product }) {
  const [slide, setSlide] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const state = stockState(product.stock);
  const heroImage = large(product.image);

  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setSlide(Math.round(el.scrollLeft / el.clientWidth));
    }
  };

  return (
    <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-12 lg:gap-20">
      {/* ---- Gallery: swipe slider on mobile, large 2-up grid on desktop ---- */}
      <div className="-mx-(--spacing-gutter) md:mx-0">
        <div
          ref={galleryRef}
          onScroll={onGalleryScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-[2px] md:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {views.map((view) => (
            <div
              key={view.label}
              className={`media-product relative aspect-4/5! shrink-0 basis-full snap-center md:basis-auto ${
                view.wide ? "md:col-span-2 md:aspect-5/4!" : ""
              }`}
            >
              <Image
                src={heroImage}
                alt={`${product.name} — ${view.label.toLowerCase()}`}
                fill
                priority
                sizes={view.wide ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 30vw, 100vw"}
                className={view.className}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden="true">
          {views.map((v, i) => (
            <span
              key={v.label}
              className={`size-1.5 rounded-full border border-ink ${i === slide ? "bg-ink" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* ---- Info panel ---- */}
      <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
        <p className="label-micro text-mute">{product.category}</p>
        <h1 className="display-md mt-2">{product.name}</h1>
        <p className="mt-4 text-lg">{formatPrice(product.price)}</p>

        <p className="mt-6 max-w-md text-ink-soft">{product.description}</p>

        {/* Stock state */}
        <p className="mt-8 flex items-center gap-2 text-sm" role="status">
          <span className={`size-2 rounded-full ${stockCopy[state].dot}`} />
          {state === "low" ? `Only ${product.stock} left` : stockCopy[state].text}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {state === "out" ? (
            <>
              <button type="button" disabled className="btn btn-primary btn-block">
                Sold out
              </button>
              <button type="button" className="btn btn-secondary btn-block">
                Notify me when available
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary btn-block">
              Add to bag
            </button>
          )}
        </div>

        <p className="label-micro mt-4 text-mute">SKU {product.sku}</p>

        {/* Accordions */}
        <div className="hairline-t mt-10">
          {[
            { title: "Details", body: product.details },
            {
              title: "Shipping & returns",
              body: ["Complimentary shipping on every order", "Free returns within 30 days"],
            },
          ].map((item, idx) => (
            <details key={item.title} open={idx === 0} className="hairline-b group py-5">
              <summary className="label flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
                {item.title}
                <span className="text-lg leading-none group-open:hidden">+</span>
                <span className="hidden text-lg leading-none group-open:inline">−</span>
              </summary>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
                {item.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
