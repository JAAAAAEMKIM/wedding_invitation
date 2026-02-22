import { useEffect, useState } from 'react';

interface PreloaderProps {
  progress: number;
  isComplete: boolean;
  onFadeComplete?: () => void;
}

export function Preloader({ progress, isComplete, onFadeComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isComplete) {
      // Start fade animation
      setIsFading(true);

      // Wait for fade animation to complete
      const timer = setTimeout(() => {
        setIsVisible(false);
        onFadeComplete?.();
      }, 500); // Match CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [isComplete, onFadeComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo or Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-800 tracking-widest">
          WEDDING
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-800 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <div className="mt-4 text-sm text-gray-500 font-mono">
        {progress}%
      </div>
    </div>
  );
}

export default Preloader;
