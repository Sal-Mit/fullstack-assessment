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

### UX

Issues that affected user flow, clarity, or expectations.



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
| | 2 | Image host not configured → runtime error | Pending |
| **UX** | 3 | Clear Filters — category dropdown label not reset | Pending |
| | 4 | Tab title and icon not app-specific | Pending |
| **Design** | 5 | Product cards inconsistent height | Pending |
| | 6 | Features heading padding on product detail | Pending |


