import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// All gallery images
const ALL_IMAGES: string[] = Array.from(
  { length: 12 },
  (_, i) => `/assets/gallery/photo-${i + 1}.jpg`
);

// Lazy loading image component with intersection observer
function LazyImage({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`bg-gray-100 ${className ?? ''}`}
      onClick={onClick}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrev = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = ALL_IMAGES.indexOf(selectedImage);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : ALL_IMAGES.length - 1;
    setSelectedImage(ALL_IMAGES[prevIndex] ?? null);
  }, [selectedImage]);

  const handleNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = ALL_IMAGES.indexOf(selectedImage);
    const nextIndex = currentIndex < ALL_IMAGES.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(ALL_IMAGES[nextIndex] ?? null);
  }, [selectedImage]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handlePrev, handleNext]);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Container - Same as main page */}
      <div
        ref={containerRef}
        className="max-w-[430px] mx-auto min-h-screen bg-white shadow-xl relative"
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm">돌아가기</span>
            </Link>
            <h1 className="text-sm tracking-[0.3em] text-gray-500">GALLERY</h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Gallery Grid */}
        <div className="p-2">
          <div className="grid grid-cols-2 gap-2">
            {ALL_IMAGES.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(image)}
                className="aspect-[3/4] overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 relative"
                type="button"
              >
                <LazyImage
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Photo count */}
        <div className="py-8 text-center text-sm text-gray-400">
          {ALL_IMAGES.length} Photos
        </div>

        {/* Lightbox Modal - Constrained to mobile container on desktop */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black"
              onClick={handleClose}
            />

            {/* Content container - matches mobile width on desktop */}
            <div className="relative w-full max-w-[430px] h-full flex items-center justify-center mx-auto">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white text-2xl p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                onClick={handleClose}
                type="button"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Prev button */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                onClick={handlePrev}
                type="button"
                aria-label="Previous"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next button */}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                onClick={handleNext}
                type="button"
                aria-label="Next"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image */}
              <img
                src={selectedImage}
                alt="Gallery full view"
                className="max-w-full max-h-full object-contain px-4"
              />

              {/* Counter */}
              <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {ALL_IMAGES.indexOf(selectedImage) + 1} / {ALL_IMAGES.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
