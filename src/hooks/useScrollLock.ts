import { useEffect, useCallback, useRef } from 'react';

interface ScrollLockState {
  scrollY: number;
  bodyStyles: {
    overflow: string;
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
    touchAction: string;
  };
}

/**
 * Hook to lock/unlock body scrolling
 * Handles iOS Safari quirks with position: fixed and touch-action
 */
export function useScrollLock(locked: boolean): void {
  const stateRef = useRef<ScrollLockState | null>(null);

  const lockScroll = useCallback(() => {
    if (typeof document === 'undefined') return;

    // Already locked
    if (stateRef.current) return;

    const scrollY = window.scrollY;
    const body = document.body;

    // Save current state
    stateRef.current = {
      scrollY,
      bodyStyles: {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        touchAction: body.style.touchAction,
      },
    };

    // Apply scroll lock styles
    // iOS Safari requires position: fixed to truly prevent scrolling
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    // Prevent touch scrolling on iOS
    body.style.touchAction = 'none';

    // Also apply to html element for extra safety
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const unlockScroll = useCallback(() => {
    if (typeof document === 'undefined') return;

    // Not locked
    if (!stateRef.current) return;

    const { scrollY, bodyStyles } = stateRef.current;
    const body = document.body;

    // Restore body styles
    body.style.overflow = bodyStyles.overflow;
    body.style.position = bodyStyles.position;
    body.style.top = bodyStyles.top;
    body.style.left = bodyStyles.left;
    body.style.right = bodyStyles.right;
    body.style.width = bodyStyles.width;
    body.style.touchAction = bodyStyles.touchAction;

    // Restore html element
    document.documentElement.style.overflow = '';

    // Restore scroll position
    window.scrollTo(0, scrollY);

    stateRef.current = null;
  }, []);

  useEffect(() => {
    if (locked) {
      lockScroll();
    } else {
      unlockScroll();
    }

    // Cleanup on unmount
    return () => {
      if (stateRef.current) {
        unlockScroll();
      }
    };
  }, [locked, lockScroll, unlockScroll]);
}

export default useScrollLock;
