"use client";
import React from 'react';

export default function PageLoader() {
  return (
    <div id="page-loader" className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="loader">
        {/* SVG definitions for gradients */}
        <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
          <defs xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#973BED" />
              <stop offset="1" stopColor="#007CFF" />
            </linearGradient>
            <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="0" y2="0">
              <stop stopColor="#FFC800" />
              <stop offset="1" stopColor="#F0F">
                <animateTransform
                  attributeName="gradientTransform"
                  type="rotate"
                  values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                  keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
                  keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#00E0ED" />
              <stop offset="1" stopColor="#00DA72" />
            </linearGradient>
          </defs>
        </svg>
        {/* Letter shapes: S -> A -> G -> A -> R  can be adjusted with <text> or custom paths */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
          <text
            x="0"
            y="50"
            fontSize="64"
            fontFamily="sans-serif"
            className="dash"
            stroke="url(#b)"
            strokeWidth="8"
            pathLength="360"
          >
            S
          </text>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
          <text
            x="0"
            y="50"
            fontSize="64"
            fontFamily="sans-serif"
            className="dash"
            stroke="url(#c)"
            strokeWidth="8"
            pathLength="360"
          >
            A
          </text>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
          <text
            x="0"
            y="50"
            fontSize="64"
            fontFamily="sans-serif"
            className="dash"
            stroke="url(#d)"
            strokeWidth="8"
            pathLength="360"
          >
            G
          </text>
        </svg>
        <div className="w-2"></div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
          <text
            x="0"
            y="50"
            fontSize="64"
            fontFamily="sans-serif"
            className="dash"
            stroke="url(#b)"
            strokeWidth="8"
            pathLength="360"
          >
            A
          </text>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
          <text
            x="0"
            y="50"
            fontSize="64"
            fontFamily="sans-serif"
            className="dash"
            stroke="url(#c)"
            strokeWidth="8"
            pathLength="360"
          >
            R
          </text>
        </svg>
      </div>
    </div>
  );
}