import Link from "next/link";
import { Container, Heading, Text, Flex } from "@radix-ui/themes";

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
        <Container size="3">
          <Flex align="center" gap="4" className="px-4 py-3">
            <Link href="/" className="text-lg font-bold hover:opacity-80">
              🏳️‍🌈 GayGayFans
            </Link>
          </Flex>
        </Container>
      </nav>
      <Container size="3" className="px-4 py-8">
        <Heading size="7" mb="6">{title}</Heading>
        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
          {children}
        </div>
      </Container>
      <footer className="border-t border-zinc-800 py-6">
        <Container size="3">
          <Flex wrap="wrap" gap="4" className="px-4">
            <Text size="2"><Link href="/about" className="text-zinc-400 hover:text-white">About</Link></Text>
            <Text size="2"><Link href="/privacy" className="text-zinc-400 hover:text-white">Privacy Policy</Link></Text>
            <Text size="2"><Link href="/terms" className="text-zinc-400 hover:text-white">Terms of Service</Link></Text>
            <Text size="2"><Link href="/content-policy" className="text-zinc-400 hover:text-white">Content Policy</Link></Text>
            <Text size="2"><Link href="/contact" className="text-zinc-400 hover:text-white">Contact</Link></Text>
          </Flex>
        </Container>
      </footer>
    </main>
  );
}
