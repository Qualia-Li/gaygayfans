import Link from "next/link";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-black text-white">
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-bold hover:opacity-80">
            🏳️‍🌈 GayGayFans
          </Link>
        </div>
      </nav>
      <article className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
          {children}
        </div>
      </article>
      <footer className="border-t border-zinc-800 py-6">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-4 px-4 text-sm text-zinc-400">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/content-policy" className="hover:text-white">Content Policy</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
