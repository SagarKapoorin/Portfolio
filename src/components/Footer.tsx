import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-[#23252a] bg-[#010102]">
      <div className="portfolio-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#f7f8f8]">Sagar Kapoor</p>
          <p className="mt-2 text-xs text-[#62666d]">
            Full Stack Developer · AI products · real-time systems
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-[#8a8f98]">
          <Link href="/" className="hover:text-[#f7f8f8]">Home</Link>
          <Link href="/aboutme" className="hover:text-[#f7f8f8]">About</Link>
          <Link href="/hire" className="hover:text-[#f7f8f8]">Hire</Link>
          <Link href="/buy-coffee" className="hover:text-[#f7f8f8]">Coffee</Link>
        </nav>
        <p className="text-xs text-[#62666d]">© {currentYear}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
