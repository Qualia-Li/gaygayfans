import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GayGayFans Usage Rules & Guidelines",
  description: "GayGayFans terms of service. Rules for using our gay adult video platform including age requirements, prohibited conduct, and DMCA process.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p><strong>Last updated:</strong> February 22, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing GayGayFans, you agree to these Terms of Service. If you do not
        agree, you must leave the site immediately.
      </p>

      <h2>2. Age Requirement</h2>
      <p>
        You must be at least 18 years old (or the age of majority in your jurisdiction,
        whichever is higher) to access this site. By entering the site, you confirm that
        you meet this requirement.
      </p>

      <h2>3. Content</h2>
      <p>
        GayGayFans hosts adult content intended for gay men. All content on this platform
        is curated and verified by our team. We do not allow:
      </p>
      <ul>
        <li>Content involving minors in any capacity</li>
        <li>Non-consensual content or content depicting non-consent</li>
        <li>Content uploaded from unauthorized third-party sources</li>
        <li>Content that violates intellectual property rights</li>
        <li>Content depicting illegal activities</li>
        <li>Revenge porn or content shared without performer consent</li>
      </ul>

      <h2>4. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Download, redistribute, or re-upload content from this site</li>
        <li>Attempt to circumvent the age verification system</li>
        <li>Use automated tools to scrape or crawl the site</li>
        <li>Harass, threaten, or abuse other users or creators</li>
        <li>Misrepresent your identity or impersonate others</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on GayGayFans is owned by or licensed to us or our creators.
        Unauthorized reproduction, distribution, or modification is strictly prohibited.
      </p>

      <h2>6. DMCA / Takedown Requests</h2>
      <p>
        If you believe content on our platform infringes your copyright, please contact
        us via our <a href="/contact" className="text-pink-400 hover:text-pink-300">Contact page</a> with:
      </p>
      <ul>
        <li>A description of the copyrighted work</li>
        <li>The URL of the infringing content</li>
        <li>Your contact information</li>
        <li>A statement of good faith belief</li>
      </ul>

      <h2>7. Disclaimer</h2>
      <p>
        GayGayFans is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
        responsible for any damages arising from your use of the site.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These terms are governed by applicable laws. Any disputes shall be resolved
        in the appropriate jurisdiction.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We may update these terms at any time. Continued use of the site after changes
        constitutes acceptance of the new terms.
      </p>
    </LegalLayout>
  );
}
