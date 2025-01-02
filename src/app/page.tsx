"use client";

import AboutMe from '@/components/AboutMe';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import Header from '@/components/Header'
import MarqueeSection from '@/components/Marquee';
import { MarqueeDemo } from '@/components/Marquee_comment';
import React from 'react'
const Home = () => {
  return (
    <div className='bg-black h-screen w-screen'>
    <Header />
    <AnimatedBackground />
    <div className='flex justify-center flex-col items-center z-10'>
      <h1 className="text-7xl z-10 mt-[2rem] text-outline-double paint-order max-sm:text-6xl mid-sm:mid2-sm:text-10xl sm:text-9xl font-doner leading-[0.9] font-bold text-white tracking-tight text-center">
        SAGAR <br className="mt-[-0.5rem]" /> KAPOOR
      </h1>
    </div>
    <MarqueeSection/>
    <AboutMe/>
    </div>
  )
}

export default Home
