import { useState, useEffect, useCallback, useRef } from 'react';

interface StopMotionPlayerProps {
  frames: string[];
  fps?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  onFrameChange?: (frameIndex: number) => void;
  showSkipButton?: boolean;
  skipButtonLabel?: string;
  className?: string;
}

export function StopMotionPlayer({
  frames,
  fps = 10,
  autoPlay = true,
  loop = false,
  onComplete,
  onFrameChange,
  showSkipButton = true,
  skipButtonLabel = 'Skip',
  className = '',
}: StopMotionPlayerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const frameInterval = 1000 / fps;

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsComplete(true);
    setIsPlaying(false);
    onComplete?.();
  }, [onComplete]);

  const skipToEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentFrame(frames.length - 1);
    handleComplete();
  }, [frames.length, handleComplete]);

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentFrame(prev => {
        const nextFrame = prev + 1;

        if (nextFrame >= frames.length) {
          if (loop) {
            return 0;
          } else {
            // Schedule handleComplete for next tick to avoid setState during render
            setTimeout(() => handleComplete(), 0);
            return prev;
          }
        }

        return nextFrame;
      });
    }, frameInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, frames.length, frameInterval, loop, handleComplete]);

  useEffect(() => {
    onFrameChange?.(currentFrame);
  }, [currentFrame, onFrameChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (frames.length === 0) {
    return null;
  }

  const currentFrameSrc = frames[currentFrame];

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Frame Display */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {currentFrameSrc && (
          <img
            src={currentFrameSrc}
            alt={`Frame ${currentFrame + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}
      </div>

      {/* Skip Button - fixed to viewport for mobile, constrained to container on desktop */}
      {showSkipButton && !isComplete && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="max-w-[430px] mx-auto h-full relative">
            <button
              onClick={skipToEnd}
              className="pointer-events-auto absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] right-4 px-6 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-sm font-medium shadow-lg hover:bg-white transition-colors duration-200 active:scale-95"
              type="button"
            >
              {skipButtonLabel}
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator (optional) */}
      <div className="absolute bottom-4 left-4 text-white/60 text-xs font-mono">
        {currentFrame + 1} / {frames.length}
      </div>
    </div>
  );
}

export default StopMotionPlayer;
