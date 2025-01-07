"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Building2 } from "lucide-react";

interface CardsProps {
 text:string,
 desc:string,
 type:string,
 link:string,
 imglink:string,
 tags:string[]
}

export function Cards(props: CardsProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card w-auto sm:w-[30rem] h-auto rounded-2xl p-8 
        bg-gradient-to-br from-indigo-50 via-white to-purple-50
        dark:from-gray-900 dark:via-gray-800 dark:to-slate-900
        border border-opacity-10 border-white
        dark:border-opacity-20 dark:border-gray-700
        shadow-lg shadow-indigo-100/20 dark:shadow-none
        backdrop-blur-sm
        transition-all duration-300
        dark:hover:shadow-2xl dark:hover:shadow-purple-500/20
        hover:shadow-xl hover:shadow-indigo-200/40
        hover:border-opacity-20 dark:hover:border-opacity-30">
        <CardItem
          translateZ="50"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600
            dark:from-indigo-400 dark:to-purple-400 whitespace-nowrap"
        >
          {props.text} &nbsp; &nbsp;
          <span className="inline-flex items-center gap-1 px-2 py-0.5 
        text-xs font-medium tracking-wide
        bg-black
        text-white
        border border-black/20
        shadow-[0_2px_10px_-3px_rgba(0,0,0,0.2)]
        rounded-full
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.25)]
        hover:border-black/30
        cursor-pointer
        backdrop-blur-md">
        <Building2 className="w-3 h-3 stroke-white" />
        {props.type}
      </span>
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-slate-600 text-sm max-w-sm mt-3 leading-relaxed
            dark:text-slate-300"
        >
      {props.desc}    
          </CardItem>
        <CardItem translateZ="100" className="w-full mt-6">
          <div className="relative group">
            <Image
              src={props.imglink}
              height="1000"
              width="1000"
              className="h-100 w-full object-cover rounded-xl 
                transform transition-all duration-300
                group-hover/card:shadow-xl group-hover/card:shadow-indigo-200/40
                dark:group-hover/card:shadow-purple-500/20
                ring-1 ring-black/5 dark:ring-white/10"
              alt="thumbnail"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </CardItem>
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            {props.tags.map((tag, index) => (
                <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 
                        text-xs font-medium tracking-wide
                        bg-white
                        text-black
                        border-2 black
                        shadow-[0_2px_10px_-3px_rgba(0,0,0,0.2)]
                        rounded-full
                        transition-all duration-300 ease-in-out
                        hover:scale-105 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.25)]
                        backdrop-blur-md"
                >
                    {tag}
                </span>
            ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as="button"
            onClick={()=>window.location.href = props.link}
            className="w-4/5 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-indigo-600 to-purple-600
              dark:from-indigo-500 dark:to-purple-500
              text-white
              hover:opacity-90
              transition-opacity duration-200
              shadow-lg shadow-indigo-500/20 dark:shadow-purple-500/20
              mx-auto"
          >
         Try now &nbsp;
         <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}