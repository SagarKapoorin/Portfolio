import React from 'react';
import Marquee from 'react-fast-marquee';
import { Monitor, Server, Database, Terminal, Layers, Briefcase, Code } from 'lucide-react';

const items = [
  { text: 'Frontend', icon: Monitor },
  { text: 'Backend', icon: Server },
  { text: 'Database', icon: Database },
  { text: 'Full Stack', icon: Layers },
  { text: 'APIs', icon: Terminal },
  { text: 'Freelance', icon:Briefcase },
  { text: 'CP', icon: Code },
];

const MarqueeSection = () => {
  return (
    <div className="bg-transparent py-8 pb-0 overflow-hidden cursor-pointer pt-0 mt-4" >
      <Marquee
        gradient={true}
        gradientColor="17, 24, 39"
        gradientWidth={100}
        speed={20}
        pauseOnHover={true}
        className="py-4"
      >
        {items.concat(items).map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center mx-4 text-white/90 text-1xl"
            >
              <Icon className="w-6 h-6 mr-2" />
              <span className="text-1xl font-bold">{item.text}</span>
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
