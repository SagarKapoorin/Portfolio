import React from 'react';

type HeadingProps = {
  heading: string;
};

const Heading: React.FC<HeadingProps> = ({ heading }) => {
  return (
    <div className="relative">
      <div className="relative flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-[#f7f8f8]">
          {heading}
        </h2>
        <div className="mt-5 h-px w-24 bg-[#5e6ad2]" />
      </div>
    </div>
  );
};

export default Heading;
