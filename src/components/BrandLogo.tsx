import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  theme?: 'light' | 'dark';
  compact?: boolean;
  href?: string;
}

export function BrandLogo({ theme = 'light', compact = false, href = '/' }: BrandLogoProps) {
  const isDark = theme === 'dark';

  const content = (
    <div className="inline-flex items-center gap-1 select-none group">
      <div className="relative flex items-center">
        {/* Iconic Green & Orange Curved Swoosh Emblem matching both screenshots */}
        <svg
          width={compact ? 42 : 50}
          height={compact ? 40 : 46}
          viewBox="0 0 58 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 -mr-3"
        >
          {/* Outer Green Leaf/Swoosh */}
          <path
            d="M44 7C26 2 8 10 6 26C4 39 17 49 38 48C23 46 13 38 14 26C15 15 28 8 44 7Z"
            fill={isDark ? '#4ADE80' : '#15803D'}
          />
          <path
            d="M36 4C20 1 5 9 3 25C1.5 36 10 45 25 48C14 43 9 35 10 25C11 14 22 6 36 4Z"
            fill={isDark ? '#22C55E' : '#08752B'}
          />
          {/* Inner Warm Orange Swoosh */}
          <path
            d="M12 32C15 42 28 48 48 45C33 45 21 39 18 30C15 22 20 13 31 9C19 12 9 21 12 32Z"
            fill="#F28C18"
          />
          {/* Subtle Green Leaf Accent on Top Left */}
          <path
            d="M15 9C10 6 5 8 4 13C9 14 13 12 15 9Z"
            fill={isDark ? '#86EFAC' : '#22A947'}
          />
        </svg>

        <div className="flex flex-col leading-none pl-1">
          <div className="flex items-baseline tracking-tight">
            <span
              className={`${
                compact ? 'text-[19px]' : 'text-[23px]'
              } font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-[#0E692D]'
              }`}
            >
              YARN
            </span>
            <span
              className={`ml-1 ${
                compact ? 'text-[15px]' : 'text-[18px]'
              } font-extrabold tracking-tight ${
                isDark ? 'text-[#DCFCE7]' : 'text-[#0A3E1D]'
              }`}
            >
              STORE BD
            </span>
          </div>
          <span
            className={`mt-0.5 ${
              compact ? 'text-[8.5px]' : 'text-[9.5px]'
            } font-bold uppercase tracking-[0.11em] ${
              isDark ? 'text-[#FBBF24]' : 'text-[#D97706]'
            }`}
          >
            MHR THREAD &amp; ACCESSORIES
          </span>
        </div>
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="focus:outline-none">
      {content}
    </Link>
  );
}
