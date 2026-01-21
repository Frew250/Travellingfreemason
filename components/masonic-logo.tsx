interface MasonicLogoProps {
  className?: string;
}

export function MasonicLogo({ className = "h-12 w-12" }: MasonicLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Square */}
      <path
        d="M20 80 L20 40 L50 40"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      {/* Compass */}
      <path
        d="M30 20 L50 60 L70 20"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      {/* Second leg of square */}
      <path
        d="M50 40 L80 40 L80 80"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      {/* G in center */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        className="fill-accent"
      >
        G
      </text>
    </svg>
  );
}
