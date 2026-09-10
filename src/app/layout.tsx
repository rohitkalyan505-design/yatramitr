import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Yatra Mitra | Discover the Hidden Side of India",
  description: "Discover Hyderabad beyond the usual. Meet verified Local Mitras, discover hidden places, and experience authentic local stories.",
  keywords: "Hyderabad tourism, hidden Hyderabad, local Mitras, offbeat travel, authentic experiences, Smart India Hackathon",
  openGraph: {
    title: "Yatra Mitra | Discover the Hidden Side of India",
    description: "Go beyond crowded attractions. Discover lesser-known places and verified Local Buddies.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col paper-texture text-charcoal-900 selection:bg-terracotta-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
