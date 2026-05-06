import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Hire",
  description: "Hire Sagar Kapoor for full-stack, backend, and AI workflow engineering projects.",
  alternates: {
    canonical: "/hire",
  },
  openGraph: {
    url: `${siteUrl}/hire`,
    title: "Hire Sagar Kapoor",
    description: "Hire Sagar Kapoor for full-stack, backend, and AI workflow engineering projects.",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default async function HireLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/signin");
  }
  return <>{children}</>;
}