import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://gaygayfans.vercel.app";

export const metadata: Metadata = {
  title: "GayGayFans — Gay Video Feed | Adult Content for Gay Men",
  description:
    "GayGayFans is a TikTok-style vertical video feed featuring curated gay adult content. Browse, discover, and enjoy videos from verified creators in a safe, legal, and community-driven platform for gay men. 18+ only.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "GayGayFans — Gay Video Feed",
    description:
      "A TikTok-style vertical video feed featuring curated gay adult content from verified creators. 18+ only.",
    url: siteUrl,
    siteName: "GayGayFans",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GayGayFans — Gay Video Feed",
    description:
      "A TikTok-style vertical video feed featuring curated gay adult content from verified creators. 18+ only.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
