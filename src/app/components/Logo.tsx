'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
  centered?: boolean;
}

export default function Logo({ 
  size = 32, 
  showText = true, 
  textSize = 'text-2xl',
  centered = false 
}: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-5 ${centered ? 'justify-center' : ''}`}
    >
      <Image src="/logo.png" alt="KindDrop" width={size} height={size} />
      {showText && (
        <span className={`${textSize} font-bold text-glow`}>KindDrop</span>
      )}
    </Link>
  );
}
