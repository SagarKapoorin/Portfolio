"use client"
import React from 'react'
import { AboutMe } from '@/components/AboutMe'

const page = () => {

  return (
    <div className="min-h-screen w-full transition-opacity duration-1000 ease-in-out opacity-1 animate-fadeIn flex flex-col items-center">
      <AboutMe />
    </div>
  )
}

export default page
