import Link from "next/link";
import { login } from "@/app/actions/auth";
import PublicNav from "@/components/PublicNav";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; notice?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-14">
        <div className="rounded-3xl border border-stroke bg-surface p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-semibold">Sign in</h1>

          {params?.error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </p>
          )}
          {params?.notice && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {params.notice}
            </p>
          )}

          <form action={login} className="mt-6 grid gap-4">
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
            <button className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-black">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            New agent?{" "}
            <Link href="/register" className="text-ink underline">
              Register here
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
