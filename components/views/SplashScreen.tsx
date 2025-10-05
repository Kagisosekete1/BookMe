

import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const title = "Book Me";
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1500); // Duration of the splash screen before fading

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 2000); // 1500ms wait + 500ms fade duration

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={`absolute inset-0 z-[1000] flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h1 className={`text-6xl font-bold text-black dark:text-white flex transition-transform duration-500 ${isFading ? 'scale-125' : 'scale-100'}`}>
        {title.split('').map((char, index) => {
          if (char === ' ') {
            return <span key={index} className="w-4"></span>;
          }
          return (
            <span
              key={index}
              className="netflix-letter"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {char}
            </span>
          );
        })}
      </h1>
    </div>
  );
};

export default SplashScreen;