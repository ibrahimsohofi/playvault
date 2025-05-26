import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const faqSections = [
  {
    title: "How do I disable my ad blocker for PlayVault?",
    id: "disable-adblocker",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          To access game downloads, you need to disable your ad blocker for our website. Here's how to do it for popular ad blockers:
        </p>
        
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold mb-2">uBlock Origin</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the uBlock Origin icon in your browser toolbar</li>
              <li>Click the "Power" button (or right-click and select "Disable on this site")</li>
              <li>Refresh the page</li>
            </ol>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold mb-2">AdBlock Plus</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the AdBlock Plus icon in your browser toolbar</li>
              <li>Click the "Don't run on this site" option</li>
              <li>Refresh the page</li>
            </ol>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold mb-2">AdGuard</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the AdGuard icon in your browser toolbar</li>
              <li>Click the "Disable on this site" option</li>
              <li>Refresh the page</li>
            </ol>
          </div>
        </div>

        <p className="text-muted-foreground">
          If you're still having issues, try:
        </p>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Clearing your browser cache</li>
          <li>Checking if you have multiple ad blockers installed</li>
          <li>Disabling any privacy extensions temporarily</li>
        </ul>
      </div>
    )
  },
  {
    title: "Why do I need to disable my ad blocker?",
    id: "why-adblocker",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          We use CPA offers to support our platform and keep all games free. These offers help us maintain our website and provide you with free game downloads. By completing these offers, you're helping us continue to offer free games to the community.
        </p>
        <p className="text-muted-foreground">
          Ad blockers prevent these offers from loading, which is why we need you to disable them temporarily while accessing game downloads.
        </p>
      </div>
    )
  },
  {
    title: "What if I can't access the download after disabling my ad blocker?",
    id: "download-issues",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          If you're still having trouble accessing downloads after disabling your ad blocker, try these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Clear your browser cache and cookies</li>
          <li>Try using a different browser</li>
          <li>Disable any privacy extensions temporarily</li>
          <li>Check if you have multiple ad blockers installed</li>
          <li>Try accessing the site in incognito/private mode</li>
        </ol>
        <p className="text-muted-foreground">
          If you're still having issues, please contact our support team through the contact form on our homepage.
        </p>
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
