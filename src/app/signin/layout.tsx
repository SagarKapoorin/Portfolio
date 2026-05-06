import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage hire requests, payments, and portfolio interactions.",
  alternates: {
    canonical: "/signin",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    url: `${siteUrl}/signin`,
    title: "Sign In | Sagar Kapoor",
    description: "Sign in to manage hire requests, payments, and portfolio interactions.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default function SignInLayout({ children }: { children: ReactNode }) {
  return children;
}

