# Maison Lookbook — simple dress shop

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Vercel

- `/` — public product grid. Click a dress to open the details popup.
- `/admin/login` — admin email + password login.
- `/admin` — add-product form (with image preview + validation) and the product list.

## Folder structure

```
supabase/schema.sql              ← run once in the Supabase SQL editor
.env.example                     ← copy to .env.local
next.config.ts                   ← allows Supabase images in next/image
src/
  proxy.ts                       ← protects /admin (Next 16 name for "middleware")
  app/
    layout.tsx                   ← fonts (Cormorant Garamond + Inter)
    globals.css                  ← colors, popup animations
    page.tsx                     ← "/" public grid (server component)
    admin/
      page.tsx                   ← "/admin" dashboard (protected)
      actions.ts                 ← server action: save product
      AddProductForm.tsx         ← form, preview, validation, image upload
      AdminProductList.tsx       ← list of existing products
      SignOutButton.tsx
      login/
        page.tsx                 ← "/admin/login"
        LoginForm.tsx
  components/
    ProductGrid.tsx              ← masonry grid + popup state
    ProductCard.tsx              ← one product tile
    ProductModal.tsx             ← popup (centered card / mobile bottom sheet)
    ProductGridSkeleton.tsx      ← loading state
    EmptyState.tsx               ← "no products" state
  lib/
    products.ts                  ← cached public product query
    validation.ts                ← form rules (browser + server)
    format.ts                    ← price formatting
    types.ts                     ← Product type
    supabase/
      client.ts                  ← browser client
      server.ts                  ← server client (reads login cookies)
      public.ts                  ← cookie-free client for public reads
      proxy.ts                   ← session refresh + /admin redirect
      env.ts                     ← env var check
```

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open `supabase/schema.sql`, replace `admin@example.com` with your admin email, and run the whole file in **SQL Editor → New query**.
   This creates the `products` table, the RLS policies, the `product-images` bucket (public, 2 MB, images only), and the storage policies.
3. **Authentication → Users → Add user → Create new user**: use the same admin email and a strong password. Tick "Auto confirm user".
4. **Authentication → Sign In / Providers**: turn off **Allow new users to sign up**, so nobody else can create an account.

### 2. Environment variables

| Name | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → **Connect** button (top bar) → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same dialog, or Project Settings → **API Keys** → the **publishable** key (`sb_publishable_…`). The legacy `anon` key also works, but Supabase is retiring it by the end of 2026. |

**Locally:** copy `.env.example` to `.env.local`, paste in your values, and restart `npm run dev`.

**On Vercel:** Project → Settings → Environment Variables → add both names for Production, Preview, and Development, then redeploy.

Both values are safe to expose in the browser. Your data is protected by RLS, not by hiding these keys. Never put the `service_role` key in this app.

### 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin.

> The home page fetches products at **build time** (and caches them for up to 1 hour, or refreshes right away when you add a product).
> `npm run build` therefore needs the env vars set and the SQL already run, otherwise the build fails.

## Testing checklist

- [ ] `/` with no products shows "The rails are empty".
- [ ] `/admin` while logged out redirects to `/admin/login`.
- [ ] A wrong password shows an error, and the right one opens the dashboard.
- [ ] Submitting the empty form shows an error under each field.
- [ ] Choosing a file over 2 MB, or a non-image file, shows an image error.
- [ ] Choosing a valid image shows a preview.
- [ ] Adding a product shows a success message, clears the form, and puts the product in the list.
- [ ] `/` shows the new product right away, with a tall image and hover zoom.
- [ ] Clicking a product opens the popup with image, name, price, description, quantity, phone, email, and address.
- [ ] The popup closes with the ✕ button, the **Esc** key, and a click on the dark backdrop.
- [ ] While the popup is open, the page behind it doesn't scroll and **Tab** stays inside the popup.
- [ ] On a phone (or DevTools mobile view), the popup slides up as a bottom sheet.
- [ ] A user who is logged in but not the admin email sees "Not authorized" and can't insert products (RLS blocks it).
- [ ] Sign out returns you to the login page.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project** → import the repo. The framework is detected as Next.js.
3. Add the two environment variables (see above) **before** the first deploy.
4. Click **Deploy**.
5. Optional: in Supabase → Authentication → URL Configuration, set **Site URL** to your Vercel URL.
6. Open `https://your-app.vercel.app/admin`, log in, and add your first dress.
