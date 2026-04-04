import { useEffect, useRef, useState } from 'react';

interface LandingSectionProps {
  mainImage: string;
}

export function LandingSection({ mainImage }: LandingSectionProps) {
  const [blurAmount, setBlurAmount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        // 0 ~ 1 비율로 blur 계산 (한 화면 스크롤하면 max blur)
        const ratio = Math.min(scrollY / viewportHeight, 1);
        setBlurAmount(ratio * 20); // max 20px blur
        rafRef.current = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-screen bg-white flex items-center justify-center z-0"
      style={{ filter: `blur(${blurAmount}px)` }}
    >
      {/* Image wrapper - sized to actual image */}
      <div className="relative max-w-full max-h-full">
        <img
          src={mainImage}
          alt="Wedding"
          className="max-w-full max-h-screen block"
        />
        {/* Date text - 10px above image bottom */}
        <div
          className="absolute right-4 text-gray-500 text-sm font-light"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", bottom: '10px' }}
        >
          May 16, 2026 at 6:00 PM
        </div>

        {/* Scroll indicator - chevron */}
        <div className="absolute left-1/2 -translate-x-1/2 animate-bounce" style={{ bottom: '10px' }}>
          <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            stroke="currentColor"
            className="text-gray-400/60"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 2l10 10L22 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LandingSection;
