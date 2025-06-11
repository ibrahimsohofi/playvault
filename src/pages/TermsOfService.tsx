import React from "react";
import { ShieldCheck } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="container-custom py-14 max-w-2xl mx-auto">
      <div className="mx-auto mb-7 flex flex-col items-center">
        <ShieldCheck className="h-12 w-12 mb-3 text-[#00f7ff] drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold mb-2 text-[#00f7ff] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-base text-muted-foreground mb-2 text-center">
          Please read these terms carefully before using PlayVault.
        </p>
      </div>
      <div className="prose prose-invert prose-lg rounded-2xl mx-auto px-6 py-8 bg-card/70 shadow-md border border-[#00f7ff]/10 backdrop-blur-md">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using PlayVault ("the Service"), you agree to comply
          with and be bound by these Terms of Service. If you do not agree to these terms,
          please do not use our platform.
        </p>
        <h2>2. Use of the Service</h2>
        <ul>
          <li>The Service is intended for personal, non-commercial use only.</li>
          <li>You agree not to misuse, duplicate, or distribute any content found on PlayVault without permission.</li>
          <li>All downloads provided are for personal use—redistribution is strictly forbidden.</li>
        </ul>
        <h2>3. Game Content</h2>
        <ul>
          <li>Game files and content are provided "as-is." PlayVault is not responsible for accuracy, completeness, or reliability of content.</li>
          <li>We do not guarantee that files or downloads are virus-free. Use at your own risk.</li>
        </ul>
        <h2>4. User Accounts</h2>
        <ul>
          <li>You are responsible for maintaining the security of your account and activity.</li>
          <li>Accounts found violating these terms may be suspended or removed.</li>
        </ul>
        <h2>5. Limitation of Liability</h2>
        <p>
          PlayVault is not liable for any damages or losses, direct or indirect,
          resulting from your use of the Service or content downloaded from this site.
        </p>
        <h2>6. Changes to Terms</h2>
        <p>
          PlayVault reserves the right to change these Terms at any time. We recommend checking this page regularly for updates.
        </p>
        <h2>7. Contact Us</h2>
        <p>
          For questions regarding these Terms, contact us at <a href="mailto:info@playvault.games">info@playvault.games</a>.
        </p>
      </div>
    </div>
  );
}
