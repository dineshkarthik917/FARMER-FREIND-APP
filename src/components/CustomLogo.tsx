import React from 'react';

interface CustomLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const CustomLogo: React.FC<CustomLogoProps> = ({
  size = 64,
  className = '',
  animate = false
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Circular Dark Green Badge */}
        <circle cx="50" cy="50" r="48" fill="#1B5E20" stroke="#66BB6A" strokeWidth="2.5" />
        
        {/* Soft Yellow Sunrise Behind Plant */}
        <circle cx="50" cy="44" r="22" fill="#FBC02D" opacity="0.95" />
        <path
          d="M32 44 C32 34 68 34 68 44 Z"
          fill="#FFF9C4"
          opacity="0.6"
        />

        {/* Sunrise Rays subtle */}
        <line x1="50" y1="18" x2="50" y2="23" stroke="#FBC02D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="26" x2="36" y2="30" stroke="#FBC02D" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="26" x2="64" y2="30" stroke="#FBC02D" strokeWidth="2.5" strokeLinecap="round" />

        {/* Green Sprouting Plant with Stems and Leaves */}
        <path
          d="M50 72 Q50 56 50 42"
          stroke="#2E7D32"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Left Sprout Leaf */}
        <path
          d="M50 54 C40 50 34 40 40 32 C48 34 50 46 50 54 Z"
          fill="#66BB6A"
          stroke="#2E7D32"
          strokeWidth="1.5"
        />
        {/* Right Sprout Leaf */}
        <path
          d="M50 48 C60 44 66 34 60 26 C52 28 50 40 50 48 Z"
          fill="#81C784"
          stroke="#2E7D32"
          strokeWidth="1.5"
        />

        {/* Soil Base / Field Furrow */}
        <path
          d="M20 74 Q50 64 80 74 L80 82 Q50 78 20 82 Z"
          fill="#795548"
        />
        <path
          d="M24 78 Q50 70 76 78"
          stroke="#5D4037"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Small Friendly Farmer Straw Hat Silhouette resting at bottom right */}
        <g transform="translate(56, 56) scale(0.65)">
          {/* Hat Brim */}
          <ellipse cx="20" cy="18" rx="20" ry="7" fill="#FBC02D" stroke="#E65100" strokeWidth="1.2" />
          {/* Hat Crown */}
          <path
            d="M8 18 C8 8 32 8 32 18 Z"
            fill="#FFF176"
            stroke="#E65100"
            strokeWidth="1.2"
          />
          {/* Hat Band */}
          <path
            d="M9 16 C14 14 26 14 31 16"
            stroke="#795548"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
