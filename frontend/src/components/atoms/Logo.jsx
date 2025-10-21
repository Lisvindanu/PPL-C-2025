import React from 'react';

export default function Logo({ size = "md", className = "", ...props }) {
  const sizes = {
    sm: {
      container: "gap-1 p-2",
      icon: "w-6 h-6",
      text: "text-sm"
    },
    md: {
      container: "gap-2 p-4",
      icon: "w-8 h-8", 
      text: "text-base"
    },
    lg: {
      container: "gap-3 p-6",
      icon: "w-10 h-10",
      text: "text-lg"
    },
    xl: {
      container: "gap-4 p-8",
      icon: "w-12 h-12",
      text: "text-xl"
    }
  }

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`} {...props}>
      <div className={`${currentSize.icon} bg-teal-900 rounded-lg`}></div>
      <div>
        <div className={`text-teal-900 font-bold ${currentSize.text} leading-tight`}>Skill</div>
        <div className={`text-teal-900 font-bold ${currentSize.text} leading-tight`}>Connect</div>
      </div>
    </div>
  );
}
