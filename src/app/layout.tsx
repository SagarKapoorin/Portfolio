import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from "@/assets/logo.webp";
import PostHogProvider from '@/components/PostHogProvider';
import Providers from '@/lib/providers';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={logo.src} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased`}
      >
        <Providers>
          <PostHogProvider>
            {/* Animated background on all pages */}
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              {/* Global header */}
              <Header />
              {/* Page content */}
              <main className="flex-grow">
                {children}
              </main>
              {/* Global footer */}
              <Footer />
            </div>
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
}
