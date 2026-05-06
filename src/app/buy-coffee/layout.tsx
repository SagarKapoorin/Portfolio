import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Buy Coffee",
  description: "Support Sagar Kapoor's work through the secure buy-me-a-coffee flow.",
  alternates: {
    canonical: "/buy-coffee",
  },
  openGraph: {
    url: `${siteUrl}/buy-coffee`,
    title: "Buy Coffee | Sagar Kapoor",
    description: "Support Sagar Kapoor's work through the secure buy-me-a-coffee flow.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default function BuyCoffeeLayout({ children }: { children: ReactNode }) {
  return children;
}

