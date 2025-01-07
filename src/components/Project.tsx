import React, { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Cards } from '@/components/Cards';
import img from '@/assets/Screenshot 2024-12-16 131253.png'
import img2 from '@/assets/wyb.jpg'
import img3 from "@/assets/Screenshot 2024-12-16 144413.png"
import img4 from "@/assets/Screenshot 2024-12-16 110927.png"
import { Code2 } from 'lucide-react';

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
        "React",
        "Redux",
        "Material UI",
        "Tailwind CSS",
        "Canvas",
        "Javscript"
      ];
      const technologies3 = [
        "React.js",
        "Redux.js Toolkit",
        "Node.js",
        "Express",
        "Mongodb",
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
    const [isHovered, setIsHovered] = useState(false);
  return (
    <div>

      <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-900/20 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute right-10 top-0 w-16 h-16 bg-purple-900/20 rounded-full blur-xl opacity-60"></div>
          <div className="relative flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Featured Projects
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"></div>
            <p className="max-w-2xl text-gray-400 text-lg">
              Explore a collection of my latest work and creative endeavors
            </p>
          </div>
        </div>
      </div>
    <div className='flex flex-wrap justify-center items-start gap-16 h-full w-screen'>
        <Cards text='2D-Multiverse' tags={technologies} imglink={img.src} desc='  As the name suggests, a small 2D-World of characters showcasing a comprehensive implementation of modern web technologies' link='https://github.com/SagarKapoorin/2d-Multiverse' type='Personal'/>
        <Cards text='React-Games and Activities' tags={technologies2} imglink={img2.src} desc='Developed React Based Games and Activities during my Internship at WYB' link='https://link.wyb.social/dl/tt/H7GHM8' type='Corporate'/>
        <Cards text='Socio-Pulse' tags={technologies3} imglink={img3.src} desc='SocialPulse is a vibrant social platform designed to bring people together, fostering meaningful connections and engaging interactions' link='https://github.com/SagarKapoorin/SocialPulse' type='Personal'/>
      <Cards text='EduCrafter' tags={technologies4} imglink={img4.src} desc='Empower students with an interactive, all-in-one learning platform' link='https://github.com/SagarKapoorin/Student_Portal' type='Personal'/>
    </div>
     <div className="h-32 bg-[#0d1117] flex items-center justify-center p-8 !pt-0">
     <a
       href="https://github.com/SagarKapoorin/"
       target="_blank"
       rel="noopener noreferrer"
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       className="group relative overflow-hidden rounded-lg bg-[#21262d] px-6 py-3 shadow-lg transition-all duration-300 hover:bg-[#30363d]"
     >
       <div className="relative z-10 flex items-center gap-3">
         <Github className="h-5 w-5 text-gray-300" />
         <span className="font-medium text-gray-100">
          and many more on Github
         </span>
         <ExternalLink 
           className={`h-4 w-4 text-gray-400 transition-all duration-300 ${
             isHovered ? 'translate-x-1 -translate-y-1' : ''
           }`}
         />
       </div>
     </a>
   </div>
   </div>
  )
}

export default Project
