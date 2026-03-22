import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import QueryProvider from "@/components/shared/QueryProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { CustomToaster } from "@/components/ui/CustomToaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DetersiviParty | Pulizia Casa & Articoli Festa",
  description: "E-commerce locale per detersivi, igiene e tutto per i tuoi party. Ordina online e ritira in negozio!",
  keywords: ["detersivi", "festa", "party", "pulizia casa", "e-commerce locale"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body bg-background text-foreground transition-colors duration-300">
        <QueryProvider>
          <AuthProvider>
            {children}
            <CartDrawer />
            <CustomToaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
