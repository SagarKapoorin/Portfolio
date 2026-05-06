import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Payments",
  description: "Payment history and transaction records for signed-in users.",
  alternates: {
    canonical: "/payments",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    url: `${siteUrl}/payments`,
    title: "Payments | Sagar Kapoor",
    description: "Payment history and transaction records for signed-in users.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default function PaymentsLayout({ children }: { children: ReactNode }) {
  return children;
}

