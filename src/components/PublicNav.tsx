import Link from "next/link";

export default function PublicNav() {
  return (
    <header className="w-full border-b border-stroke/70 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Follow Up Boss
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-muted hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-ink px-4 py-2 text-ink transition hover:bg-ink hover:text-surface"
          >
            Agent register
          </Link>
        </div>
      </div>
    </header>
  );
}
