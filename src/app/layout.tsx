import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ToastContainer from "@/components/ui/Toast";
import ThemeProvider from "@/components/ui/ThemeProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "optional",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "optional",
});

export const metadata: Metadata = {
  title: {
    default: "Haute Pepper Soup",
    template: "%s | Haute Pepper Soup",
  },
  description:
    "Premium Nigerian pepper soup, delivered to your door. Handcrafted with the finest ingredients for an unforgettable taste of Lagos.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://hautepeppersoup.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Haute Pepper Soup",
    title: "Haute Pepper Soup",
    description:
      "Premium Nigerian pepper soup, delivered to your door. Handcrafted with the finest ingredients for an unforgettable taste of Lagos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haute Pepper Soup",
    description:
      "Premium Nigerian pepper soup, delivered to your door.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased font-[family-name:var(--font-dm-sans)]">
        <ThemeProvider>
          {/* Skip to main content link for keyboard/screen reader users */}
          <a
            href="#main-content"
            className="
              sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
              focus:inline-flex focus:h-10 focus:items-center focus:rounded-lg
              focus:bg-brand-lemon-dark focus:px-4 focus:text-sm focus:font-semibold
              focus:text-white dark:focus:bg-brand-lemon dark:focus:text-brand-dark
            "
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
