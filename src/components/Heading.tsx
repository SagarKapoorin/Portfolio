import React from 'react';

type HeadingProps = {
  heading: string;
};

const Heading: React.FC<HeadingProps> = ({ heading }) => {
  return (
    <div className="relative">
      <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-900/20 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute right-10 top-0 w-16 h-16 bg-purple-900/20 rounded-full blur-xl opacity-60"></div>
      <div className="relative flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {heading}
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-0"></div>
      </div>
    </div>
  );
};

export default Heading;
