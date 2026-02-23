import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GaylyFans — Safe Gay Adult Video Platform",
  description: "Learn about GaylyFans — a safe and legal TikTok-style platform for curated gay adult video content from verified creators. No piracy, ever.",
};

export default function AboutPage() {
  return (
    <LegalLayout title="About GaylyFans">
      <h2>What is GaylyFans?</h2>
      <p>
        GaylyFans is a TikTok-style vertical video feed designed specifically for gay men.
        We provide a seamless, mobile-first browsing experience for curated adult content
        from verified creators.
      </p>

      <h2>Our Mission</h2>
      <p>
        We believe in creating a safe, legal, and respectful space for gay adult content.
        Unlike piracy sites, every video on GaylyFans comes from verified creators who
        have given explicit consent for their content to be shared on our platform.
      </p>

      <h2>How It Works</h2>
      <ul>
        <li><strong>Swipe to discover:</strong> Browse our vertical feed just like TikTok — swipe up for the next video</li>
        <li><strong>Curated content:</strong> All videos are reviewed and categorized by our team</li>
        <li><strong>Verified creators:</strong> Every creator goes through identity and age verification</li>
        <li><strong>No piracy:</strong> We do not accept re-uploaded or stolen content from other platforms</li>
      </ul>

      <h2>Safety First</h2>
      <p>
        GaylyFans implements age verification at entry, strict content moderation, and
        creator verification to ensure a safe experience. We comply with all applicable
        laws including 2257 record-keeping requirements.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or feedback? Visit our{" "}
        <a href="/contact" className="text-pink-400 hover:text-pink-300">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
