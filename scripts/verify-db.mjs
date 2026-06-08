// Verifies the applied schema. Usage: SUPABASE_DB_URL=... node scripts/verify-db.mjs
import { Client } from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL not set");
  process.exit(1);
}

function makeClient(verify) {
  return new Client({
    connectionString: url,
    ssl: verify ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
}

let client = makeClient(true);
try {
  await client.connect();
} catch (e) {
  const certErr = /self.signed|unable to verify|certificate/i.test(e.message);
  if (certErr && process.env.ALLOW_INSECURE_DB_SSL === "1") {
    client = makeClient(false);
    await client.connect();
  } else if (certErr) {
    console.error("TLS verification failed. Pin the CA (NODE_EXTRA_CA_CERTS) or set ALLOW_INSECURE_DB_SSL=1 for a one-off local run.");
    process.exit(2);
  } else {
    throw e;
  }
}

const tables = await client.query(
  "select table_name from information_schema.tables where table_schema='public' order by 1"
);
const buckets = await client.query("select id from storage.buckets order by 1");
const fns = await client.query(
  "select proname from pg_proc where proname in ('increment_views','recalculate_trust_score','handle_new_user','update_updated_at') order by 1"
);
const policies = await client.query(
  "select count(*)::int n from pg_policies where schemaname='public'"
);
const storagePolicies = await client.query(
  "select count(*)::int n from pg_policies where schemaname='storage'"
);

console.log("public tables:   ", tables.rows.map((r) => r.table_name).join(", "));
console.log("storage buckets: ", buckets.rows.map((r) => r.id).join(", ") || "(none)");
console.log("functions:       ", fns.rows.map((r) => r.proname).join(", "));
console.log("RLS policies:     public =", policies.rows[0].n, " storage =", storagePolicies.rows[0].n);

await client.end();
