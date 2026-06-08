// Applies supabase/migrations/*.sql in order using SUPABASE_DB_URL.
// Usage: SUPABASE_DB_URL=... node scripts/apply-migrations.mjs
import { readFileSync, readdirSync } from "node:fs";
import { Client } from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL not set");
  process.exit(1);
}

const dir = new URL("../supabase/migrations/", import.meta.url);
const only = process.argv.slice(2); // optional: specific filenames to apply
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .filter((f) => only.length === 0 || only.includes(f))
  .sort();

function makeClient(verify) {
  return new Client({
    connectionString: url,
    // Verify TLS by default. Supabase's direct-connection cert is self-signed,
    // so if verification fails we retry once (logged) — fine for a one-off
    // migration against your own DB. For production, pin the Supabase CA cert.
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
    console.warn("TLS verify failed; ALLOW_INSECURE_DB_SSL=1 set — connecting without verification.");
    client = makeClient(false);
    try {
      await client.connect();
    } catch (e2) {
      console.error("CONNECT_FAILED:", e2.message);
      process.exit(2);
    }
  } else if (certErr) {
    console.error("TLS verification failed against the Supabase certificate.");
    console.error("Pin the CA via NODE_EXTRA_CA_CERTS=/path/to/supabase-ca.crt, or for a one-off");
    console.error("local run against your own DB set ALLOW_INSECURE_DB_SSL=1 (insecure).");
    process.exit(2);
  } else {
    console.error("CONNECT_FAILED:", e.message);
    process.exit(2);
  }
}

for (const f of files) {
  const sql = readFileSync(new URL(f, dir), "utf8");
  process.stdout.write(`applying ${f} ... `);
  try {
    await client.query(sql);
    console.log("ok");
  } catch (e) {
    console.log("ERROR");
    console.error(`  ${e.message}`);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log("all migrations applied");
