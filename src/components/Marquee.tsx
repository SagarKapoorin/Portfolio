import React from 'react';
import Marquee from 'react-fast-marquee';
import { Monitor, Server, Database, Terminal, Layers, Briefcase, Code } from 'lucide-react';

const items = [
  { text: 'React', icon: Monitor },
  { text: 'Node.js', icon: Server },
  { text: 'PostgreSQL', icon: Database },
  { text: 'Full Stack', icon: Layers },
  { text: 'Java', icon: Terminal },
  { text: 'MongoDB', icon: Database },
  { text: 'Docker', icon: Briefcase },
  { text: 'Competitive Programming', icon: Code },
  { text: 'Redis', icon: Database },
  { text: 'Golang', icon: Terminal },
];

const MarqueeSection = () => {
  return (
    <div className="mt-16 overflow-hidden border-y border-[#23252a] bg-[#0f1011]/70 py-3 cursor-pointer" >
      <Marquee
        gradient={true}
        gradientColor="1, 1, 2"
        gradientWidth={90}
        speed={24}
        pauseOnHover={true}
        className="py-2"
      >
        {items.concat(items).map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="mx-3 flex items-center rounded-full border border-[#23252a] bg-[#141516] px-4 py-2 text-[#d0d6e0]"
            >
              <Icon className="mr-2 h-4 w-4 text-[#5e6ad2]" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          );
        })}
      </Marquee>
      <style>
        {`
          .react-fast-marquee::-webkit-scrollbar {
            display: none;
          }
          .react-fast-marquee {
            -ms-overflow-style: none; 
            scrollbar-width: none; 
          }
        `}
      </style>
    </div>
  );
};

export default MarqueeSection;
