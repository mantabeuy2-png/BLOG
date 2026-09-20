import React from 'react';

interface AgenxLogoProps {
  className?: string;
  size?: number;
}

export const AgenxLogo: React.FC<AgenxLogoProps> = ({ className = 'w-7 h-7', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="AGENX Logo"
    >
      {/* Left Deep Blue Chevron */}
      <path
        d="M 23 15 L 47 39 L 47 61 L 23 85 L 15 77 L 35 57 L 35 43 L 15 23 Z"
        fill="#085493"
      />
      {/* Right Vivid Crimson Chevron */}
      <path
        d="M 77 15 L 53 39 L 53 61 L 77 85 L 85 77 L 65 57 L 65 43 L 85 23 Z"
        fill="#E40046"
      />
    </svg>
  );
};
