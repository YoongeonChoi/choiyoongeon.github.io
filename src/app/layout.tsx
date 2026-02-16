import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { Footer } from "@/site/components/Footer";
import { Header } from "@/site/components/Header";
import { MotionBackdrop } from "@/site/components/MotionBackdrop";
import { contentSecurityPolicy } from "@/lib/security/csp";
import { siteConfig } from "@/site/config";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Yoongeon Choi",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ title: "RSS Feed", url: "/feed.xml" }],
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionBackdrop />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
