import Image from "next/image";
import sagar1 from "@/assets/sagar1.webp";
import sagar2 from "@/assets/sagar2.webp";
import sagar3 from "@/assets/sagar3.webp";
import sagar4 from "@/assets/sagar4.webp";
import SocialMedia from "./SocialMedia";

const highlights = [
  {
    title: "Competitive programming foundation",
    copy: "LeetCode rating 1931, Codeforces Specialist with a maximum rating of 1436, and 200+ solved problems.",
  },
  {
    title: "Full-stack product delivery",
    copy: "Frontend interfaces, backend APIs, background workers, analytics, auth, payments, and CI/CD workflows.",
  },
  {
    title: "AI and data-heavy systems",
    copy: "AI camera incident workflows, no-code rule configuration, VLM product flows, RAG memory connectors, and ClickHouse dashboards.",
  },
];

const images = [sagar1, sagar2, sagar3, sagar4];

export function AboutMe() {
  return (
    <>
      <section className="portfolio-shell py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase text-[#f7a501]">About</p>
            <h1 className="mt-3 text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-normal text-[#f7f8f8]">
              I build practical software with product taste and systems depth.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#8a8f98]">
              I am a full-stack developer comfortable across frontend development,
              backend systems, performance optimization, CI/CD, and end-to-end
              delivery for AI-powered and customer-facing applications.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div
                key={image.src}
                className={`overflow-hidden rounded-xl border border-[#23252a] bg-[#141516] ${
                  index === 0 || index === 3 ? "aspect-[4/5]" : "aspect-square"
                }`}
              >
                <Image
                  src={image.src}
                  alt={`Sagar Kapoor portrait ${index + 1}`}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover opacity-92"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="portfolio-panel-flat p-6">
              <h2 className="text-xl font-medium text-[#f7f8f8]">{item.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[#8a8f98]">{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="portfolio-panel mt-14 p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="font-mono text-xs uppercase text-[#f7a501]">Working style</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#f7f8f8]">I care about clear interfaces and reliable systems.</h2>
            </div>
            <div className="grid gap-4 text-sm leading-7 text-[#8a8f98]">
              <p>
                My strongest work sits where product UI meets backend reliability:
                alerting systems, dashboards, APIs, caching, queues, and flows
                that help users operate software without friction.
              </p>
              <p>
                Outside engineering, I follow football and enjoy games, but the
                main focus stays the same: building software that is fast,
                understandable, and useful to real users.
              </p>
            </div>
          </div>
        </div>
      </section>
      <SocialMedia showContact={false} />
    </>
  );
}
