import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import img from '../assets/profile.svg';

const AboutMe = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Hii, I'm Sagar Kapoor, a passionate developer with a keen interest in problem-solving and building innovative solutions. I enjoy exploring new technologies, collaborating with teams, and contributing to open-source projects. When not coding, you'll find me solving challenges on platforms like LeetCode.";

  useEffect(() => {
    console.log(img);
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length-1) {
        setDisplayText((prev) => prev + fullText[index]);
        console.log(fullText.length);
        console.log(index);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <StyledWrapper className='flex items-center justify-center h-screen'>
      <div className="z-10 w-1/2 pt-10">
        <img src={img.src} alt="Sagar Kapoor" className="w-full" /> 
      </div>
      <div className="card">
        <div className="terminal">
          <div className="terminal-header">
            <span className="terminal-title">
              <svg className="terminal-icon" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 17l6-6-6-6M12 19h8" />
              </svg>
              About me
            </span>
          </div>
          <div className="terminal-body">
            <div className="command-line">
              <span className="prompt whitespace-nowrap">About me:</span>
              <span className="input-field whitespace-nowrap ">cat About_me.txt</span>
            </div>
            <div className="loading-text">
              <p className="mt-4 text-gray-300 leading-relaxed bold">
                {displayText.split(' ').map((word, index) => (
                  <span key={index} className={word.includes('Sagar Kapoor') || word.includes('problem-solving') || word.includes('innovative solutions') || word.includes('open-source projects') || word.includes('LeetCode') ? 'text-indigo-400' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
     
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    background-color: rgba(217, 217, 217, 0.18);
    backdrop-filter: blur(8px);
    margin-left:30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 40%;
  }

  .terminal-header {
    background-color: #202425;
    padding: 10px 15px;
    display: flex;
    align-items: center;
  }

  .terminal-title {
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .terminal-icon {
    color: #006adc;
  }

  .terminal-body {
    background-color: #202425;
    color: #ffffff;
    padding: 15px;
    font-family: "Courier New", Courier, monospace;
  }

  .command-line {
    display: flex;
    align-items: center;
  }

  .prompt {
    color: #ffffff;
    margin-right: 10px;
  }

  .input-wrapper {
    position: relative;
    flex-grow: 1;
  }

  .input-field {
    background-color: transparent;
    border: none;
    color: #006adc;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    width: 100%;
    padding-right: 10px;
  }

  .input-field::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .loading-text {
    margin-top: 10px;
  }

  .input-wrapper::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 15px;
    background-color: #ffffff;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

export default AboutMe;
