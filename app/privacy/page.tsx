// app/privacy/page.tsx
import type { Metadata } from "next";
import PrivacySection from "@/components/privacy/PrivacySection";

export const metadata: Metadata = {
    title: "Privacy Policy | Computational Intelligence Lab",
    description:
        "How the Computational Intelligence Lab collects, uses and protects your information, including accounts, uploads, paper access requests and cookies.",
};

export default function PrivacyPage() {
    return <PrivacySection />;
}
