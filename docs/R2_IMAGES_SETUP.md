# Image Upload & Serving — End-to-End Flow

Three repositories cooperate to handle every image in the platform:

| Repo | Role |
|---|---|
| `ekoru-web-app` | Next.js frontend — same-origin proxy routes + client functions |
| `ekoru-gateway` | NestJS API gateway — auth, DB writes, forwards to image processor |
| `ekoru-image-processor` | Rust microservice — resizes to WebP, stores in Cloudflare R2 |

The browser never talks to R2 directly. R2 credentials live only inside the image processor.

---

## Upload flow (all image types)

```
Browser
  │
  │  POST /api/profile/avatar    (or /cover, /products/images)
  │  Content-Type: multipart/form-data
  ▼
Next.js API route  (app/api/…/route.ts)
  │  reads HttpOnly `token` cookie
  │  rebuilds FormData, adds Authorization: Bearer <token>
  │  POST gateway /api/profile-image  (or /cover-image, /images/upload/product)
  ▼
ekoru-gateway  (NestJS, :4000)
  │  JwtAuthGuard validates Bearer token → extracts sellerId
  │  looks up existing image key in Prisma DB
  │  DELETE old R2 key via image-processor (fire-and-warn)
  │  POST /process to image-processor with X-Internal-Token
  ▼
ekoru-image-processor  (Rust, :8090 — internal only)
  │  validates X-Internal-Token
  │  decodes image, resizes with Lanczos3 filter, encodes as WebP
  │  PUT object to Cloudflare R2 (S3-compatible API)
  │  returns { key, url, original_size, processed_size, width, height }
  ▼
ekoru-gateway  (continues)
  │  writes R2 key to Prisma DB (not the URL — keys are CDN-agnostic)
  │  returns { key, imageUrl, … } to the Next.js proxy
  ▼
Next.js API route
  │  passes response through unchanged
  ▼
Browser
```

---

## Image types and gateway endpoints

| Image type | Next.js proxy route | Gateway endpoint | Gateway controller | Entity sent to processor | Auth |
|---|---|---|---|---|---|
| Profile avatar | `POST /api/profile/avatar` | `POST /api/profile-image` | `ProfileImageController` | `user_avatar` | JWT required |
| Cover image | `POST /api/profile/cover` | `POST /api/cover-image` | `CoverImageController` | `user_cover` | JWT required |
| Product image (publish flow) | `POST /api/products/images` | `POST /api/images/upload/product` | `ImagesController` | `product` | optional |
| Store product / service image | _(direct from server context)_ | `POST /api/business-image` | `BusinessImageController` | `product` or `service` | none |

### FormData field names

| Gateway endpoint | File field | Extra fields |
|---|---|---|
| `/api/profile-image` | `file` | _(none — sellerId comes from JWT)_ |
| `/api/cover-image` | `file` | _(none — sellerId comes from JWT)_ |
| `/api/images/upload/product` | `image` | `entityId` (seller ID) |
| `/api/business-image` | `file` | `itemId`, `itemType` (`storeProduct`\|`service`) |

---

## What the gateway persists

The gateway writes the **R2 key** (e.g. `user_avatar/42/9f2a…webp`), not the full URL, into Postgres via Prisma. This keeps stored values stable across CDN domain changes.

| Image | Prisma model | Field |
|---|---|---|
| Person avatar | `PersonProfile` | `profileImage` |
| Person cover | `PersonProfile` | `coverImage` |
| Business logo | `BusinessProfile` | `logo` |
| Business cover | `BusinessProfile` | `coverImage` |
| Product images | `Product` | `images` (String[]) |
| Store product images | `StoreProduct` | `images` (String[]) |
| Service images | `Service` | `images` (String[]) |

---

## Image processor resize presets

| Entity | Max width | Max height | Notes |
|---|---|---|---|
| `user_avatar` | 400 | 400 | Profile photo |
| `user_cover` | 1200 | 400 | Cover/banner |
| `product` | 800 | 800 | Marketplace product |
| `service` | 800 | 600 | Service listing |
| `community` | 1000 | 700 | Community asset |
| `asset` | 1920 | 1080 | Department/admin asset |

