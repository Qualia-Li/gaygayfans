import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Policy — GaylyFans Creator & Upload Guidelines",
  description: "GaylyFans content policy. Our rules on what content is allowed and how we verify creators.",
};

export default function ContentPolicyPage() {
  return (
    <LegalLayout title="Content Policy">
      <p><strong>Last updated:</strong> February 22, 2026</p>

      <h2>1. Our Commitment</h2>
      <p>
        GaylyFans is committed to providing a safe, legal, and respectful platform
        for gay adult content. We take content moderation seriously and maintain strict
        guidelines to protect creators, performers, and viewers.
      </p>

      <h2>2. Allowed Content</h2>
      <p>We accept content that is:</p>
      <ul>
        <li>Created by or licensed to verified adult creators (18+)</li>
        <li>Featuring consenting adult performers with documented consent</li>
        <li>Gay male adult content including but not limited to solo, couples, and group content</li>
        <li>Compliant with all applicable laws</li>
      </ul>

      <h2>3. Prohibited Content</h2>
      <p>The following content is strictly prohibited and will be removed immediately:</p>
      <ul>
        <li><strong>Minors:</strong> Any content involving or depicting individuals under 18</li>
        <li><strong>Non-consensual:</strong> Content depicting rape, coercion, or any non-consensual acts</li>
        <li><strong>Unauthorized third-party content:</strong> Content ripped, stolen, or re-uploaded from other platforms without authorization</li>
        <li><strong>Revenge porn:</strong> Content shared without the knowledge or consent of the performers</li>
        <li><strong>Illegal acts:</strong> Content depicting illegal activities, bestiality, or extreme violence</li>
        <li><strong>Deepfakes:</strong> AI-generated or manipulated content depicting real individuals without consent</li>
        <li><strong>Hate content:</strong> Content promoting hatred, discrimination, or violence against any group</li>
      </ul>

      <h2>4. Creator Verification</h2>
      <p>
        All creators on GaylyFans must undergo identity verification. We require:
      </p>
      <ul>
        <li>Government-issued photo ID confirming age (18+)</li>
        <li>A selfie matching the ID for identity confirmation</li>
        <li>Signed consent and content ownership agreements</li>
        <li>2257 record-keeping compliance documentation</li>
      </ul>

      <h2>5. No Unauthorized Uploads</h2>
      <p>
        GaylyFans does not allow users to upload content from unauthorized third-party
        sources. All content must be original or properly licensed. We actively monitor
        for and remove pirated content.
      </p>

      <h2>6. Reporting Violations</h2>
      <p>
        If you encounter content that violates this policy, please report it immediately
        via our <a href="/contact" className="text-pink-400 hover:text-pink-300">Contact page</a>.
        We investigate all reports within 24 hours and take swift action.
      </p>

      <h2>7. Enforcement</h2>
      <p>Violations of this policy may result in:</p>
      <ul>
        <li>Immediate content removal</li>
        <li>Account suspension or permanent ban</li>
        <li>Reporting to law enforcement where applicable</li>
        <li>Legal action for intellectual property violations</li>
      </ul>
    </LegalLayout>
  );
}
