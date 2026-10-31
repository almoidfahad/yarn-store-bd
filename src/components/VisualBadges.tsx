import React from 'react';

export function CertificationEmblems() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
      {/* ISO 9001:2015 Circular Badge */}
      <div className="w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full bg-white shadow-md border-2 border-[#BFDBFE] flex flex-col items-center justify-center p-1.5 text-center shrink-0">
        <span className="text-[8px] font-bold uppercase tracking-wider text-[#1D4ED8]">CERTIFIED</span>
        <span className="text-[20px] font-black leading-none text-[#1E40AF] tracking-tight my-0.5">ISO</span>
        <span className="text-[9.5px] font-extrabold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded">
          9001:2015
        </span>
      </div>

      {/* OEKO-TEX Standard 100 Circular Badge */}
      <div className="w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full bg-white shadow-md border-2 border-emerald-200 flex flex-col items-center justify-center p-1.5 text-center shrink-0">
        <span className="text-[13px] font-black leading-tight text-[#17231C] tracking-tight">OEKO</span>
        <span className="text-[13px] font-black leading-tight text-[#08752B] tracking-tight">TEX®</span>
        <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
          STANDARD 100
        </span>
      </div>

      {/* BCI Better Cotton & ERC Circular Badge */}
      <div className="w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full bg-white shadow-md border-2 border-green-300 flex flex-col items-center justify-center p-1.5 text-center shrink-0">
        <div className="flex items-center gap-0.5">
          <span className="text-[18px] font-black leading-none text-[#08752B]">BCI</span>
        </div>
        <span className="text-[7.5px] font-bold text-[#0A5426] leading-tight mt-0.5">
          Better Cotton
        </span>
        <span className="text-[7px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded mt-0.5">
          ERC Verified
        </span>
      </div>
    </div>
  );
}

export function CountryFlagAvatar({ country }: { country: 'USA' | 'UK' | 'Germany' | 'UAE' | 'Turkey' }) {
  if (country === 'USA') {
    return (
      <svg viewBox="0 0 48 48" className="w-12 h-12 rounded-full shadow-sm border border-slate-200 shrink-0">
        <clipPath id="usaClip">
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <g clipPath="url(#usaClip)">
          <rect width="48" height="48" fill="#FFFFFF" />
          {[0, 7.4, 14.8, 22.2, 29.6, 37, 44.4].map((y, idx) => (
            <rect key={idx} y={y} width="48" height="3.7" fill="#DC2626" />
          ))}
          <rect width="24" height="26" fill="#1E3A8A" />
          <circle cx="6" cy="6" r="1.3" fill="#FFF" />
          <circle cx="12" cy="6" r="1.3" fill="#FFF" />
          <circle cx="18" cy="6" r="1.3" fill="#FFF" />
          <circle cx="9" cy="11" r="1.3" fill="#FFF" />
          <circle cx="15" cy="11" r="1.3" fill="#FFF" />
          <circle cx="6" cy="16" r="1.3" fill="#FFF" />
          <circle cx="12" cy="16" r="1.3" fill="#FFF" />
          <circle cx="18" cy="16" r="1.3" fill="#FFF" />
          <circle cx="9" cy="21" r="1.3" fill="#FFF" />
          <circle cx="15" cy="21" r="1.3" fill="#FFF" />
        </g>
      </svg>
    );
  }
  if (country === 'UK') {
    return (
      <svg viewBox="0 0 48 48" className="w-12 h-12 rounded-full shadow-sm border border-slate-200 shrink-0">
        <clipPath id="ukClip">
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <g clipPath="url(#ukClip)">
          <rect width="48" height="48" fill="#1E3A8A" />
          <path d="M0 0 L48 48 M48 0 L0 48" stroke="#FFFFFF" strokeWidth="9" />
          <path d="M0 0 L48 48 M48 0 L0 48" stroke="#DC2626" strokeWidth="4" />
          <path d="M24 0 V48 M0 24 H48" stroke="#FFFFFF" strokeWidth="13" />
          <path d="M24 0 V48 M0 24 H48" stroke="#DC2626" strokeWidth="7" />
        </g>
      </svg>
    );
  }
  if (country === 'Germany') {
    return (
      <svg viewBox="0 0 48 48" className="w-12 h-12 rounded-full shadow-sm border border-slate-200 shrink-0">
        <clipPath id="deClip">
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <g clipPath="url(#deClip)">
          <rect y="0" width="48" height="16" fill="#111827" />
          <rect y="16" width="48" height="16" fill="#DC2626" />
          <rect y="32" width="48" height="16" fill="#FACC15" />
        </g>
      </svg>
    );
  }
  if (country === 'UAE') {
    return (
      <svg viewBox="0 0 48 48" className="w-12 h-12 rounded-full shadow-sm border border-slate-200 shrink-0">
        <clipPath id="uaeClip">
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <g clipPath="url(#uaeClip)">
          <rect x="13" y="0" width="35" height="16" fill="#16A34A" />
          <rect x="13" y="16" width="35" height="16" fill="#FFFFFF" />
          <rect x="13" y="32" width="35" height="16" fill="#111827" />
          <rect x="0" y="0" width="13" height="48" fill="#DC2626" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12 rounded-full shadow-sm border border-slate-200 shrink-0">
      <clipPath id="trClip">
        <circle cx="24" cy="24" r="24" />
      </clipPath>
      <g clipPath="url(#trClip)">
        <rect width="48" height="48" fill="#E11D48" />
        <circle cx="21" cy="24" r="9.5" fill="#FFFFFF" />
        <circle cx="23.5" cy="24" r="7.5" fill="#E11D48" />
        <circle cx="31" cy="24" r="2.8" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function WebsiteQrCode() {
  // Crisp QR Matrix Visual matching footer screenshot
  const cells = [
    '111111101011011111111',
    '100000100101001000001',
    '101110101110101011101',
    '101110100011001011101',
    '101110101010101011101',
    '100000100101001000001',
    '111111101010101111111',
    '000000001101100000000',
    '110110110010110110101',
    '011001001100101001110',
    '101101101011011010101',
    '010010010110100101010',
    '110101101101011110111',
    '000000001010101001010',
    '111111100110110110101',
    '100000101001001001110',
    '101110101110111110101',
    '101110100101010001011',
    '101110101011101110101',
    '100000100110010101110',
    '111111101010111010101',
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-2 rounded-lg shadow-md">
        <svg width="78" height="78" viewBox="0 0 21 21" shapeRendering="crispEdges">
          <rect width="21" height="21" fill="#FFFFFF" />
          {cells.map((row, y) =>
            row.split('').map((bit, x) =>
              bit === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#111827" /> : null
            )
          )}
        </svg>
      </div>
      <span className="text-[11px] text-emerald-100/85 mt-1.5 font-medium">Visit Our Website</span>
    </div>
  );
}
