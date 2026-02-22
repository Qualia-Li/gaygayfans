import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — GayGayFans",
  description: "Contact GayGayFans for support, content takedown requests, creator inquiries, or general feedback.",
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <p>
        We&apos;re here to help. Please reach out using the appropriate channel below.
      </p>

      <h2>General Inquiries</h2>
      <p>
        For general questions, feedback, or suggestions about GayGayFans, email us at:{" "}
        <a href="mailto:hello@gaygayfans.com" className="text-pink-400 hover:text-pink-300">
          hello@gaygayfans.com
        </a>
      </p>

      <h2>Content Takedown / DMCA Requests</h2>
      <p>
        If you believe content on our platform infringes your copyright or was posted
        without your consent, please email:{" "}
        <a href="mailto:takedown@gaygayfans.com" className="text-pink-400 hover:text-pink-300">
          takedown@gaygayfans.com
        </a>
      </p>
      <p>Include the following in your request:</p>
      <ul>
        <li>URL of the content in question</li>
        <li>Proof of ownership or identity</li>
        <li>A statement of good faith belief that the use is unauthorized</li>
        <li>Your contact information</li>
      </ul>
      <p>We respond to all takedown requests within 24 hours.</p>

      <h2>Creator Inquiries</h2>
      <p>
        Interested in sharing your content on GayGayFans? Email:{" "}
        <a href="mailto:creators@gaygayfans.com" className="text-pink-400 hover:text-pink-300">
          creators@gaygayfans.com
        </a>
      </p>

      <h2>Report Abuse</h2>
      <p>
        To report illegal content or abuse, email:{" "}
        <a href="mailto:abuse@gaygayfans.com" className="text-pink-400 hover:text-pink-300">
          abuse@gaygayfans.com
        </a>
      </p>
      <p>
        For emergencies involving the safety of minors, please also contact the{" "}
        <a
          href="https://www.missingkids.org/gethelpnow/cybertipline"
          className="text-pink-400 hover:text-pink-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          National Center for Missing & Exploited Children (NCMEC)
        </a>{" "}
        or your local law enforcement.
      </p>
    </LegalLayout>
  );
}
