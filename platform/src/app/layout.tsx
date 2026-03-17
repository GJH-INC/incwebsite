import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "GJH INC — Strategic Consulting & AI-Powered Solutions",
    template: "%s | GJH INC",
  },
  description:
    "GJH INC delivers government contract consulting, AI solutions, data services, automation, and web development for federal, commercial, and non-profit organizations.",
  keywords: [
    "government contracting",
    "AI consulting",
    "data services",
    "automation",
    "8(a) certified",
    "HUBZone",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gjh-inc.com",
    siteName: "GJH INC",
    title: "GJH INC — Strategic Consulting & AI-Powered Solutions",
    description:
      "Autonomous AI-powered business development platform for government and commercial clients.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
