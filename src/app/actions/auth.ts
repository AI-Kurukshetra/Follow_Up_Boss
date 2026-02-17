"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    const message = error?.message?.replace(/"/g, "") ?? "Invalid credentials";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  redirect("/agent");
}

export async function registerAgent(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const phone_number = String(formData.get("phone_number") || "").trim();
  const brokerage_percentage = Number(formData.get("brokerage_percentage") || 0);
  const description = String(formData.get("description") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const country = String(formData.get("country") || "").trim();

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await supabase
      .from("profiles")
      .update({
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
      })
      .eq("id", data.user.id);
  }

  if (!data.session) {
    redirect("/login?notice=Check%20your%20email%20to%20confirm%20your%20account");
  }

  redirect("/agent");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
