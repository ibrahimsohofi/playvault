import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const faqSections = [
  {
    title: "How do I download games from PlayVault?",
    id: "how-to-download",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Downloading games from PlayVault is simple and straightforward:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Browse our game collection or use the search feature to find your desired game</li>
          <li>Click on the game to view its details page</li>
          <li>Click the "Download" button to access the download link</li>
          <li>Follow the installation instructions provided for your device</li>
        </ol>
        <p className="text-muted-foreground">
          All our games are carefully curated and safe to download. Make sure you have enough storage space on your device before downloading.
        </p>
      </div>
    )
  },
  {
    title: "Are the games on PlayVault safe and virus-free?",
    id: "game-safety",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Yes, we take game safety seriously. All games on PlayVault are:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Thoroughly tested before being added to our platform</li>
          <li>Scanned for malware and viruses</li>
          <li>Sourced from reputable developers and publishers</li>
          <li>Regularly updated to ensure compatibility and security</li>
        </ul>
        <p className="text-muted-foreground">
          However, we always recommend keeping your device's security software up to date as an additional precaution.
        </p>
      </div>
    )
  },
  {
    title: "What if I'm having trouble downloading or installing a game?",
    id: "download-issues",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          If you're experiencing issues with downloading or installing games, try these troubleshooting steps:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check your internet connection and try again</li>
          <li>Clear your browser cache and cookies</li>
          <li>Ensure you have sufficient storage space on your device</li>
          <li>Try using a different browser</li>
          <li>Check if your device meets the game's system requirements</li>
          <li>Temporarily disable any VPN or proxy connections</li>
        </ol>
        <p className="text-muted-foreground">
          If you're still having issues, please contact our support team through the contact form on our homepage.
        </p>
      </div>
    )
  },
  {
    title: "Do you support mobile games for both Android and iOS?",
    id: "platform-support",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          PlayVault primarily focuses on Android games, offering a wide variety of premium mobile games for Android devices.
        </p>
        <p className="text-muted-foreground">
          For iOS games, availability may be limited due to Apple's app distribution policies. We recommend checking each game's details page for specific platform compatibility information.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Android: Full support with regular updates</li>
          <li>iOS: Limited availability based on developer distribution</li>
          <li>Cross-platform games: Available where supported</li>
        </ul>
      </div>
    )
  }
];

export function FaqPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionToggle = (sectionId: string) => {
    setActiveSection(prev => prev === sectionId ? null : sectionId);
  };

  return (
    <div className="container-custom py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

        <div className="space-y-6">
          {faqSections.map((section) => (
            <div key={section.id} className="bg-card/70 backdrop-blur-sm border border-[#00f7ff]/20 rounded-lg">
              <button
                onClick={() => handleSectionToggle(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-card/80 transition-colors"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <X
                  className={cn(
                    "h-5 w-5 transition-transform",
                    activeSection === section.id ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  activeSection === section.id ? "max-h-[500px]" : "max-h-0"
                )}
              >
                <div className="p-4 border-t border-[#00f7ff]/20">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqPage;
