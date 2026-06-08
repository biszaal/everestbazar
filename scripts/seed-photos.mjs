// Downloads product-relevant photos from the internet and uploads them to the
// Supabase `listing-photos` bucket (service role), then sets each listing's
// photo_paths — i.e. exactly what a real seller upload produces.
// Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-photos.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

// title substring -> Flickr keyword tag(s)
const KEYWORDS = [
  ["iPhone", "iphone"],
  ["Royal Enfield", "motorcycle"],
  ["study table", "desk,wood"],
  ["Dell XPS", "laptop"],
  ["Yamaha", "scooter,motorcycle"],
  ["sofa", "sofa,couch"],
  ["Sony A6400", "camera"],
  ["gas stove", "stove,kitchen"],
  ["North Face", "jacket"],
  ["PlayStation", "videogame,console"],
  ["Trek mountain bike", "bicycle"],
  ["almirah", "wardrobe,cupboard"],
];

function tagFor(title) {
  const t = title.toLowerCase();
  for (const [k, v] of KEYWORDS) if (t.includes(k.toLowerCase())) return v;
  return "product";
}

async function fetchImage(tag, lock) {
  const sources = [
    `https://loremflickr.com/800/600/${encodeURIComponent(tag)}?lock=${lock}`,
    `https://picsum.photos/seed/${encodeURIComponent(tag)}-${lock}/800/600`,
  ];
  for (const u of sources) {
    try {
      const r = await fetch(u, { redirect: "follow" });
      if (!r.ok) continue;
      const ct = r.headers.get("content-type") || "image/jpeg";
      if (!ct.startsWith("image/")) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 2000) return { buf, ct };
    } catch {
      /* try next source */
    }
  }
  return null;
}

const { data: listings, error } = await sb
  .from("listings")
  .select("id, title")
  .eq("status", "ACTIVE");
if (error) {
  console.error(error.message);
  process.exit(1);
}

let total = 0;
for (const l of listings) {
  const tag = tagFor(l.title);
  const paths = [];
  for (let i = 0; i < 3; i++) {
    const img = await fetchImage(tag, i + 1);
    if (!img) continue;
    const ext = img.ct.includes("png") ? "png" : "jpg";
    const path = `seed/${l.id}/${i}.${ext}`;
    const { error: upErr } = await sb.storage
      .from("listing-photos")
      .upload(path, img.buf, { contentType: img.ct, upsert: true });
    if (upErr) {
      console.log(`  upload error (${l.title}): ${upErr.message}`);
      continue;
    }
    paths.push(path);
  }
  if (paths.length) {
    await sb.from("listings").update({ photo_paths: paths }).eq("id", l.id);
    total += paths.length;
    console.log(`${l.title} [${tag}] -> ${paths.length} photos`);
  } else {
    console.log(`${l.title} -> NO photos (network?)`);
  }
}
console.log(`\nuploaded ${total} photos across ${listings.length} listings`);
