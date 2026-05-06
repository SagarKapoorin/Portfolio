import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "About",
  description: "About Sagar Kapoor, full stack developer and systems-focused engineer.",
  alternates: {
    canonical: "/aboutme",
  },
  openGraph: {
    url: `${siteUrl}/aboutme`,
    title: "About | Sagar Kapoor",
    description: "About Sagar Kapoor, full stack developer and systems-focused engineer.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}

