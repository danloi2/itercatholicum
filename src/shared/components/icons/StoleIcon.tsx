import React from 'react';

interface StoleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const StoleIcon = ({
  size = 60,
  color = 'currentColor',
  className,
  ...props
}: StoleIconProps) => (
  <svg
    width={size}
    height={size * 1.25} // Maintain 60:75 aspect ratio
    viewBox="0 0 32 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M8 4C8 2.34315 9.34315 1 11 1H21C22.6569 1 24 2.34315 24 4V36C24 37.6569 22.6569 39 21 39H18L16 35L14 39H11C9.34315 39 8 37.6569 8 36V4Z"
      fill={color}
      stroke="rgba(0,0,0,0.1)"
      strokeWidth="0.5"
    />
    <path d="M16 1V35M8 10H24M8 20H24M8 30H24" stroke="none" />
    {/* Large Central Cross in white */}
    <path d="M16 8V32M10 16H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
