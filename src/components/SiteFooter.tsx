const columns = [
  { title: "Client care", links: ["Contact us", "Shipping", "Returns", "Size guide"] },
  { title: "The house", links: ["Our story", "Craftsmanship", "Sustainability", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Accessibility"] },
];

export function SiteFooter() {
  return (
    <footer className="hairline-t mt-auto">
      <div className="container-page grid gap-12 py-section md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="display-sm">Letters from the atelier</h2>
          <p className="mt-3 max-w-sm text-ink-soft">
            New collections and private previews, delivered sparingly.
          </p>
          <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row" action="#">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input id="email" type="email" placeholder="Email address" className="field" />
            <button type="submit" className="btn btn-primary shrink-0">
              Subscribe
            </button>
          </form>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="label mb-5 font-sans">{col.title}</h3>
            <ul className="flex flex-col gap-3 text-sm text-ink-soft">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="link">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hairline-t">
        <p className="container-page label-micro py-5 text-mute">
          © 2026 Atelier. Sample storefront.
        </p>
      </div>
    </footer>
  );
}
