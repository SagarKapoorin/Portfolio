"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Briefcase,
  Coffee,
  CreditCard,
  Download,
  FolderKanban,
  Home,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/aboutme", label: "About", icon: User },
  { href: "/work", label: "Work", icon: FolderKanban },
  { href: "/hire", label: "Hire", icon: Briefcase },
  { href: "/buy-coffee", label: "Coffee", icon: Coffee },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || "/SagarKapoor.pdf";

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-[2000] border-b border-white/[0.06] bg-[#010102]/78 backdrop-blur-xl">
      <div className="portfolio-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#34343a] bg-[#0f1011] text-sm font-semibold text-[#f7a501]">
            SK
          </span>
          <span className="hidden text-sm font-medium text-[#f7f8f8] sm:block">
            Sagar Kapoor
          </span>
        </Link>

        <nav className="hidden items-center rounded-lg border border-[#23252a] bg-[#0f1011]/80 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-[#18191a] text-[#f7f8f8]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="portfolio-button-secondary">
              <Download className="h-4 w-4" />
              Resume
            </a>
          )}
          {status === "authenticated" ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="portfolio-button-primary">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          ) : (
            pathname !== "/signin" && (
              <button onClick={() => router.push("/signin")} className="portfolio-button-primary">
                <LogIn className="h-4 w-4" />
                Sign in
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#23252a] bg-[#0f1011] text-white md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[2200] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute right-3 top-3 w-[calc(100vw-24px)] max-w-sm rounded-xl border border-[#23252a] bg-[#0f1011] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#f7f8f8]">Navigation</span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#23252a] text-[#d0d6e0]"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm ${
                      isActive(item.href)
                        ? "bg-[#18191a] text-white"
                        : "text-[#8a8f98] hover:bg-[#141516] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-[#23252a] pt-4">
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="portfolio-button-secondary w-full">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              )}
              {status === "authenticated" ? (
                <button onClick={() => signOut({ callbackUrl: "/" })} className="portfolio-button-primary w-full">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/signin");
                  }}
                  className="portfolio-button-primary w-full"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </button>
              )}
            </div>
            {session?.user?.email && (
              <p className="mt-3 truncate text-xs text-[#62666d]">{session.user.email}</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
