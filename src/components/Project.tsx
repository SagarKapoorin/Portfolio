"use client";
import React, { useEffect, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Cards } from '@/components/Cards';
import img from '@/assets/Screenshot 2024-12-16 131253.webp';
import img2 from '@/assets/portfolio.webp';
import img3 from '@/assets/Screenshot 2024-12-16 144413.webp';
import img4 from '@/assets/Screenshot 2024-12-16 110927.webp';

const Project = () => {
    const technologies = [
        "Node.js",
        "Express",
        "TypeScript",
        "Socket.IO",
        "React",
        "Redux",
        "Redis",
        "MongoDB",
        "Docker",
        "GitHub Actions",
        "Jest"
      ];
      const technologies2 = [
        "Next.js",
        "TypeScript",
        "React",
        "PostgreSQL",
        "Redis",
        "Prisma",
        "Docker",
        "Razorpay",
        "PostHog",
        "GitHub Actions",
        "Tailwind CSS",
        ];
      const technologies3 = [
        "React.js",
        "Redux.js Toolkit",
        "Node.js",
        "Express",
        "MongoDB",
        "multer",
        "Material UI"
    ];
    const technologies4 = [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Node.js",
        "MongoDB",
        "Express.js",
        "Mongoose",
        "EJS"
    ];
    const [currentUrl, setCurrentUrl] = useState('');
    useEffect(() => {
      setCurrentUrl(window.location.href);
    }, []);
  return (
    <section className="portfolio-shell py-20">
      <div className="mb-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[#f7a501]">Selected work</p>
          <h2 className="portfolio-section-title mt-3">Projects with real product surface area.</h2>
        </div>
        <p className="portfolio-section-copy md:max-w-xl md:justify-self-end">
          Full-stack products, real-time systems, and user-facing applications built with modern web technologies.
        </p>
      </div>
      <div className='grid gap-5 md:grid-cols-2'>
        <Cards text='2D Multiverse' tags={technologies} imglink={img.src} desc='Real-time 2D collaborative playground with spaces, maps, elements, avatars, and live multi-user interaction, structured as a Turbo monorepo with caching, rate limiting, clustering, and CI/CD automation.' link='https://github.com/SagarKapoorin/2d-Multiverse' type='Personal'/>
        <Cards
          text='Portfolio Platform'
          tags={technologies2}
          imglink={img2.src}
          desc='Personal portfolio and hiring funnel with authentication, payments, hire requests, analytics, automated emails, background workers, webhook processing, rate limiting, caching, and database indexing.'
          link={currentUrl}
          type='Personal'
        />
        <Cards text='Socio-Pulse' tags={technologies3} imglink={img3.src} desc='Social platform built with React, Redux Toolkit, Node.js, Express, MongoDB, and Material UI for posts, media upload, and interactive community features.' link='https://github.com/SagarKapoorin/SocialPulse' type='Personal'/>
      <Cards text='EduCrafter' tags={technologies4} imglink={img4.src} desc='Interactive student portal with learning resources, server-rendered pages, MongoDB data models, and Express.js APIs for education workflows.' link='https://github.com/SagarKapoorin/Student_Portal' type='Personal'/>
      </div>
     <div className="flex items-center justify-center pt-8">
     <a
       href="https://github.com/SagarKapoorin/"
       target="_blank"
       rel="noopener noreferrer"
       className="portfolio-button-primary"
     >
         <Github className="h-5 w-5 text-gray-300" />
         <span className="font-medium text-gray-100">
          and many more on GitHub
         </span>
         <ExternalLink className="h-4 w-4 text-gray-200" />
     </a>
   </div>
   </section>
  )
}

export default Project
