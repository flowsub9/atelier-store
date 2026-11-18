import Link from "next/link";

const nav = ["Women", "Men", "Shoes", "Accessories", "Gifts"];

export function SiteHeader() {
  return (
    <>
      <div className="bg-ink px-gutter py-2 text-center text-paper">
        <p className="label-micro">Complimentary shipping &amp; returns on every order</p>
      </div>

      <header className="site-header">
        <div className="container-page grid h-full grid-cols-3 items-center">
          {/* left: desktop nav / mobile menu (CSS-only via <details>) */}
          <div>
            <nav aria-label="Primary" className="hidden gap-8 md:flex">
              {nav.map((item) => (
                <a key={item} href="#" className="label link">
                  {item}
                </a>
              ))}
            </nav>

            <details className="md:hidden">
              <summary className="label cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <nav
                aria-label="Mobile"
                className="hairline-b absolute inset-x-0 top-full flex flex-col gap-5 bg-paper px-gutter py-8"
              >
                {nav.map((item) => (
                  <a key={item} href="#" className="display-sm">
                    {item}
                  </a>
                ))}
              </nav>
            </details>
          </div>

          {/* center: wordmark */}
          <Link href="/" className="text-center font-display text-xl uppercase tracking-[0.35em] sm:text-2xl">Atelier</Link>

          {/* right: utilities */}
          <div className="flex items-center justify-end gap-5 sm:gap-8">
            <a href="#" className="label link hidden sm:inline-block">
              Search
            </a>
            <a href="#" className="label link hidden sm:inline-block">
              Account
            </a>
            <a href="#" className="label link">
              Bag (0)
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
