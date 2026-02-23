import LegalLayout from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — How GaylyFans Protects Your Data",
  description: "GaylyFans privacy policy. Learn how we collect, use, and protect your personal information. We collect minimal data and never sell it.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p><strong>Last updated:</strong> February 22, 2026</p>

      <h2>1. Information We Collect</h2>
      <p>
        GaylyFans collects minimal information to provide our service. We may collect:
      </p>
      <ul>
        <li>Browser type and version</li>
        <li>Pages visited and time spent</li>
        <li>Referring URL</li>
        <li>Device type and screen size</li>
        <li>IP address (anonymized for analytics)</li>
      </ul>
      <p>
        We do not require account creation to browse content. If you create an account
        in the future, we may collect your email address and display name.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide and improve the service</li>
        <li>Analyze usage patterns and optimize performance</li>
        <li>Ensure compliance with our content policy</li>
        <li>Prevent abuse and enforce our terms of service</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        We use essential cookies to remember your age verification status during your
        session. We may use analytics cookies to understand how visitors use our site.
        You can disable cookies in your browser settings.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We may use third-party services for hosting (Vercel), analytics, and content
        delivery. These services have their own privacy policies.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain anonymized analytics data for up to 12 months. We do not sell,
        trade, or share your personal information with third parties for marketing purposes.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request access to your personal data</li>
        <li>Request deletion of your personal data</li>
        <li>Opt out of analytics tracking</li>
        <li>Lodge a complaint with a supervisory authority</li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        For privacy-related inquiries, please visit our{" "}
        <a href="/contact" className="text-pink-400 hover:text-pink-300">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
