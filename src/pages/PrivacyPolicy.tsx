import React from "react";
import { LockKeyhole } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container-custom py-14 max-w-2xl mx-auto">
      <div className="mx-auto mb-7 flex flex-col items-center">
        <LockKeyhole className="h-12 w-12 mb-3 text-[#00f7ff] drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold mb-2 text-[#00f7ff] tracking-tight">Privacy Policy</h1>
        <p className="text-base text-muted-foreground mb-2 text-center">
          Your privacy matters. Read about how we handle your data.
        </p>
      </div>
      <div className="prose prose-invert prose-lg rounded-2xl mx-auto px-6 py-8 bg-card/70 shadow-md border border-[#00f7ff]/10 backdrop-blur-md">
        <h2>1. Information We Collect</h2>
        <ul>
          <li>PlayVault may collect non-personal analytics such as device, browser type, and usage statistics to improve our Service.</li>
          <li>Personal data (such as email address) is collected only when you voluntarily provide it (e.g., newsletter subscription).</li>
        </ul>
        <h2>2. How We Use Information</h2>
        <ul>
          <li>To provide and improve the Service.</li>
          <li>To communicate updates, offers, or important changes (with your consent).</li>
          <li>We do not sell or rent your personal information to third parties.</li>
        </ul>
        <h2>3. Cookies</h2>
        <p>
          PlayVault may use cookies or similar technologies to enhance your experience or analyze usage patterns. You can disable cookies in your browser at any time.
        </p>
        <h2>4. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information but cannot guarantee absolute security.
        </p>
        <h2>5. Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites.
        </p>
        <h2>6. Children’s Privacy</h2>
        <p>
          PlayVault does not knowingly collect data from children under 13. If you believe we have unintentionally collected such data, contact us for removal.
        </p>
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy at any time. Please check this page regularly for changes.
        </p>
        <h2>8. Contact Us</h2>
        <p>
          For privacy questions, please contact <a href="mailto:privacy@playvault.games">privacy@playvault.games</a>.
        </p>
      </div>
    </div>
  );
}
