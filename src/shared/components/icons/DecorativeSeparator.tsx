import React from 'react';

interface DecorativeSeparatorProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const DecorativeSeparator = ({
  width = 100,
  height = 20,
  color = '#8B0000',
  className,
  ...props
}: DecorativeSeparatorProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M0 10C20 10 30 0 50 0C70 0 80 10 100 10C80 10 70 20 50 20C30 20 20 10 0 10Z"
      fill={color}
    />
  </svg>
);
