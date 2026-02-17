import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function NavBar({ role }: { role?: "admin" | "agent" }) {
  return (
    <header className="w-full border-b border-stroke/70 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Follow Up Boss
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted hover:text-ink">
            Home
          </Link>
          {role === "admin" && (
            <Link href="/admin" className="text-muted hover:text-ink">
              Admin
            </Link>
          )}
          {role === "agent" && (
            <Link href="/agent" className="text-muted hover:text-ink">
              Agent
            </Link>
          )}
          <form action={logout}>
            <button className="rounded-full border border-stroke px-4 py-2 text-ink transition hover:border-ink">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
