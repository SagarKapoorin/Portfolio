"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import MarqueeSection from '@/components/Marquee';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import Project from '@/components/Project';
import { Experience } from '@/components/Experience';
import Footer from '@/components/Footer';

const Home = () => {
  return (

      <div className="bg-black min-h-screen w-screen transition-opacity duration-1000 ease-in-out opacity-1 animate-fadeIn">
        <AnimatedBackground />
        <div className="flex justify-center flex-col items-center z-10">
          <h1 className="relative z-10 mt-[2rem] text-outline-double paint-order max-sm:text-6xl mid-sm:mid2-sm:text-10xl sm:text-9xl font-doner leading-[0.9] font-bold text-white tracking-tight text-center">
            SAGAR <br /> KAPOOR
          </h1>
        </div>
          <MarqueeSection />
          <Project/>
          <Experience/>
      </div>
  );
};

export default Home;
