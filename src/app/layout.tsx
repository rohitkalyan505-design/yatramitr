import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import AskMitraWidget from "@/components/askmitra/AskMitraWidget";
import BackToTop from "@/components/ui/BackToTop";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "YATRAMITR | Discover Hyderabad beyond the usual",
  description:
    "A responsible-tourism platform for Hyderabad: 24 real heritage places, verified-workflow Mitras, fair price guidance, live trip safety and community impact.",
  keywords:
    "Hyderabad tourism, responsible tourism, Telangana heritage, local Mitras, fair price, Smart India Hackathon",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "YATRAMITR | Discover Hyderabad beyond the usual",
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
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1D2521] selection:bg-terracotta-500 selection:text-white overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow bg-page-sand overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <AskMitraWidget />
          <BackToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
