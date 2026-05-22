# Product Images on Cloudflare R2 — Setup Guide

End-to-end guide to store and serve Ekoru product images from Cloudflare R2.

## 0. Which approach (read this first)

Your **gateway already processes images** (resize/compress — it returns
`originalSize`/`processedSize`). So you have two options:

| Approach | Upload path | Server-side processing? | Effort |
| --- | --- | --- | --- |
| **A. Gateway → R2 (recommended)** | browser → gateway → R2 | ✅ keep it | low |
| B. Presigned direct upload | browser → R2 directly | ❌ must move to the edge | higher |

**Use Approach A now.** Upload traffic is tiny; the cost that made S3 expensive
is *serving* egress — and that is eliminated as long as images are **served from
an R2 custom domain**, regardless of how they were uploaded. Approach B is a
later optimization (see §9).

The golden rule: **store in R2, serve from R2's edge. Never pipe image bytes
back out through your gateway/Next server** — that reintroduces egress cost.

---

## 1. Enable R2 on your account

1. Cloudflare dashboard → left sidebar → **R2 Object Storage**.
2. First time only: click **Purchase R2** / **Get started** and **add a payment
   method**. R2 requires a card on file to activate, but the **free tier**
   (10 GB storage, 1M Class A writes, 10M Class B reads per month) means you pay
   **$0** until you exceed it, and **egress is always free**.

---

## 2. Create the bucket

1. R2 → **Create bucket**.
2. **Name:** `ekoru-product-images` (lowercase, DNS-safe; this is permanent).
3. **Location:** `Automatic` is fine, or pick a **Location Hint**/jurisdiction
   (e.g. EU) if you have data-residency needs.
4. **Create bucket.** It's private by default — good.

> Tip: create a second bucket `ekoru-product-images-staging` so staging and prod
> never share objects.

---

## 3. Get S3 API credentials

R2 is S3-compatible, so the gateway talks to it with the normal AWS SDK.

1. On the R2 overview page note your **Account ID** and the **S3 endpoint**:
   `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
2. Click **Manage R2 API Tokens** → **Create API token**.
3. Configure:
   - **Name:** `ekoru-gateway`
   - **Permissions:** `Object Read & Write`
   - **Specify bucket(s):** apply to `ekoru-product-images` only
   - **TTL:** Forever (or rotate on a schedule)
4. **Create.** Copy the **Access Key ID** and **Secret Access Key** now — the
   secret is shown only once.

You now have everything the SDK needs: endpoint, access key, secret, bucket.

---

## 4. Set up the public serving domain

This is the step that gives you free, CDN-cached egress.

### Production — custom domain (do this)

1. Bucket → **Settings** → **Public access** → **Custom Domains** →
   **Connect Domain**.
2. Enter `images.ekoru.cl` (the domain must be in this Cloudflare account).
3. Cloudflare auto-creates the DNS record and fronts the bucket with its CDN
   (caching + free egress). Wait until status is **Active**.

Public objects are then served at `https://images.ekoru.cl/<key>`.

### Dev/testing — r2.dev URL (don't use in prod)

Bucket → Settings → **Public Development URL** → **Enable**. Gives
`https://pub-<hash>.r2.dev/...`. It's rate-limited and uncacheable — fine for a
quick test, not for real traffic.

---

## 5. CORS

Only required if the **browser** talks to R2 directly (Approach B, or if you
ever `fetch()` objects cross-origin). For Approach A you can skip this.

Bucket → Settings → **CORS Policy** → add:

