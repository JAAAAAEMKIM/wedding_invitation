import { useState, useCallback, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAssetPreloader, useScrollLock } from '@/hooks';
import { Preloader } from '@/components';
import {
  LandingSection,
  InvitationSection,
  GallerySection,
  GuestbookSection,
  LocationSection,
} from '@/features';
import { GalleryPage } from '@/pages';
import type { AppPhase, LocationInfo, AccountSection } from '@/types';

// Configuration - Replace with your actual data
const NAVER_MAP_CLIENT_ID = '5pefwq1ob6';

// Stop-motion frames: 1,2,3,4,5 (4 each) + 7,11 (5 each) = 30 frames at 10fps = 3s
const STOP_MOTION_FRAME_SEQUENCE = [
  ...Array(4).fill('frame-001'),
  ...Array(4).fill('frame-002'),
  ...Array(4).fill('frame-003'),
  ...Array(4).fill('frame-004'),
  ...Array(4).fill('frame-005'),
  ...Array(5).fill('frame-007'),
  ...Array(5).fill('frame-011'),
];
const STOP_MOTION_FRAMES: string[] = STOP_MOTION_FRAME_SEQUENCE.map(
  (name) => `/assets/frames-optimized/${name}.webp`
);

// Gallery image indices (1-12, excluding 10)
const GALLERY_IMAGE_INDICES: number[] = Array.from(
  { length: 12 },
  (_, i) => i + 1
).filter((i) => i !== 10);

// Location configuration
const WEDDING_LOCATION: LocationInfo = {
  name: '드까르멜릿(구 애움 456)',
  address: '경기 하남시 동남로524번길 24 드까르멜릿',
  coordinates: {
    lat: 37.5205937,
    lng: 127.1463501,
  },
};

// Account sections
const ACCOUNT_SECTIONS: AccountSection[] = [
  {
    title: '신랑측 계좌번호',
    accounts: [
      { bank: '신한은행', accountNumber: '110-507-619496', holder: '김재민' },
      { bank: '국민은행', accountNumber: '123-45-6789012', holder: '김봉희' },
    ],
  },
  {
    title: '신부측 계좌번호',
    accounts: [
      { bank: '신한은행', accountNumber: '1002-123-456789', holder: '안소연' },
      {
        bank: '하나은행',
        accountNumber: '123-456789-01234',
        holder: '안정용',
      },
    ],
  },
];

function HomePage() {
  const [phase, setPhase] = useState<AppPhase>('loading');
  const [showContent, setShowContent] = useState(false);

  // Preload stop-motion frames
  const preloaderState = useAssetPreloader(STOP_MOTION_FRAMES);

  // Lock scroll during loading and animation phases
  useScrollLock(phase !== 'content');

  // Handle preloader fade completion - transition to animation after fade out
  const handlePreloaderFadeComplete = useCallback(() => {
    setPhase('animating');
  }, []);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    setPhase('content');
    // Trigger content fade-in
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  // Determine if we should show the animation
  const isAnimating = phase === 'animating';

  // Content visibility class
  const contentVisibilityClass = useMemo(() => {
    if (phase === 'loading') return 'opacity-0 pointer-events-none';
    if (phase === 'animating') return 'opacity-0 pointer-events-none';
    return showContent
      ? 'opacity-100 transition-opacity duration-700'
      : 'opacity-0';
  }, [phase, showContent]);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Container */}
      <div className="max-w-[430px] mx-auto min-h-screen bg-white shadow-xl relative">
        {/* Preloader Overlay */}
        {phase === 'loading' && (
          <Preloader
            progress={preloaderState.progress}
            isComplete={preloaderState.isComplete}
            onFadeComplete={handlePreloaderFadeComplete}
          />
        )}

        {/* Landing Section - Always visible after loading */}
        {phase !== 'loading' && (
          <LandingSection
            frames={STOP_MOTION_FRAMES}
            onAnimationComplete={handleAnimationComplete}
            isAnimating={isAnimating}
          />
        )}

        {/* Content Sections - Fade in after animation */}
        <div className={contentVisibilityClass}>
          <InvitationSection
            groomName="김재민"
            brideName="안소연"
            date="2026년 5월 16일 토요일"
            time="오후 5시"
            groomParents={{ father: '김봉희', mother: '우수경' }}
            brideParents={{ father: '안정용', mother: '안유경' }}
          />

          <GallerySection
            imageIndices={GALLERY_IMAGE_INDICES}
            previewCount={6}
            totalCount={11}
          />

          <GuestbookSection />

          <LocationSection
            location={WEDDING_LOCATION}
            naverClientId={NAVER_MAP_CLIENT_ID}
            accountSections={ACCOUNT_SECTIONS}
          />

          {/* Footer */}
          <footer className="py-8 text-center text-xs text-gray-400">
            <p>Made with ♥</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
  );
}

export default App;
