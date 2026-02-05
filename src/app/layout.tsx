import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Yoongeon Choi | Full-Stack Developer & Designer",
    template: "%s | Yoongeon Choi",
  },
  description:
    "Personal portfolio and blog of Yoongeon Choi. Showcasing projects in web development, UI/UX design, and creative engineering.",
  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "UI/UX Designer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Yoongeon Choi" }],
  creator: "Yoongeon Choi",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://choiyoongeon.github.io",
    siteName: "Yoongeon Choi",
    title: "Yoongeon Choi | Full-Stack Developer & Designer",
    description:
      "Personal portfolio and blog showcasing projects in web development and design.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yoongeon Choi Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoongeon Choi | Full-Stack Developer & Designer",
    description:
      "Personal portfolio and blog showcasing projects in web development and design.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://api.github.com" />
      </head>
      <body className="min-h-screen bg-surface-primary text-text-primary antialiased">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-accent-primary focus:text-surface-primary"
        >
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}
