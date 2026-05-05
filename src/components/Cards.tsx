"use client";

import Image from "next/image";
import React from "react";
import { ArrowUpRight, Building2 } from "lucide-react";

interface CardsProps {
  text: string;
  desc: string;
  type: string;
  link: string;
  imglink: string;
  tags: string[];
}

export function Cards(props: CardsProps) {
  return (
    <article className="group portfolio-panel-flat overflow-hidden transition-colors duration-200 hover:border-[#5e6ad2]/70">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#23252a] bg-[#141516]">
        <Image
          src={props.imglink}
          height={1000}
          width={1000}
          className="h-full w-full object-cover opacity-88 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
          alt={`${props.text} preview`}
        />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-medium text-[#f7f8f8]">{props.text}</h3>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#34343a] bg-[#141516] px-2.5 py-1 text-xs text-[#d0d6e0]">
            <Building2 className="h-3 w-3 text-[#f7a501]" />
            {props.type}
          </span>
        </div>
        <p className="mt-4 min-h-[96px] text-sm leading-6 text-[#8a8f98]">{props.desc}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {props.tags.map((tag) => (
            <span key={tag} className="portfolio-tag">
              {tag}
            </span>
          ))}
        </div>
        <a href={props.link} target="_blank" rel="noopener noreferrer" className="portfolio-button-secondary mt-6 w-full">
          View project
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
