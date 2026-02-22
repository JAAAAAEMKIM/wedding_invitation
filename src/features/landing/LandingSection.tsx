import { StopMotionPlayer } from '@/components';

interface LandingSectionProps {
  frames: string[];
  onAnimationComplete: () => void;
  isAnimating: boolean;
}

export function LandingSection({
  frames,
  onAnimationComplete,
  isAnimating,
}: LandingSectionProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {isAnimating && frames.length > 0 ? (
        <StopMotionPlayer
          frames={frames}
          fps={1}
          autoPlay={true}
          loop={false}
          onComplete={onAnimationComplete}
          showSkipButton={true}
          skipButtonLabel="건너뛰기"
          className="w-full h-full"
        />
      ) : (
        // Final frame or fallback display
        <div className="w-full h-full flex items-center justify-center">
          {frames.length > 0 && (
            <img
              src={frames[frames.length - 1]}
              alt="Wedding"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* Scroll indicator - shown after animation completes */}
      {!isAnimating && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}

export default LandingSection;