Aspect ratio is always preserved (fit inside box, not cropped). Output is always WebP.

R2 key format: `{entity}/{entity_id}/{uuid}.webp`

---

## Reading images (display flow)

```
GraphQL response
  │  e.g. seller.profile.profileImage = "user_avatar/42/9f2a…webp"
  │        (or legacy "/images/foo.jpg" for old rows)
  ▼
resolveImageUrl()  (utils/resolveImage.ts)
  │  "http…"         → returned unchanged
  │  "/images/…"     → GATEWAY_BASE_URL + path  (legacy, until backfilled)
  │  bare R2 key     → IMAGES_PUBLIC_BASE_URL + "/" + key
  ▼
Fully-qualified CDN URL
  e.g. https://staging-images.ekoru.cl/user_avatar/42/9f2a…webp
  ▼
next/image  (allowed by next.config.ts remotePatterns)
  │  fetches from Cloudflare R2 custom domain
  ▼
Browser renders image
```

`IMAGES_PUBLIC_BASE_URL` is set per environment in `config/endpoints.ts`:

| Environment | CDN host |
|---|---|
| production | `https://images.ekoru.cl` |
| staging | `https://staging-images.ekoru.cl` |
| development | `https://staging-images.ekoru.cl` (browser hits staging CDN; gateway is localhost) |

---

## Web app source map

| File | Purpose |
|---|---|
| `app/api/profile/avatar/route.ts` | Proxy → `POST /api/profile-image` |
| `app/api/profile/cover/route.ts` | Proxy → `POST /api/cover-image` |
| `app/api/products/images/route.ts` | Proxy → `POST /api/images/upload/product` |
| `lib/api/profile.ts` | `uploadProfileImage()`, `uploadCoverImage()` |
| `lib/api/products.ts` | `uploadProductImage()` |
| `utils/resolveImage.ts` | R2 key / legacy path → CDN URL |
| `config/endpoints.ts` | `GATEWAY_BASE_URL`, `IMAGES_PUBLIC_BASE_URL` |
| `next.config.ts` | Allowlisted CDN + gateway hosts for next/image |
| `store/useAuthStore.ts` | `useProfileImage()`, `useCoverImage()` selectors |

---

## Gateway source map

| File | Purpose |
|---|---|
| `src/images/images.module.ts` | NestJS module wiring all image controllers |
| `src/images/image-processor.client.ts` | HTTP client for the Rust service (`/process`, `/objects/:key`) |
| `src/images/profile-image.controller.ts` | `POST /api/profile-image` — avatar, auth-gated |
| `src/images/cover-image.controller.ts` | `POST /api/cover-image` — cover, auth-gated |
| `src/images/images.controller.ts` | `POST /api/images/upload/product`, `/upload/user`, `/upload/department` |
| `src/images/product-images.controller.ts` | `POST /api/product-images` — multi-file, updates product.images in DB |
| `src/images/business-image.controller.ts` | `POST /api/business-image` — storeProduct or service image |

---

## Environment variables

### ekoru-gateway
```
IMAGE_PROCESSOR_URL=http://localhost:8090          # dev
# http://ekoru-image-processor-staging:8090        # staging (docker internal)
# http://ekoru-image-processor:8090                # prod    (docker internal)
IMAGE_PROCESSOR_TOKEN=<shared secret>              # must match INTERNAL_TOKEN in image-processor
```

### ekoru-image-processor
```
R2_ACCOUNT_ID=<32-char hex from Cloudflare>
R2_ACCESS_KEY_ID=<R2 API token key>
R2_SECRET_ACCESS_KEY=<R2 API token secret>
R2_BUCKET=ekoru-images-staging                     # or ekoru-images for prod
R2_PUBLIC_BASE_URL=https://staging-images.ekoru.cl # or https://images.ekoru.cl
INTERNAL_TOKEN=<same value as IMAGE_PROCESSOR_TOKEN in gateway>
MAX_UPLOAD_BYTES=10485760                          # 10 MiB (optional, this is the default)
```

### ekoru-web-app
No R2 credentials needed. The only image config is `NEXT_PUBLIC_ENVIRONMENT`
which drives `IMAGES_PUBLIC_BASE_URL` in `config/endpoints.ts`.
