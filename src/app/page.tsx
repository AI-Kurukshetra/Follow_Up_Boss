import Link from "next/link";
import PublicNav from "@/components/PublicNav";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-14">
        <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">
              Real estate lead management
            </p>
            <h1 className="text-4xl leading-tight md:text-6xl">
              Keep agents laser-focused on the next customer follow-up.
            </h1>
            <p className="text-lg text-muted">
              Follow Up Boss gives admins a single place to assign agents,
              manage properties, and keep every customer touchpoint on track.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-black"
              >
                Admin or agent login
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-surface"
              >
                Agent registration
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-stroke bg-surface p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <div className="space-y-4">
              <div className="rounded-2xl bg-[linear-gradient(140deg,#f8e7d9_0%,#f0f2ef_60%)] p-5">
                <p className="text-xs uppercase text-muted">Weekly focus</p>
                <p className="text-xl font-semibold text-ink">
                  8 follow-ups due this week
                </p>
              </div>
              <div className="rounded-2xl border border-stroke p-5">
                <p className="text-xs uppercase text-muted">Agent spotlight</p>
                <p className="text-xl font-semibold text-ink">
                  Jordan Park • 12 active leads
                </p>
              </div>
              <div className="rounded-2xl border border-stroke p-5">
                <p className="text-xs uppercase text-muted">Properties</p>
                <p className="text-xl font-semibold text-ink">
                  4 new listings assigned today
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Admin command center",
              text: "Create agents, customers, and properties with assignments in one flow.",
            },
            {
              title: "Agent workspace",
              text: "Agents manage their own customers and properties without clutter.",
            },
            {
              title: "Automated follow-ups",
              text: "Weekly Gmail reminders keep every lead warm and moving.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-stroke bg-surface p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
