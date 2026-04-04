import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  useAssetPreloader,
  useScrollLock,
  useDarkMode,
  useQueryFlags,
} from '@/hooks';
import { Preloader, MusicPlayer } from '@/components';
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

const MAIN_IMAGE_LIGHT = '/assets/main.png';
const MAIN_IMAGE_DARK = '/assets/main.dark.png';
const PRELOAD_ASSETS: string[] = [MAIN_IMAGE_LIGHT, MAIN_IMAGE_DARK];

// Gallery image indices (1-16)
const GALLERY_IMAGE_INDICES: number[] = Array.from(
  { length: 16 },
  (_, i) => i + 1
);

// Location configuration
const WEDDING_LOCATION: LocationInfo = {
  name: '드까르멜릿(구 애움 456)',
  address: '경기 하남시 동남로524번길 24 드까르멜릿',
  coordinates: {
    lat: 37.5205937,
    lng: 127.1463501,
  },
};

// Individual accounts
const ACCOUNTS = {
  groom: {
    bank: '신한은행',
    accountNumber: '110-507-619496',
    holder: '김재민',
  },
  groomFather: {
    bank: '국민은행',
    accountNumber: '123-45-6789012',
    holder: '김봉희',
  },
  groomMother: {
    bank: '국민은행',
    accountNumber: '123-45-6789013',
    holder: '우수경',
  },
  bride: {
    bank: '신한은행',
    accountNumber: '110-296-663360',
    holder: '안소연',
  },
  brideFather: {
    bank: '하나은행',
    accountNumber: '123-456789-01234',
    holder: '안정용',
  },
  brideMother: {
    bank: '하나은행',
    accountNumber: '123-456789-01235',
    holder: '안유경',
  },
};

// Track if assets have already been loaded in this session
let assetsLoaded = false;

function HomePage() {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { has } = useQueryFlags();
  const [phase, setPhase] = useState<AppPhase>(
    assetsLoaded ? 'content' : 'loading'
  );
  const [showContent, setShowContent] = useState(assetsLoaded);

  // Build account sections based on query flags
  const accountSections = useMemo(() => {
    const groomAccounts = [ACCOUNTS.groom];
    if (has('gf')) groomAccounts.push(ACCOUNTS.groomFather);
    if (has('gm')) groomAccounts.push(ACCOUNTS.groomMother);

    const brideAccounts = [ACCOUNTS.bride];
    if (has('bf')) brideAccounts.push(ACCOUNTS.brideFather);
    if (has('bm')) brideAccounts.push(ACCOUNTS.brideMother);

    return [
      { title: '신랑측 계좌번호', accounts: groomAccounts },
      { title: '신부측 계좌번호', accounts: brideAccounts },
    ] as AccountSection[];
  }, [has]);

  const showLocation = !has('hl');
  const showDate = !has('hd');

  const mainImage = isDark ? MAIN_IMAGE_DARK : MAIN_IMAGE_LIGHT;

  // Preload main images (both light and dark)
  const preloaderState = useAssetPreloader(PRELOAD_ASSETS);

  // Wait for fonts to be loaded before completing preloader
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  // Lock scroll during loading phase
  useScrollLock(phase !== 'content');

  // Handle preloader fade completion - go straight to content
  const handlePreloaderFadeComplete = useCallback(() => {
    assetsLoaded = true;
    setPhase('content');
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  }, []);

  // Snap scroll behavior: < 1/4 viewport → snap back to top, >= 1/4 → snap to content
  const isSnapping = useRef(false);
  // Fixed viewport height to avoid jank from mobile browser bar changes
  const fixedVhRef = useRef(window.innerHeight);

  useEffect(() => {
    if (phase !== 'content') return;

    const vh = fixedVhRef.current;

    const handleScrollEnd = () => {
      if (isSnapping.current) return;
      const scrollY = window.scrollY;
      // Only snap in the landing-to-content boundary zone
      if (scrollY > 0 && scrollY < vh) {
        isSnapping.current = true;
        const target = scrollY < vh / 4 ? 0 : vh;
        window.scrollTo({ top: target, behavior: 'smooth' });
        setTimeout(() => {
          isSnapping.current = false;
        }, 500);
      }
    };

    // scrollend with fallback for iOS Safari
    const hasScrollEnd = 'onscrollend' in window;
    if (hasScrollEnd) {
      window.addEventListener('scrollend', handleScrollEnd);
    } else {
      let timer: ReturnType<typeof setTimeout>;
      const handleScroll = () => {
        clearTimeout(timer);
        timer = setTimeout(handleScrollEnd, 100);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scrollend', handleScrollEnd);
  }, [phase]);

  // Content visibility class
  const contentVisibilityClass = useMemo(() => {
    if (phase === 'loading') return 'opacity-0 pointer-events-none';
    return showContent
      ? 'opacity-100 transition-opacity duration-700'
      : 'opacity-0';
  }, [phase, showContent]);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Mobile Container */}
      <div className="mx-auto min-h-screen bg-white dark:bg-neutral-900 relative">
        {/* Preloader Overlay */}
        {phase === 'loading' && (
          <Preloader
            progress={preloaderState.progress}
            isComplete={preloaderState.isComplete && fontsReady}
            onFadeComplete={handlePreloaderFadeComplete}
          />
        )}

        {/* Landing Section - Fixed background layer */}
        {phase !== 'loading' && (
          <LandingSection
            mainImage={mainImage}
            onQuadrupleClick={toggleDarkMode}
            showDate={showDate}
          />
        )}

        {/* Spacer for fixed landing section */}
        {phase !== 'loading' && <div style={{ height: '100svh' }} />}

        {/* Content Sections - Layer 2, scrolls over landing */}
        <div
          className={`relative z-10 bg-white dark:bg-neutral-900 ${contentVisibilityClass}`}
        >
          {/* Soft top edge - blurred shadow */}
          <div
            className="absolute -top-8 left-0 right-0 h-8 pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, transparent, rgb(23,23,23))'
                : 'linear-gradient(to bottom, transparent, white)',
            }}
          />
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
            totalCount={16}
          />

          <GuestbookSection />

          {showLocation && (
            <LocationSection
              location={WEDDING_LOCATION}
              naverClientId={NAVER_MAP_CLIENT_ID}
              accountSections={accountSections}
            />
          )}

          {/* Footer */}
          <footer className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>Made with ♥</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { has } = useQueryFlags();
  const bgmSrc = has('bg2') ? '/assets/bgm-digimon.mp3' : '/assets/bgm.mp3';

  return (
    <>
      <MusicPlayer src={bgmSrc} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </>
  );
}

export default App;