```json
[
  {
    "AllowedOrigins": [
      "https://ekoru.cl",
      "https://staging.ekoru.cl",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 6. Gateway integration (Approach A)

Examples assume a Node gateway (NestJS/Express). Adapt names to your framework.

### 6.1 Install

```bash
npm i @aws-sdk/client-s3
# (only if you later add presigned uploads:)
# npm i @aws-sdk/s3-request-presigner
```

### 6.2 Environment variables

```dotenv
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_BUCKET=ekoru-product-images
R2_PUBLIC_BASE_URL=https://images.ekoru.cl
```

Use the staging bucket + a `*.staging.ekoru.cl` domain in the staging env file.

### 6.3 S3 client

```ts
import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto", // R2 ignores region; "auto" is the convention
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
```

### 6.4 Replace local storage with an R2 upload

In your existing `POST /api/images/upload/product` handler, keep the
resize/compress step, then write the processed buffer to R2 instead of disk:

```ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export async function storeProductImage(processed: Buffer): Promise<{
  imagePath: string;
  imageUrl: string;
}> {
  const key = `products/${randomUUID()}.webp`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: processed,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    imagePath: `/${key}`,
    imageUrl: `${process.env.R2_PUBLIC_BASE_URL}/${key}`, // https://images.ekoru.cl/products/<uuid>.webp
  };
}
```

Keep the existing JSON response shape (`{ message, imagePath, imageUrl,
fileName, originalSize, processedSize }`) so **nothing in the web/mobile clients
changes**. The important bit: `imageUrl` must point at `R2_PUBLIC_BASE_URL`, not
at the gateway host.

---

## 7. Web app changes (minimal)

The upload flow we built (`app/api/products/images/route.ts` →
`lib/api/products.ts` → `usePublish`) keeps working unchanged. Two adjustments:

### 7.1 Pass through the gateway's R2 URL

`app/api/products/images/route.ts` currently rebuilds `imageUrl` from
`GATEWAY_BASE_URL + imagePath`. Once images live on R2, **trust the gateway's
`imageUrl`** instead of rebuilding it:

```ts
const data = (await gatewayRes.json().catch(() => ({}))) as Record<string, unknown>;
// Gateway already returns an absolute R2 URL — pass it through unchanged.
return NextResponse.json(data, { status: gatewayRes.status });
```

### 7.2 Allow the R2 domain in next/image

Add the serving domain to `next.config.ts → images.remotePatterns`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "api.staging.ekoru.cl", pathname: "/images/**" },
    { protocol: "https", hostname: "api.ekoru.cl", pathname: "/images/**" },
    { protocol: "https", hostname: "images.ekoru.cl" },          // ← R2 prod
    { protocol: "https", hostname: "pub-*.r2.dev" },             // ← R2 dev (optional)
  ],
},
```

`resolveImageUrl()` already returns absolute URLs unchanged, so stored R2 URLs
render without any other change.

---

## 8. Test the round trip

1. Set the env vars in the gateway (dev → staging bucket + domain).
2. Publish a product from the web app with 1–3 photos.
3. Confirm in the R2 dashboard the objects appear under `products/`.
4. Confirm the product renders the image from `https://images.ekoru.cl/...`
   (DevTools → Network → the image request hits the R2 domain, not the gateway).
5. Reload and confirm a `cf-cache-status: HIT` header on the image response.

---

## 9. Optional later: presigned direct uploads (Approach B)

When upload volume grows, skip the gateway for the byte transfer:

1. Gateway endpoint returns a presigned `PUT` URL + the object key:
   ```ts
   import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
   const key = `products/${randomUUID()}.jpg`;
   const url = await getSignedUrl(
     r2,
     new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }),
     { expiresIn: 300 },
   );
   // return { uploadUrl: url, key, publicUrl: `${R2_PUBLIC_BASE_URL}/${key}` }
   ```
2. Browser `PUT`s the file straight to `uploadUrl` (requires the CORS policy in
   §5), then sends `publicUrl`/`key` in the `ADD_PRODUCT` mutation.
3. **Trade-off:** the gateway no longer sees the bytes, so move processing to the
   edge — **Cloudflare Images** / **Image Resizing transformations** (resize and
   reformat at serve time via URL params), or accept client-uploaded sizes.

This removes upload load from the gateway entirely; serving stays on R2 either
way.

---

## 10. Cost & free tier recap

- **Storage:** ~$0.015/GB-month (free up to 10 GB). 100k images ≈ a few GB.
- **Writes (Class A):** free up to 1M/month.
- **Reads (Class B):** free up to 10M/month.
- **Egress:** **$0, always.**

For Ekoru's expected volume this is **$0–$1/month** vs ~$45+/month on S3, where
egress dominated.

---

## 11. Checklist

- [ ] R2 enabled (payment method added)
- [ ] Bucket `ekoru-product-images` (+ staging) created
- [ ] API token created; access key + secret stored in gateway secrets
- [ ] Custom domain `images.ekoru.cl` connected and Active
- [ ] CORS policy added (only if doing direct browser uploads)
- [ ] Gateway env vars set; `storeProductImage` writes to R2
- [ ] Gateway returns absolute R2 `imageUrl`
- [ ] Web proxy route passes `imageUrl` through (no rebuild)
- [ ] `next.config.ts` allows `images.ekoru.cl`
- [ ] End-to-end publish test passes; image served from R2 with cache HIT
