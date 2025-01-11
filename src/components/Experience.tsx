import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import img1 from "@/assets/wyb.jpg";
import img2 from "@/assets/develop2.png";
import img3 from "@/assets/start.webp";

export function Experience() {
  const data = [
    {
      title: "Novice Freelancer",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
            Developed various freelance projects such as a weather app, an assignment tracker, and a dashboard.
          </p>
          <div className="flex flex-wrap mb-6">
           
            <Image
              src={img2.src}
              alt="Work demo2"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "SDE Intern at WYB",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
            Start Internship at WYB onsite on Banglore , Developed React Based 7 games 3 activites and out of which 7 games and 3 activites are production ready.
          </p>
          <p className="text-white dark:text-neutral-200 text-sm md:text-base font-normal mb-8">
           Moreover Optimize and improve Performance of Games and Activites
            </p>
          <div className="flex mb-6">
            <Image
              src={img1.src}
              alt="cards template"
              width={800}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Started Learning in 2022",
      content: (
        <div>
          <p className="text-white dark:text-neutral-200 text-sm md:text-base font-normal mb-4">
            Started with MERN stack and CP in 2022 and go on hitting 1433 on Codeforce and 1836 on Leetcode
          </p>
         
          <div className="flex mb-6">
            <Image
              src={img3.src}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
           
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
        <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-900/20 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute right-10 top-0 w-16 h-16 bg-purple-900/20 rounded-full blur-xl opacity-60"></div>
          <div className="relative flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Experiences
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"></div>
          </div>
        </div>
      </div>
      <Timeline data={data} />
    </div>
  );
}
