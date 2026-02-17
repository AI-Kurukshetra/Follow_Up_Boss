"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function createCustomerAsAgent(formData: FormData) {
  const user = await requireRole("agent");

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
    next_followup_at: String(formData.get("next_followup_at") || "") || null,
    agent_id: user.id,
    created_by: user.id,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("customers").insert(payload);
  if (error) {
    redirect(`/agent?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/agent?success=Customer%20created");
}

export async function createPropertyAsAgent(formData: FormData) {
  const user = await requireRole("agent");

  const payload = {
    property_number: String(formData.get("property_number") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    status: String(formData.get("status") || "available"),
    price: Number(formData.get("price") || 0),
    rate_per_sqft: Number(formData.get("rate_per_sqft") || 0),
    agent_id: user.id,
    created_by: user.id,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("properties").insert(payload);
  if (error) {
    redirect(`/agent?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/agent?success=Property%20created");
}

export async function updateFollowup(formData: FormData) {
  const user = await requireRole("agent");
  const customerId = String(formData.get("customer_id") || "");
  const next_followup_at = String(formData.get("next_followup_at") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("customers")
    .update({
      next_followup_at: next_followup_at || null,
      last_followup_at: new Date().toISOString(),
    })
    .eq("id", customerId)
    .eq("agent_id", user.id);

  if (error) {
    redirect(`/agent?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/agent?success=Follow-up%20updated");
}
