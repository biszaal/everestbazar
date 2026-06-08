// Seeds demo sellers + listings into Supabase using the service-role key.
// Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const slug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const SELLERS = [
  "Aarati Shrestha", "Bibek Gurung", "Sunita Maharjan", "Prakash Thapa",
  "Nisha Tamang", "Roshan Adhikari", "Anjali Rai", "Dipesh K.C.",
];

const CONDITIONS = ["LIKE_NEW", "GOOD", "FAIR"];
const CAT_MAP = {
  mobile: "ELECTRONICS", electronics: "ELECTRONICS", vehicles: "VEHICLES",
  furniture: "FURNITURE", home: "OTHER", fashion: "FASHION",
};
const CAT_LABEL = {
  mobile: "Mobiles", electronics: "Electronics", vehicles: "Vehicles",
  furniture: "Furniture", home: "Home", fashion: "Fashion",
};
const DESC = {
  mobile: "Well looked-after and fully functional. No major scratches, battery holds well. Comes boxed with charger.",
  electronics: "Lightly used, kept in a smoke-free home. Everything works as it should. Original accessories included.",
  vehicles: "Regularly serviced with papers up to date. Runs smoothly, tyres in good shape. Test ride welcome.",
  furniture: "Solid build, no wobble, surfaces clean. From a pet-free home. Buyer arranges pickup.",
  home: "Clean and in good working order. Used carefully and maintained well. A practical buy at this price.",
  fashion: "Genuine, gently worn and freshly cleaned. True to size. No tears or stains.",
};

const LISTINGS = [
  { id: 1, cat: "mobile", title: "iPhone 13 · 128GB", price: 78000, loc: "Baneshwor, KTM" },
  { id: 2, cat: "vehicles", title: "Royal Enfield Classic 350", price: 425000, loc: "Lakeside, Pokhara" },
  { id: 3, cat: "furniture", title: "Solid wood study table", price: 9500, loc: "Patan, Lalitpur" },
  { id: 4, cat: "electronics", title: "Dell XPS 13 laptop", price: 92000, loc: "Kupondole, LTP" },
  { id: 5, cat: "vehicles", title: "Yamaha FZ scooter", price: 215000, loc: "Maharajgunj, KTM" },
  { id: 6, cat: "furniture", title: "L-shaped sofa set", price: 32000, loc: "Bhaktapur" },
  { id: 7, cat: "electronics", title: "Sony A6400 + lens", price: 115000, loc: "Jhamsikhel, LTP" },
  { id: 8, cat: "home", title: "3-burner gas stove", price: 4200, loc: "Chabahil, KTM" },
  { id: 9, cat: "fashion", title: "The North Face down jacket", price: 8800, loc: "Thamel, KTM" },
  { id: 10, cat: "electronics", title: "PlayStation 5 + 2 pads", price: 68000, loc: "New Road, KTM" },
  { id: 11, cat: "vehicles", title: "Trek mountain bike", price: 46000, loc: "Lakeside, Pokhara" },
  { id: 12, cat: "home", title: "Steel almirah · 3-door", price: 14500, loc: "Koteshwor, KTM" },
];

async function findUserByEmail(email) {
  // paginate admin.listUsers to locate an existing demo seller
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email === email);
    if (u) return u;
    if (data.users.length < 200) break;
  }
  return null;
}

const sellerIds = {}; // name -> uuid

for (let i = 0; i < SELLERS.length; i++) {
  const name = SELLERS[i];
  const email = `${slug(name)}@sellers.everestbazar.demo`;
  let userId;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      const existing = await findUserByEmail(email);
      if (!existing) throw new Error(`could not resolve existing user ${email}: ${error.message}`);
      userId = existing.id;
    } else {
      throw error;
    }
  } else {
    userId = data.user.id;
  }
  sellerIds[name] = userId;

  const completedSales = 6 + ((i * 7) % 30);
  const avgRating = 4.6 + (i % 5) * 0.08; // 4.6–4.92
  const trust = Math.min(100, completedSales * 8 + Math.round(avgRating * 12) + 30);
  const { error: upErr } = await supabase
    .from("profiles")
    .update({
      name,
      email,
      kyc_status: "VERIFIED",
      trust_score: trust,
      completed_sales: completedSales,
      avg_rating: Number(avgRating.toFixed(2)),
      city: "Kathmandu",
    })
    .eq("id", userId);
  if (upErr) throw upErr;
  console.log(`seller ${name} -> ${userId.slice(0, 8)}… (trust ${trust})`);
}

// idempotent: clear previously-seeded listings for these sellers, then insert
const ids = Object.values(sellerIds);
await supabase.from("listings").delete().in("seller_id", ids);

const rows = LISTINGS.map((l) => {
  const sellerName = SELLERS[l.id % SELLERS.length];
  return {
    seller_id: sellerIds[sellerName],
    title: l.title,
    description: DESC[l.cat],
    category: CAT_MAP[l.cat],
    subcategory: CAT_LABEL[l.cat],
    condition: CONDITIONS[l.id % CONDITIONS.length],
    price_npr: l.price,
    photo_paths: [],
    status: "ACTIVE",
    city: l.loc,
    accepts_offers: true,
  };
});

const { data: inserted, error: insErr } = await supabase
  .from("listings")
  .insert(rows)
  .select("id");
if (insErr) throw insErr;

console.log(`\nseeded ${Object.keys(sellerIds).length} sellers, ${inserted.length} listings`);
