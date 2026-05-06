"use client";

import React, { useState } from "react";
import { Code, Code2, FileText, Github, Instagram, Linkedin, Mail, X } from "lucide-react";
import Form from "./Form";

interface SocialMediaProps {
  showContact?: boolean;
}

const SocialMedia = ({ showContact = true }: SocialMediaProps) => {
  const [contactOpen, setContactOpen] = useState(false);
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || "/SagarKapoor.pdf";
  const socialLinks = [
    {
      name: "Resume",
      icon: FileText,
      url: resumeUrl,
      stats: "Full Stack Developer and Competitive Programmer",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/SagarKapoorin",
      stats: "Full-stack projects and systems work",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/sagar-kapoor1/",
      stats: "Professional updates and experience",
    },
    {
      name: "Codeforces",
      icon: Code2,
      url: "https://codeforces.com/profile/BurningHash",
      stats: "Specialist, max rating 1436",
    },
    {
      name: "LeetCode",
      icon: Code,
      url: "https://leetcode.com/SagarKa/",
      stats: "1931 rating",
    },
    {
      name: "X",
      icon: X,
      url: "https://x.com/SagarKapoor37",
      stats: "Product and engineering updates",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/sagarkapoor123i",
      stats: "Personal updates",
    },
  ].filter((item) => item.url);

  return (
    <section className="portfolio-shell py-20">
      <div className="portfolio-panel overflow-hidden">
        <div className="grid gap-px bg-[#23252a] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-[#0f1011] p-6 md:p-8">
            <p className="font-mono text-xs uppercase text-[#f7a501]">Connect</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#f7f8f8]">
              Let&apos;s build something useful.
            </h2>
            <p className="mt-5 text-sm leading-6 text-[#8a8f98]">
              I am open to full-stack, backend, AI workflow, and product
              engineering opportunities.
            </p>
            {showContact && (
              <button
                type="button"
                onClick={() => setContactOpen((value) => !value)}
                className="portfolio-button-primary mt-7"
              >
                <Mail className="h-4 w-4" />
                {contactOpen ? "Close message form" : "Send direct message"}
              </button>
            )}
          </div>

          <div className="grid bg-[#0f1011] p-3 sm:grid-cols-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-lg border border-transparent p-4 transition-colors hover:border-[#34343a] hover:bg-[#141516]"
                >
                  <Icon className="h-5 w-5 text-[#5e6ad2] transition-colors group-hover:text-[#f7a501]" />
                  <h3 className="mt-4 text-base font-medium text-[#f7f8f8]">{social.name}</h3>
                  <p className="mt-2 text-sm leading-5 text-[#8a8f98]">{social.stats}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {showContact && contactOpen && (
        <div className="mt-6">
          <Form />
        </div>
      )}
    </section>
  );
};

export default SocialMedia;
