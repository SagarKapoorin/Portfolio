"use client"
import React from 'react';
import { Github, Linkedin, Twitter, Code2, Code, Instagram,X ,FileText  } from 'lucide-react';
import { useState } from 'react';
import Form from './Form';

const SocialMedia = () => {
  const [contact,useContact]=useState(true);
  const socialLinks = [
    {
        name: 'Resume',
        icon: <FileText className="w-8 h-8" />, 
        url: 'https://drive.google.com/file/d/1w51uwLOzg7s4UEIxENLgn8T3MVmiI768/view?usp=sharing', 
        color: 'group-hover:text-white',
        default: 'text-purple-700',
        stats: 'Full Stack Developer and Competitive Programmer', 
       gradient: 'group-hover:from-[#9B4DCA]/90 group-hover:to-[#7B2CBF]/90'
      },      
    {
      name: 'GitHub',
      icon: <Github className="w-8 h-8" />,
      url: 'https://github.com/SagarKapoorin',
      color: 'group-hover:text-white',
      default: 'text-gray-700',
      stats: '1500+ contributions',
      gradient: 'group-hover:from-[#2b3137]/90 group-hover:to-[#2b3137]/90'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-8 h-8" />,
      url: 'https://www.linkedin.com/in/sagar-kapoor1/',
      color: 'group-hover:text-white',
      default: 'text-[#00a0dc]',
      stats: '300+ connections',
      gradient: 'group-hover:from-[#00a0dc]/90 group-hover:to-[#00a0dc]/90'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-8 h-8" />,
      url: 'https://www.instagram.com/sagarkapoor123i',
      color: 'group-hover:text-white',
      default: 'text-[#ff3e9d]',
      stats: 'Not have much Followers :)',
      gradient: 'group-hover:from-[#ff3e9d]/90 group-hover:to-[#ff3e9d]/90'
    },
    {
        name: 'X',
        icon: <X className="w-8 h-8"/>,
        url: 'https://x.com/SagarKapoor37',
        color: 'group-hover:text-white',
        default: 'text-gray-800',
        stats: 'Post My Work Daily',
        gradient: 'group-hover:from-gray-700 group-hover:to-gray-900'
      }
      ,
    {
        name: 'CodeForces',
        icon: <Code2 className="w-8 h-8" />,
        url: 'https://codeforces.com/profile/BurningHash',
        color: 'group-hover:text-white',
        default: 'text-[#1f8acb]',
        stats: 'Specialist (1433)',
        gradient: 'group-hover:from-[#1f8acb]/90 group-hover:to-[#1855b3]/90'
      },
    {
      name: 'LeetCode',
      icon: <Code className="w-8 h-8" />,
      url: 'https://leetcode.com/SagarKa/',
      color: 'group-hover:text-white',
      default: 'text-[#ffa116]',
      stats: '1836 Rating',
      gradient: 'group-hover:from-[#ffa116]/90 group-hover:to-[#ffa116]/90'
    }
  ];

  return (
    <section className="min-h-screen text-gray-800 py-0 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-[250px] -left-[250px] rounded-full blur-[128px]" />
        <div className="absolute w-[500px] h-[500px] -bottom-[250px] -right-[250px] rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient bg-300% pb-2">
            Connect With Me
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Let's collaborate and build something amazing together. Find me on these platforms and let's connect!
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-[340px] "
            >
              <div className={`relative bg-white backdrop-blur-xl rounded-2xl p-6 
                transform transition-all duration-500 hover:scale-105 
                border border-gray-200 hover:border-transparent
                shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]
                bg-gradient-to-br ${social.gradient}`}>
                <div className="relative flex items-center space-x-4">
                  <div className={`transition-all duration-500 ${social.color} ${social.default} group-hover:scale-110 
                    p-3 bg-gray-100 group-hover:bg-white/10 rounded-xl`}>
                    {social.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${social.default} group-hover:text-white transition-colors duration-300`}>
                      {social.name}
                    </h3>
                    <p className={`${social.default} group-hover:text-white/80 text-sm transition-colors duration-300`}>
                      {social.stats}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-gray-500 group-hover:text-white/80 text-sm">
                  <span className="opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Profile →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
    
     <div className="mt-20 text-center relative">
     {!contact &&<Form/>}
          <a
          onClick={(e) => {
            e.preventDefault(); 
            useContact(!contact);
          }}
      
            className="inline-block mt-6 px-8 py-4 rounded-2xl cursor-pointer bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500 bg-300% 
              text-white font-medium hover:shadow-lg hover:shadow-pink-500/20 
              transition-all duration-300 transform hover:scale-105 animate-gradient"
          >
               {contact?"Or Send Me Direct Message":"Cancel"}
          </a>
        </div>  
      </div>
    </section>
  );
};

export default SocialMedia;
