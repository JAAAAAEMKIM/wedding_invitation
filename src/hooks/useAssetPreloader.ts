import { useState, useEffect, useRef } from 'react';
import type { PreloaderState } from '@/types';

interface UseAssetPreloaderOptions {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (errors: string[]) => void;
}

export function useAssetPreloader(
  urls: string[],
  options: UseAssetPreloaderOptions = {}
): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    progress: 0,
    loaded: 0,
    total: urls.length,
    isComplete: false,
    errors: [],
  });

  // Use refs for callbacks to avoid dependency issues
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const completedRef = useRef(false);
  const loadedCountRef = useRef(0);
  const errorsRef = useRef<string[]>([]);
  const urlsLengthRef = useRef(urls.length);
  urlsLengthRef.current = urls.length;

  useEffect(() => {
    // Handle empty URLs case
    if (urls.length === 0) {
      setState({
        progress: 100,
        loaded: 0,
        total: 0,
        isComplete: true,
        errors: [],
      });
      // Use setTimeout to avoid calling during render
      setTimeout(() => {
        optionsRef.current.onComplete?.();
      }, 0);
      return;
    }

    // Reset state for new URL set
    completedRef.current = false;
    loadedCountRef.current = 0;
    errorsRef.current = [];

    setState({
      progress: 0,
      loaded: 0,
      total: urls.length,
      isComplete: false,
      errors: [],
    });

    const updateProgress = () => {
      const totalUrls = urlsLengthRef.current;
      const progress = totalUrls > 0
        ? Math.round((loadedCountRef.current / totalUrls) * 100)
        : 100;

      setState(prev => ({
        ...prev,
        progress,
        loaded: loadedCountRef.current,
        errors: [...errorsRef.current],
      }));

      optionsRef.current.onProgress?.(progress);

      if (loadedCountRef.current >= totalUrls && !completedRef.current) {
        completedRef.current = true;
        setState(prev => ({ ...prev, isComplete: true }));

        if (errorsRef.current.length > 0) {
          optionsRef.current.onError?.(errorsRef.current);
        }
        optionsRef.current.onComplete?.();
      }
    };

    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          loadedCountRef.current++;
          updateProgress();
          resolve();
        };

        img.onerror = () => {
          errorsRef.current.push(url);
          loadedCountRef.current++;
          updateProgress();
          resolve();
        };

        img.src = url;
      });
    };

    // Load all images concurrently
    Promise.all(urls.map(loadImage));

    // Cleanup function
    return () => {
      completedRef.current = true;
    };
  }, [urls]);

  return state;
}

export default useAssetPreloader;
