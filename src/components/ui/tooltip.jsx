import React from 'react';

export function Tooltip({ children, content, position = 'top' }) {
  return (
    <div className="relative group">
      {children}
      <div className={`absolute hidden group-hover:block bg-slate-900 text-white text-sm rounded px-2 py-1 ${
        position === 'top' ? 'bottom-full mb-2' :
        position === 'bottom' ? 'top-full mt-2' :
        position === 'left' ? 'right-full mr-2' :
        'left-full ml-2'
      }`}>
        {content}
      </div>
    </div>
  );
}

export const TooltipProvider = ({ children }) => children;
export const TooltipTrigger = ({ children, asChild }) => children;
export const TooltipContent = ({ children }) => children;