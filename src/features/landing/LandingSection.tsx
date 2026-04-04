import { useEffect, useRef, useState, useCallback } from 'react';

interface LandingSectionProps {
  mainImage: string;
  onQuadrupleClick?: () => void;
  showDate?: boolean;
}

const RAPID_CLICK_THRESHOLD = 500; // ms between clicks
const REQUIRED_CLICKS = 4;

export function LandingSection({ mainImage, onQuadrupleClick, showDate = true }: LandingSectionProps) {
  const [blurAmount, setBlurAmount] = useState(0);
  const rafRef = useRef<number>(0);
  const clickTimesRef = useRef<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const ratio = Math.min(scrollY / viewportHeight, 1);
        setBlurAmount(ratio * 20);
        rafRef.current = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleImageClick = useCallback(() => {
    const now = Date.now();
    const clicks = clickTimesRef.current;

    // Remove clicks older than threshold
    while (clicks.length > 0 && now - clicks[0]! > RAPID_CLICK_THRESHOLD * REQUIRED_CLICKS) {
      clicks.shift();
    }

    clicks.push(now);

    // Check if last N clicks are all within threshold of each other
    if (clicks.length >= REQUIRED_CLICKS) {
      const recentClicks = clicks.slice(-REQUIRED_CLICKS);
      const timeDiff = recentClicks[REQUIRED_CLICKS - 1]! - recentClicks[0]!;
      if (timeDiff < RAPID_CLICK_THRESHOLD * (REQUIRED_CLICKS - 1)) {
        clickTimesRef.current = [];
        onQuadrupleClick?.();
      }
    }
  }, [onQuadrupleClick]);

  return (
    <div
      className="fixed inset-0 w-full h-screen bg-white dark:bg-neutral-900 flex items-center justify-center z-0"
      style={{ filter: `blur(${blurAmount}px)` }}
    >
      {/* Image wrapper - sized to actual image */}
      <div className="relative max-w-full max-h-full">
        <img
          src={mainImage}
          alt="Wedding"
          className="max-w-full max-h-screen block cursor-default"
          onClick={handleImageClick}
        />
        {/* Date text - 10px above image bottom */}
        {showDate && (
          <div
            className="absolute right-4 text-gray-500 dark:text-gray-400 text-sm font-light"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", bottom: '10px' }}
          >
            May 16, 2026 at 6:00 PM
          </div>
        )}

        {/* Scroll indicator - chevron */}
        <div className="absolute left-1/2 -translate-x-1/2 animate-bounce" style={{ bottom: '10px' }}>
          <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            stroke="currentColor"
            className="text-gray-400/60 dark:text-gray-500/60"
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
