import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-gray-300 z-10 mb-10 relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        
          <div className="hidden md:block"></div>
          <div className="hidden md:block"></div>
        </div>

        <div className="mt-12 pt-8">
          <div className="flex flex-col md:flex-col justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm mb-4">
              ©{currentYear} Sagar Kapoor. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#privacy"
                className="hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;