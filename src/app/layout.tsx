import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from "@/assets/logo.webp";
import PostHogProvider from '@/components/PostHogProvider';
import Providers from '@/lib/providers';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';
import PageLoader from '@/components/PageLoader';

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
    <html lang="en" className="overflow-x-hidden">
      <head>
        <title>Sagar Kapoor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={logo.src} />
      </head>
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
        <Providers>
          <PostHogProvider>
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
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
