import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-violet-400 bg-violet-950/60 border border-violet-800 rounded-full">
          AI Software Engineering Sandbox
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Build and Ship Full-Stack Apps Autonomously
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg">
          Dipraj Labs provides an isolated cloud runtime that generates, debugs, and runs full-stack web applications in real time.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg transition-colors"
          >
            Launch Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
