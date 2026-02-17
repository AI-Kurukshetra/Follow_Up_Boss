import Link from "next/link";
import { registerAgent } from "@/app/actions/auth";
import PublicNav from "@/components/PublicNav";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-14">
        <div className="rounded-3xl border border-stroke bg-surface p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold">Agent registration</h1>
          <p className="mt-2 text-sm text-muted">
            Create your agent account to manage your own customers and
            properties.
          </p>

          {params?.error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </p>
          )}

          <form action={registerAgent} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                required
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone_number"
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Brokerage percentage
              </label>
              <input
                name="brokerage_percentage"
                type="number"
                step="0.1"
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows={3}
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Address</label>
              <input
                name="address"
                className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">City</label>
                <input
                  name="city"
                  className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">State</label>
                <input
                  name="state"
                  className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Country</label>
                <input
                  name="country"
                  className="rounded-xl border border-stroke bg-white px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>
            <button className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-black">
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-ink underline">
              Sign in
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
