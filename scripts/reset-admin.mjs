/**
 * Ensures the admin user exists and has password admin123.
 * Run from project root: node scripts/reset-admin.mjs
 * Uses .env.local (or .env) for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import dotenv from "dotenv";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envPath = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || "admin@followupboss.local";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function resetAdmin() {
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listErr) {
    console.error("Failed to list users:", listErr.message);
    process.exit(1);
  }

  const admin = list?.users?.find((u) => u.email === adminEmail);

  if (admin) {
    const { error: updateErr } = await supabase.auth.admin.updateUserById(admin.id, {
      password: adminPassword,
    });
    if (updateErr) {
      console.error("Failed to update admin password:", updateErr.message);
      process.exit(1);
    }
    await supabase.from("profiles").upsert({
      id: admin.id,
      role: "admin",
      name: "Admin",
      email: adminEmail,
    });
    console.log("Admin password reset. You can sign in with:", adminEmail, "/", adminPassword);
  } else {
    const { data: create, error: createErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: "Admin" },
    });
    if (createErr) {
      console.error("Failed to create admin:", createErr.message);
      process.exit(1);
    }
    await supabase.from("profiles").upsert({
      id: create.user.id,
      role: "admin",
      name: "Admin",
      email: adminEmail,
    });
    console.log("Admin created. Sign in with:", adminEmail, "/", adminPassword);
  }
}

resetAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
