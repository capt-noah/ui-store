import React from 'react';

const Loader = ({ color = 'currentColor', size = 'w-2 h-2' }) => {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <div 
        className={`${size} rounded-full animate-bounce`} 
        style={{ backgroundColor: color, animationDelay: '0ms' }}
      ></div>
      <div 
        className={`${size} rounded-full animate-bounce`} 
        style={{ backgroundColor: color, animationDelay: '150ms' }}
      ></div>
      <div 
        className={`${size} rounded-full animate-bounce`} 
        style={{ backgroundColor: color, animationDelay: '300ms' }}
      ></div>
    </div>
  );
};

export default Loader;
