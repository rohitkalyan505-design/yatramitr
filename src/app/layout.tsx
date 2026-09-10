import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import AskMitraWidget from "@/components/askmitra/AskMitraWidget";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Yatra Mitra | Discover Hyderabad beyond the usual",
  description:
    "A responsible-tourism platform for Hyderabad: 24 real heritage places, verified-workflow Mitras, fair price guidance, live trip safety and community impact.",
  keywords:
    "Hyderabad tourism, responsible tourism, Telangana heritage, local Mitras, fair price, Smart India Hackathon",
  openGraph: {
    title: "Yatra Mitra | Discover Hyderabad beyond the usual",
    description:
      "Meet local Mitras, discover 24 real places, and travel with fair prices and safety tools.",
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
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AskMitraWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
