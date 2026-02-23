import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://gaylyfans.com";

export const metadata: Metadata = {
  title: "GaylyFans — Gay Video Feed | Adult Content for Gay Men",
  description:
    "GaylyFans is a TikTok-style vertical video feed with curated gay adult content from verified creators. Safe, legal, community-driven. 18+ only.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "GaylyFans — Gay Video Feed",
    description:
      "A TikTok-style vertical video feed featuring curated gay adult content from verified creators. 18+ only.",
    url: siteUrl,
    siteName: "GaylyFans",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 1024,
        alt: "GaylyFans — Gay Video Feed • 18+",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GaylyFans — Gay Video Feed",
    description:
      "A TikTok-style vertical video feed featuring curated gay adult content from verified creators. 18+ only.",
    images: ["/og-image.png"],
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
        <Theme appearance="dark" accentColor="pink" grayColor="slate" radius="large">
          {children}
        </Theme>
      </body>
    </html>
  );
}
