"use client"
import { AboutMe } from '@/components/AboutMe'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import Header from '@/components/Header'
import React from 'react'
import Footer from '@/components/Footer'

const page = () => {

  return (
    <div className="bg-black min-h-screen w-screen transition-opacity duration-1000 ease-in-out opacity-1 animate-fadeIn">
    <Header />
    <AnimatedBackground />
    <AboutMe/>
    <Footer/>
  </div>
  )
}

export default page
