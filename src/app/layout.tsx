import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import PostHogProvider from "@/components/PostHogProvider";
import Providers from "@/lib/providers";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import PageLoader from "@/components/PageLoader";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const title = "Sagar Kapoor | Full Stack Developer";
const description =
  "Full stack developer building AI-powered product systems with Go, TypeScript, React, Node.js, PostgreSQL, Redis, and analytics.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Sagar Kapoor",
  },
  description,
  keywords: [
    "Sagar Kapoor",
    "Full Stack Developer",
    "Next.js Portfolio",
    "Go Developer",
    "TypeScript Developer",
    "React",
    "Node.js",
    "PostgreSQL",
    "Redis",
    "AI product systems",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Sagar Kapoor Portfolio",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sagar Kapoor",
    jobTitle: "Full Stack Developer",
    url: siteUrl,
    email: "mailto:sagarbadal70@gmail.com",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Punjabi University, Patiala",
    },
    sameAs: [
      "https://www.linkedin.com/in/sagar-kapoor1/",
      "https://github.com/SagarKapoorin",
      "https://leetcode.com/SagarKa/",
      "https://codeforces.com/profile/BurningHash",
    ],
  };

  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased overflow-x-hidden`}
      >
        <PageLoader />
        <Script id="hide-loader" strategy="beforeInteractive">
          {`(function() {
             function hideLoader() {
               const loader = document.getElementById('page-loader');
               if (!loader) return;
               loader.style.transition = 'opacity 0.4s ease';
               loader.style.opacity = '0';
               setTimeout(() => loader.remove(), 400);
             }
             const loaderDelay = 500;
             if (document.readyState === 'complete') {
               setTimeout(hideLoader, loaderDelay);
             } else {
               window.addEventListener('load', function() {
                 setTimeout(hideLoader, loaderDelay);
               });
             }
           })();`}
        </Script>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <PostHogProvider>
            <AnimatedBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
            <main className="flex-grow">
              {children}
            </main>
              <Footer />
            </div>
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
}
