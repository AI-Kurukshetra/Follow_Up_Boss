import dotenv from "dotenv";
import fs from "fs";

const envPath = fs.existsSync(".env.local") ? ".env.local" : ".env";
dotenv.config({ path: envPath });
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const adminEmail = process.env.ADMIN_EMAIL || "admin@followupboss.local";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureUser({ email, password, role, name }) {
  const { data: existing, error: lookupError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (lookupError) throw lookupError;

  const found = existing?.users?.find((u) => u.email === email);
  if (!found) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (error) throw error;
    const user = data.user;
    await upsertProfile(user.id, role, name, email);
    return user.id;
  }

  // Ensure existing user has the expected password (e.g. admin123 after re-seed)
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    found.id,
    { password }
  );
  if (updateError) {
    console.warn(`Could not update password for ${email}:`, updateError.message);
  }

  await upsertProfile(found.id, role, name, email);
  return found.id;
}

async function upsertProfile(id, role, name, email) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id, role, name, email });
  if (error) throw error;
}

async function seed() {
  const adminId = await ensureUser({
    email: adminEmail,
    password: adminPassword,
    role: "admin",
    name: "Admin",
  });

  const agent1Id = await ensureUser({
    email: "agent1@followupboss.local",
    password: "agent123",
    role: "agent",
    name: "Avery Cole",
  });

  const agent2Id = await ensureUser({
    email: "agent2@followupboss.local",
    password: "agent123",
    role: "agent",
    name: "Jordan Park",
  });

  const agent3Id = await ensureUser({
    email: "agent3@followupboss.local",
    password: "agent123",
    role: "agent",
    name: "Agent Three",
  });

  await supabase.from("profiles").upsert([
    {
      id: agent1Id,
      role: "agent",
      name: "Avery Cole",
      email: "agent1@followupboss.local",
      phone_number: "+1-555-0101",
      brokerage_percentage: 2.5,
      description: "Residential specialist",
      address: "12 Market St",
      city: "Austin",
      state: "TX",
      country: "USA",
    },
    {
      id: agent2Id,
      role: "agent",
      name: "Jordan Park",
      email: "agent2@followupboss.local",
      phone_number: "+1-555-0102",
      brokerage_percentage: 3.0,
      description: "Commercial specialist",
      address: "88 River Rd",
      city: "Denver",
      state: "CO",
      country: "USA",
    },
    {
      id: agent3Id,
      role: "agent",
      name: "Agent Three",
      email: "agent3@followupboss.local",
      phone_number: "+1-555-0103",
      brokerage_percentage: 2.75,
      description: "Agent",
      address: "50 Center St",
      city: "Phoenix",
      state: "AZ",
      country: "USA",
    },
  ]);

  await supabase.from("customers").upsert(
    [
      {
        name: "Taylor Reed",
        email: "taylor.reed@example.com",
        phone_number: "+1-555-0201",
        address: "45 Oak Lane",
        city: "Austin",
        state: "TX",
        country: "USA",
        pincode: "73301",
        description: "Looking for a 3BR in north Austin",
        agent_id: agent1Id,
        created_by: adminId,
      },
      {
        name: "Morgan Lee",
        email: "morgan.lee@example.com",
        phone_number: "+1-555-0202",
        address: "901 Pine Ave",
        city: "Denver",
        state: "CO",
        country: "USA",
        pincode: "80202",
        description: "Interested in commercial lease",
        agent_id: agent2Id,
        created_by: adminId,
      },
    ],
    { onConflict: "email" }
  );

  await supabase.from("properties").upsert(
    [
      {
        property_number: "PROP-1001",
        description: "Modern 3BR with backyard",
        status: "available",
        price: 520000,
        rate_per_sqft: 260,
        agent_id: agent1Id,
        created_by: adminId,
      },
      {
        property_number: "PROP-2001",
        description: "Downtown retail space",
        status: "on_hold",
        price: 1400000,
        rate_per_sqft: 420,
        agent_id: agent2Id,
        created_by: adminId,
      },
    ],
    { onConflict: "property_number" }
  );

  console.log("Seed completed.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
