'use client';

import React, { useState } from 'react';

interface Hub {
  id: string;
  name: string;
  x: number;
  y: number;
  detail: string;
}

const HUBS: Hub[] = [
  { id: 'usa', name: 'USA (Savannah / NY / LA)', x: 165, y: 122, detail: 'Cotton & Combed Knitting Yarn Importers (28% Lead Share)' },
  { id: 'canada', name: 'Canada (Toronto / Montreal)', x: 182, y: 88, detail: 'Wholesale Fleece & Apparel Yarn Buyers' },
  { id: 'uk', name: 'United Kingdom (Felixstowe)', x: 342, y: 90, detail: 'Embroidery Thread & Hosiery Wholesalers (18% Share)' },
  { id: 'germany', name: 'Germany & EU (Hamburg / Bremerhaven)', x: 374, y: 98, detail: 'OEKO-TEX Certified Industrial Textile Mills (22% Share)' },
  { id: 'turkey', name: 'Turkey (Istanbul / Bursa)', x: 416, y: 118, detail: 'Soft Dye Cones & Polyester Filament Buyers' },
  { id: 'uae', name: 'UAE (Jebel Ali Regional Hub)', x: 454, y: 148, detail: 'GCC Textile Distributors & Re-Exporters (15% Share)' },
  { id: 'australia', name: 'Australia (Melbourne / Sydney)', x: 608, y: 242, detail: 'Specialty Cotton & Industrial Thread Buyers' },
];

const DHAKA = { x: 518, y: 146 };

export function WorldExportMap() {
  const [activeHub, setActiveHub] = useState<Hub | null>(null);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 700 310"
        className="w-full h-auto drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="continentGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#26A64B" />
            <stop offset="100%" stopColor="#0E6F2E" />
          </linearGradient>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F28C18" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="55%" stopColor="#F28C18" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#F28C18" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle Latitude Wave Grid Lines */}
        <path d="M20 80 Q 350 55 680 80" stroke="#DCECE0" strokeWidth="0.9" strokeDasharray="3 4" />
        <path d="M10 150 Q 350 135 690 150" stroke="#DCECE0" strokeWidth="0.9" strokeDasharray="3 4" />
        <path d="M25 220 Q 350 235 675 220" stroke="#DCECE0" strokeWidth="0.9" strokeDasharray="3 4" />

        {/* Stylized World Continents in Lush Brand Green */}
        {/* North America */}
        <path
          d="M62 56 L118 42 L182 48 L226 72 L212 106 L192 128 L174 152 L148 164 L132 146 L108 128 L88 96 Z"
          fill="url(#continentGrad)"
          opacity="0.92"
        />
        {/* Greenland */}
        <path d="M236 28 L278 24 L286 48 L252 56 Z" fill="#34B35A" opacity="0.75" />
        {/* South America */}
        <path
          d="M182 174 L222 180 L248 210 L236 258 L208 292 L192 278 L186 226 Z"
          fill="url(#continentGrad)"
          opacity="0.9"
        />
        {/* UK & Ireland */}
        <path d="M332 78 L347 75 L350 93 L335 95 Z" fill="#178339" />
        {/* Europe */}
        <path
          d="M352 62 L405 50 L446 64 L442 104 L418 120 L382 122 L352 114 Z"
          fill="url(#continentGrad)"
        />
        {/* Africa */}
        <path
          d="M336 132 L396 128 L438 152 L442 198 L416 256 L384 264 L366 218 L334 176 Z"
          fill="url(#continentGrad)"
          opacity="0.94"
        />
        {/* Middle East & Asia (including India & Bangladesh) */}
        <path
          d="M422 118 L458 104 L528 70 L618 68 L658 98 L636 146 L594 176 L556 178 L524 156 L502 182 L486 154 L452 162 L434 142 Z"
          fill="url(#continentGrad)"
        />
        {/* Southeast Asia Islands */}
        <path d="M556 188 L596 194 L614 210 L568 212 Z" fill="#1E9442" opacity="0.88" />
        {/* Australia */}
        <path
          d="M574 224 L632 220 L650 252 L624 276 L580 268 Z"
          fill="url(#continentGrad)"
          opacity="0.92"
        />

        {/* Golden Export Arcs Radiating from Dhaka/Chattogram, Bangladesh */}
        {HUBS.map((hub, idx) => {
          const midX = (DHAKA.x + hub.x) / 2;
          const lift = Math.abs(DHAKA.x - hub.x) * 0.28 + (idx % 2 === 0 ? 18 : 8);
          const midY = Math.min(DHAKA.y, hub.y) - lift;
          return (
            <g key={hub.id}>
              <path
                d={`M ${DHAKA.x} ${DHAKA.y} Q ${midX} ${midY} ${hub.x} ${hub.y}`}
                stroke="url(#arcGrad)"
                strokeWidth={activeHub?.id === hub.id ? '2.4' : '1.45'}
                fill="none"
              />
              <path
                d={`M ${DHAKA.x} ${DHAKA.y} Q ${midX} ${midY - 5} ${hub.x} ${hub.y}`}
                stroke="#FDE68A"
                strokeWidth="0.7"
                strokeDasharray="3 3"
                opacity="0.75"
                fill="none"
              />
            </g>
          );
        })}

        {/* Destination Glowing Hubs */}
        {HUBS.map((hub) => (
          <g
            key={hub.id}
            className="cursor-pointer"
            onMouseEnter={() => setActiveHub(hub)}
            onMouseLeave={() => setActiveHub(null)}
            onClick={() => setActiveHub(hub)}
          >
            <circle cx={hub.x} cy={hub.y} r="10" fill="url(#hubGlow)" />
            <circle cx={hub.x} cy={hub.y} r="3.8" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.2" />
          </g>
        ))}

        {/* Origin Hub: Bangladesh (Dhaka / Chattogram Export Hub) */}
        <g>
          <circle cx={DHAKA.x} cy={DHAKA.y} r="15" fill="url(#hubGlow)" />
          <circle cx={DHAKA.x} cy={DHAKA.y} r="5.5" fill="#F28C18" stroke="#FFFFFF" strokeWidth="1.8" />
          <rect x={DHAKA.x - 42} y={DHAKA.y + 9} width="88" height="18" rx="9" fill="#063B1B" />
          <text
            x={DHAKA.x + 2}
            y={DHAKA.y + 21}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontWeight="700"
          >
            BANGLADESH HUB
          </text>
        </g>
      </svg>

      {/* Interactive Buyer Hub Tooltip */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-[#08752B]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F28C18] inline-block animate-pulse" />
          {activeHub
            ? `${activeHub.name}: ${activeHub.detail}`
            : 'Direct Container & Air Export from Chattogram & Dhaka to 25+ Countries (Hover a hub)'}
        </span>
      </div>
    </div>
  );
}
