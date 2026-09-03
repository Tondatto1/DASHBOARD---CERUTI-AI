import React from 'react';

interface LogoProps {
  className?: string;
  imgClassName?: string;
  alt?: string;
}

export function Logo({
  className = "w-8 h-8",
  imgClassName = "w-full h-full object-cover",
  alt = "Ceruti Logo"
}: LogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 border border-slate-200/80 bg-white shadow-xs select-none ${className}`}
    >
      <img
        src="/favicon.png"
        alt={alt}
        className={`w-full h-full object-cover rounded-full ${imgClassName}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}


