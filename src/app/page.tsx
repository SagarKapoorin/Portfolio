"use client";
import React from 'react';
import MarqueeSection from '@/components/Marquee';
import Project from '@/components/Project';
import { Experience } from '@/components/Experience';

const Home = () => {
  return (

      <div className="min-h-screen w-full transition-opacity duration-1000 ease-in-out opacity-1 animate-fadeIn flex flex-col items-center">
        <h1 className="mt-20 text-outline-double max-sm:text-6xl mid-sm:mid2-sm:text-10xl sm:text-9xl font-doner leading-[0.9] font-bold text-white tracking-tight text-center">
          SAGAR <br /> KAPOOR
        </h1>
        <div className="w-screen">
          <MarqueeSection />
        </div>
          <Project />
          <Experience />
      </div>
  );
};

export default Home;
