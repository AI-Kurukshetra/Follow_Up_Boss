import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import {
  assignCustomerAgent,
  assignPropertyAgent,
  createAgent,
  createCustomer,
  createProperty,
} from "@/app/actions/admin";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: agents } = await supabase
    .from("profiles")
    .select("id, name, email, phone_number, brokerage_percentage, city, state")
    .eq("role", "agent")
    .order("created_at", { ascending: false });

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, email, city, state, agent_id, next_followup_at")
    .order("created_at", { ascending: false });

  const { data: properties } = await supabase
    .from("properties")
    .select("id, property_number, status, price, agent_id")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      <NavBar role="admin" />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
        <section className="rounded-3xl border border-stroke bg-surface p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold">Admin command center</h1>
          <p className="mt-2 text-sm text-muted">
            Create agents, customers, and properties. Assign agents to every
            lead and listing.
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
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Create agent</h2>
            <form action={createAgent} className="mt-4 grid gap-3 text-sm">
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
                name="password"
                type="password"
                placeholder="Temporary password"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <input
                name="phone_number"
                placeholder="Phone number"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <input
                name="brokerage_percentage"
                type="number"
                step="0.1"
                placeholder="Brokerage %"
                className="rounded-xl border border-stroke px-3 py-2"
              />
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
              <textarea
                name="description"
                rows={3}
                placeholder="Description"
                className="rounded-xl border border-stroke px-3 py-2"
              />
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface">
                Create agent
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Create customer</h2>
            <form action={createCustomer} className="mt-4 grid gap-3 text-sm">
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
              <input
                name="address"
                placeholder="Address"
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
              <select
                name="agent_id"
                className="rounded-xl border border-stroke px-3 py-2"
              >
                <option value="">Assign agent</option>
                {(agents || []).map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} • {agent.email}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface">
                Create customer
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Create property</h2>
            <form action={createProperty} className="mt-4 grid gap-3 text-sm">
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
              <select
                name="agent_id"
                className="rounded-xl border border-stroke px-3 py-2"
              >
                <option value="">Assign agent</option>
                {(agents || []).map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} • {agent.email}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface">
                Create property
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-stroke bg-surface p-6">
            <h2 className="text-xl font-semibold">Customers</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {(customers || []).map((customer) => (
                <div
                  key={customer.id}
                  className="rounded-2xl border border-stroke p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted">{customer.email}</p>
                    </div>
                    <form
                      action={assignCustomerAgent}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="customer_id" value={customer.id} />
                      <select
                        name="agent_id"
                        defaultValue={customer.agent_id || ""}
                        className="rounded-xl border border-stroke px-2 py-1 text-xs"
                      >
                        <option value="">Unassigned</option>
                        {(agents || []).map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-full border border-stroke px-3 py-1 text-xs">
                        Assign
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
            <h2 className="text-xl font-semibold">Properties</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {(properties || []).map((property) => (
                <div
                  key={property.id}
                  className="rounded-2xl border border-stroke p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{property.property_number}</p>
                      <p className="text-xs text-muted">
                        Status: {property.status}
                      </p>
                    </div>
                    <form
                      action={assignPropertyAgent}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="property_id" value={property.id} />
                      <select
                        name="agent_id"
                        defaultValue={property.agent_id || ""}
                        className="rounded-xl border border-stroke px-2 py-1 text-xs"
                      >
                        <option value="">Unassigned</option>
                        {(agents || []).map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-full border border-stroke px-3 py-1 text-xs">
                        Assign
                      </button>
                    </form>
                  </div>
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
