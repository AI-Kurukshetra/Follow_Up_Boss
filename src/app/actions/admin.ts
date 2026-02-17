"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function createAgent(formData: FormData) {
  await requireRole("admin");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "agent123").trim();
  const phone_number = String(formData.get("phone_number") || "").trim();
  const brokerage_percentage = Number(formData.get("brokerage_percentage") || 0);
  const description = String(formData.get("description") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const country = String(formData.get("country") || "").trim();

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error || !data.user) {
    redirect(`/admin?error=${encodeURIComponent(error?.message || "Create agent failed")}`);
  }

  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: data.user.id,
    role: "agent",
    name,
    email,
    phone_number,
    brokerage_percentage: isNaN(brokerage_percentage)
      ? null
      : brokerage_percentage,
    description,
    address,
    city,
    state,
    country,
  });

  if (profileError) {
    redirect(`/admin?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect("/admin?success=Agent%20created");
}

export async function createCustomer(formData: FormData) {
  const user = await requireRole("admin");

  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone_number: String(formData.get("phone_number") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    pincode: String(formData.get("pincode") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    agent_id: String(formData.get("agent_id") || "") || null,
    created_by: user.id,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("customers").insert(payload);
  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?success=Customer%20created");
}

export async function createProperty(formData: FormData) {
  const user = await requireRole("admin");

  const payload = {
    property_number: String(formData.get("property_number") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    status: String(formData.get("status") || "available"),
    price: Number(formData.get("price") || 0),
    rate_per_sqft: Number(formData.get("rate_per_sqft") || 0),
    agent_id: String(formData.get("agent_id") || "") || null,
    created_by: user.id,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("properties").insert(payload);
  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?success=Property%20created");
}

export async function assignCustomerAgent(formData: FormData) {
  await requireRole("admin");

  const customerId = String(formData.get("customer_id") || "");
  const agentId = String(formData.get("agent_id") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("customers")
    .update({ agent_id: agentId || null })
    .eq("id", customerId);

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?success=Customer%20assigned");
}

export async function assignPropertyAgent(formData: FormData) {
  await requireRole("admin");

  const propertyId = String(formData.get("property_id") || "");
  const agentId = String(formData.get("agent_id") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("properties")
    .update({ agent_id: agentId || null })
    .eq("id", propertyId);

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin?success=Property%20assigned");
}
