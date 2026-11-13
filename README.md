# Subhadra Organic — subhadraorganic.com

Static multi-page site for Subhadra Organic, a family organic farm in Weir,
Bharatpur, Rajasthan. Built and maintained by [OneT Digital Solutions](https://onetdigitalsolution.com).

## Pages

| URL | File | Purpose |
|---|---|---|
| `/` | `index.html` | Hero, manifesto, best sellers, categories, testimonials |
| `/products/` | `products/index.html` | Full catalogue — 94 products, search + category filters |
| `/bilona-ghee/` | `bilona-ghee/index.html` | A2 Gir bilona ghee, six-step process (HowTo + FAQ schema) |
| `/about/` | `about/index.html` | Farm story, founder, stats |
| `/contact/` | `contact/index.html` | WhatsApp, email, address, hours, FAQ |

Each page is a folder containing `index.html`, so URLs stay clean — no `.html`
in the address bar.

## Layout

```
.
├── index.html              home
├── about/  bilona-ghee/  contact/  products/
├── assets/
│   ├── site.css            all styles (shared by every page)
│   ├── site.js             all behaviour (shared by every page)
│   └── img/                images + hero video, content-hashed filenames
├── vercel.json             redirects, headers, trailing-slash rule  (Vercel)
├── _redirects / _headers   same rules for Netlify
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

Images are named by content hash (e.g. `f424f6d5d8.jpg`) and served with a
one-year immutable cache header. Changing an image means a new filename, so
cache busting is automatic — never overwrite a hashed file in place.

## Hosting

Deploys as a plain static site — no build step, no framework. Output directory
is the repository root.

- **Vercel** — import the repo, framework preset "Other", leave build command
  empty, output directory `.`. `vercel.json` handles the rest.
- **Netlify** — `_redirects` and `_headers` cover the same rules.

## Editing

The pages share `assets/site.css` and `assets/site.js`, so a change there
applies everywhere. Page content lives in each `index.html`.

The nav, footer, cart drawer and toast markup are duplicated across the five
pages. Editing any of them means editing all five — or regenerating the pages
from the builder that produced them.

## SEO

Every page carries a unique title and description, a canonical URL, Open Graph
and Twitter card tags with explicit image dimensions, geo tags for Bharatpur,
and JSON-LD. Schema in use: `Organization`, `LocalBusiness`, `WebSite`,
`BreadcrumbList`, `CollectionPage`, `AboutPage`, `ContactPage`, plus `HowTo`
and `FAQPage` on the bilona ghee page.

Social preview images must be JPEG or PNG — WhatsApp does not reliably render
WebP, and `og:image` must never point at the hero `.mp4`.

After any deploy that adds or renames a page, update `sitemap.xml` and
resubmit it in Google Search Console.

## Known gaps

- Product photography is authentic only for ghee and makkhan. The remaining
  categories still use stock imagery pending photos from the client.
- Product data is hard-coded in `products/index.html`; there is no CMS or
  backend. Orders are placed over WhatsApp.
