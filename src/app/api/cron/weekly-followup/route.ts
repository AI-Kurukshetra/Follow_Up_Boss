import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret =
    request.headers.get("x-cron-secret") || url.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json(
      { error: "Missing Gmail credentials" },
      { status: 500 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: agents, error: agentError } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("role", "agent");

  if (agentError) {
    return NextResponse.json({ error: agentError.message }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const nowIso = new Date().toISOString();
  const appUrl = process.env.APP_BASE_URL || "http://localhost:3000";

  for (const agent of agents || []) {
    const { data: customers } = await supabase
      .from("customers")
      .select("name, email, next_followup_at")
      .eq("agent_id", agent.id)
      .lte("next_followup_at", nowIso)
      .order("next_followup_at", { ascending: true });

    if (!customers?.length) {
      continue;
    }

    const lines = customers
      .map(
        (customer) =>
          `- ${customer.name} (${customer.email}) follow-up due ${
            customer.next_followup_at
              ? new Date(customer.next_followup_at).toLocaleDateString()
              : "soon"
          }`
      )
      .join("\n");

    await transporter.sendMail({
      from: `Follow Up Boss <${process.env.GMAIL_USER}>`,
      to: agent.email,
      subject: "Weekly customer follow-ups",
      text: `Hi ${agent.name || "Agent"},\n\nHere are your follow-ups due this week:\n${lines}\n\nOpen your dashboard: ${appUrl}/agent\n`,
    });
  }

  return NextResponse.json({ ok: true });
}
