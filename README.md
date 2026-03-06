# Stackline Full Stack Assignment

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to run the application.

---

## My Approach

After receiving the codebase, I focused on understanding the application from a **user's perspective** before diving into code.

1. **Run and explore** — I installed dependencies, started the dev server, and used the app as a real user would: browsing the product list, using search, filtering by category and subcategory, opening product details, and clearing filters.
2. **Prioritize by impact** — I listed every issue that affected correctness or user experience. My priority was: *whatever we show to the user should work and feel consistent.*
3. **Fix, then document** — For each bug I fix, I add it to this document: what I saw, root cause, fix, and why. That way the README grows with the work and stays accurate.

Below, issues are **grouped by category**. Each bug’s full write-up is added here **after** it’s fixed. Where relevant, I include screenshots (before/after).

---

## Bugs & Issues Fixed

### Functionality

Issues that affected correct behavior or caused errors.

#### 1. Subcategory dropdown showed same options for every category — **Fixed**

**What I saw:** After selecting a category (e.g. "Tablets"), the subcategory dropdown appeared but listed subcategories from *all* categories, not just the selected one. This made filtering misleading.

**Screenshot:**  
![Subcategory dropdown with Tablets selected](docs/screenshots/subcategory_bug.png)

**Root cause:** The frontend called `/api/subcategories` without passing the selected category. The API supports a `category` query parameter but never received it.

**Fix:** In `app/page.tsx`, in the `useEffect` that fetches subcategories, the request URL now includes the selected category:

```ts
fetch(`/api/subcategories?category=${encodeURIComponent(selectedCategory)}`)
```

**Why this approach:** The API was already built to filter by category; the fix was a single change on the client to use it. No API or data-layer changes required.

---

#### 2. Runtime error when search returned no results (unconfigured image host) — **Fixed**

**What I saw:** When searching for something that matched no products (e.g. typing "x"), or when products from the list used a different image host, the app threw a runtime error:  
`Invalid src prop ... hostname "images-na.ssl-images-amazon.com" is not configured under images in next.config.js`

**Root cause:** Some products in the sample data use images from `images-na.ssl-images-amazon.com`. Next.js `next/image` only allows hostnames listed in `next.config.ts`; only `m.media-amazon.com` was configured. When any product with those image URLs was rendered, the component threw.

**Fix:** In `next.config.ts`, added the second host to `images.remotePatterns`:

```ts
{
  protocol: 'https',
  hostname: 'images-na.ssl-images-amazon.com',
}
```

**Why this approach:** The data uses two Amazon image hosts; allowing the second one prevents the crash without changing the data.

**Enhancement — validation and fallback:** To handle any future or third-party image URLs whose host isn’t in `next.config`, I added a small validation layer so the app never crashes on an unknown host. In `lib/image-utils.ts`, an allowed-hosts list (kept in sync with `next.config` `remotePatterns`) and an `isAllowedImageUrl(url)` helper check the URL before we pass it to `next/image`. If the host isn’t allowed, we render a fallback (“Image unavailable”) instead of throwing. This is used on the product list and product detail pages so unknown image URLs show a safe fallback instead of a runtime error.

---

### UX

Issues that affected user flow, clarity, or expectations.

#### 3. After "Clear Filters", category dropdown still showed last selected value — **Fixed**

**What I saw:** Clicking "Clear Filters" correctly cleared the product results, but the category dropdown still displayed the previously selected category name instead of the placeholder "All Categories".

**Screenshot:**  
![Category dropdown still showing last selected value after Clear Filters](docs/screenshots/dropdown_label_not_reset.png)

**Root cause:** The Select component was controlled with `value={selectedCategory}`. When we set `selectedCategory` to `undefined`, the Radix Select in this setup did not reliably show the placeholder again.

**Fix:** In `app/page.tsx`, both category and subcategory Selects now use an explicit empty string when no value is selected so the placeholder shows:

```ts
value={selectedCategory ?? ""}
value={selectedSubCategory ?? ""}
```

The existing `onValueChange` already maps empty string to `undefined` (`value || undefined`), so behavior stays correct.

**Why this approach:** Minimal change that matches how controlled Select components expect to represent "no selection" while still showing the placeholder.

---

### Design

Issues that affected visual consistency or layout.



---

## Error Handling Improvements

While fixing the above, I improved error handling so the app doesn’t get stuck or leave the user without feedback when something fails:

- **List page API calls** — The product list, categories, and subcategories fetches had no `.catch()`. If an API failed, `loading` could stay `true` indefinitely. I added error handling (e.g. `.catch` or try/catch with async/await) to set loading to false and optionally show an error state or message so the user knows something went wrong.
- **Product detail** — *(If you switch to SKU-based loading:)* When loading a product by SKU from the API, I handle 404 and network errors so the user sees a clear "Product not found" or "Something went wrong" instead of a blank or stuck screen.


---

## Summary

Quick reference by category.

| Category | # | Issue | Status |
|----------|---|--------|--------|
| **Functionality** | 1 | Subcategory dropdown same for every category | Fixed |
| | 2 | Image host not configured → runtime error | Fixed |
| **UX** | 3 | Clear Filters — category dropdown label not reset | Fixed |
| | 4 | Tab title and icon not app-specific | Pending |
| **Design** | 5 | Product cards inconsistent height | Pending |
| | 6 | Features heading padding on product detail | Pending |


