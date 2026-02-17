import NavBar from "@/components/NavBar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import {
  createCustomerAsAgent,
  createPropertyAsAgent,
  updateFollowup,
} from "@/app/actions/agent";

export default async function AgentPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const user = await requireRole("agent");
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, phone_number, brokerage_percentage")
    .eq("id", user.id)
    .single();

  const { data: customers } = await supabase
    .from("customers")
    .select(
      "id, name, email, city, state, next_followup_at, last_followup_at"
    )
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  const { data: properties } = await supabase
    .from("properties")
    .select("id, property_number, status, price")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      <NavBar role="agent" />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <section className="rounded-3xl border border-stroke bg-surface p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold">
            Welcome{profile?.name ? `, ${profile.name}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Manage your assigned customers and properties.
          </p>

          {searchParams?.error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchParams.error}
            </p>
          )}
          {searchParams?.success && (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {searchParams.success}
            </p>
          )}

          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-stroke p-4">
              <p className="text-xs uppercase text-muted">Email</p>
              <p className="font-semibold">{profile?.email}</p>
            </div>
            <div className="rounded-2xl border border-stroke p-4">
              <p className="text-xs uppercase text-muted">Phone</p>
              <p className="font-semibold">{profile?.phone_number || "—"}</p>
            </div>
            <div className="rounded-2xl border border-stroke p-4">
              <p className="text-xs uppercase text-muted">Brokerage %</p>
              <p className="font-semibold">
                {profile?.brokerage_percentage ?? "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Add customer</h2>
            <form action={createCustomerAsAgent} className="mt-4 grid gap-3 text-sm">
              <input
                name="name"
                placeholder="Name"
                required
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <input
                name="phone_number"
                placeholder="Phone number"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  name="city"
                  placeholder="City"
                  className="rounded-xl border border-stroke px-3 py-2"
                />
                <input
                  name="state"
                  placeholder="State"
                  className="rounded-xl border border-stroke px-3 py-2"
                />
                <input
                  name="country"
                  placeholder="Country"
                  className="rounded-xl border border-stroke px-3 py-2"
                />
              </div>
              <input
                name="pincode"
                placeholder="Pincode"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <textarea
                name="description"
                rows={2}
                placeholder="Description"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <input
                name="next_followup_at"
                type="date"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface">
                Add customer
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Add property</h2>
            <form action={createPropertyAsAgent} className="mt-4 grid gap-3 text-sm">
              <input
                name="property_number"
                placeholder="Property number"
                required
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <textarea
                name="description"
                rows={2}
                placeholder="Description"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <select
                name="status"
                className="rounded-xl border border-stroke px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="on_hold">On hold</option>
              </select>
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <input
                name="rate_per_sqft"
                type="number"
                placeholder="Rate per sqft"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface">
                Add property
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Your customers</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {(customers || []).map((customer) => (
                <div
                  key={customer.id}
                  className="rounded-2xl border border-stroke p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted">{customer.email}</p>
                      <p className="text-xs text-muted">
                        {customer.city} {customer.state}
                      </p>
                    </div>
                    <form action={updateFollowup} className="grid gap-2">
                      <input type="hidden" name="customer_id" value={customer.id} />
                      <input
                        name="next_followup_at"
                        type="date"
                        className="rounded-xl border border-stroke px-2 py-1 text-xs"
                      />
                      <button className="rounded-full border border-stroke px-3 py-1 text-xs">
                        Update follow-up
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {!customers?.length && (
                <p className="text-sm text-muted">No customers yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Your properties</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {(properties || []).map((property) => (
                <div
                  key={property.id}
                  className="rounded-2xl border border-stroke p-4"
                >
                  <p className="font-semibold">{property.property_number}</p>
                  <p className="text-xs text-muted">Status: {property.status}</p>
                  <p className="text-xs text-muted">
                    Price: {property.price ? `$${property.price}` : "—"}
                  </p>
                </div>
              ))}
              {!properties?.length && (
                <p className="text-sm text-muted">No properties yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
