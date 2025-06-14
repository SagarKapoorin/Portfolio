import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from "@/assets/logo.webp"
import PostHogProvider from '@/components/PostHogProvider';
import Providers from '@/lib/providers';

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
            {children}
          </PostHogProvider>
        </Providers>
      </body>
    </html>
  );
}
