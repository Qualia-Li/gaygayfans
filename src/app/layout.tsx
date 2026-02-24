import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import ErrorReporter from "@/components/ErrorReporter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://www.gaylyfans.com";

export const metadata: Metadata = {
  title: "GaylyFans — The Gay Community Platform | Video, Rate & Create",
  description:
    "GaylyFans is a vibrant LGBT community platform where gay men discover curated video content, rate and compare scenes, and create AI-powered videos. Join a safe, inclusive, community-driven space. 18+ only.",
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
    title: "GaylyFans — The Gay Community Platform",
    description:
      "A vibrant LGBT community where gay men discover curated content, rate scenes, and create AI-powered videos. Safe, inclusive, community-driven. 18+ only.",
    url: siteUrl,
    siteName: "GaylyFans",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 1024,
        alt: "GaylyFans — The Gay Community Platform • 18+",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GaylyFans — The Gay Community Platform",
    description:
      "A vibrant LGBT community where gay men discover curated content, rate scenes, and create AI-powered videos. Safe, inclusive, community-driven. 18+ only.",
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
        <Theme appearance="dark" accentColor="orange" grayColor="slate" radius="large">
          <ErrorReporter />
          {children}
        </Theme>
      </body>
    </html>
  );
}
