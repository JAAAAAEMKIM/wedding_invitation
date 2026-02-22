import { useEffect, useRef, useState, useCallback } from 'react';

interface NaverMapProps {
  clientId: string;
  latitude: number;
  longitude: number;
  zoom?: number;
  markerTitle?: string;
  width?: string;
  height?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// Script loading singleton to prevent multiple script injections
let scriptLoadingPromise: Promise<void> | null = null;

function loadNaverMapsScript(clientId: string): Promise<void> {
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  if (typeof window !== 'undefined' && window.naver?.maps) {
    return Promise.resolve();
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      scriptLoadingPromise = null;
      reject(new Error('Failed to load Naver Maps script'));
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function NaverMap({
  clientId,
  latitude,
  longitude,
  zoom = 16,
  markerTitle,
  width = '100%',
  height = '300px',
  className = '',
  onLoad,
  onError,
}: NaverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerInstanceRef = useRef<naver.maps.Marker | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || !window.naver?.maps) return;

    // Clean up existing instances
    if (markerInstanceRef.current) {
      markerInstanceRef.current.setMap(null);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
    }

    const location = new window.naver.maps.LatLng(latitude, longitude);

    try {
      // Create map instance
      const map = new window.naver.maps.Map(mapContainerRef.current, {
        center: location,
        zoom,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: false,
        scaleControl: false,
        logoControl: true,
        mapDataControl: false,
      });

      mapInstanceRef.current = map;

      // Listen for authentication error - check if map rendered properly after delay
      setTimeout(() => {
        try {
          // If map was created but auth failed, getCenter() might not work properly
          const center = map.getCenter();

          // Check if the map container has actual map content (tiles/canvas)
          if (mapContainerRef.current) {
            const hasCanvas = mapContainerRef.current.querySelector('canvas');
            const hasImages = mapContainerRef.current.querySelector('img');
            const hasValidContent = hasCanvas || hasImages;

            // If no visual content rendered, auth likely failed
            if (!center || !hasValidContent) {
              setLoadingState('error');
              onError?.(new Error('Naver Maps authentication failed'));
            }
          }
        } catch {
          setLoadingState('error');
          onError?.(new Error('Naver Maps authentication failed'));
        }
      }, 1500);

      // Create marker
      const markerOptions: naver.maps.MarkerOptions = {
        position: location,
        map,
        animation: window.naver.maps.Animation.DROP,
      };

      if (markerTitle) {
        markerOptions.title = markerTitle;
      }

      const marker = new window.naver.maps.Marker(markerOptions);

      markerInstanceRef.current = marker;

      onLoad?.();
    } catch {
      setLoadingState('error');
      onError?.(new Error('Failed to initialize Naver Maps'));
    }
  }, [latitude, longitude, zoom, markerTitle, onLoad, onError]);

  useEffect(() => {
    if (loadingState !== 'idle') return;

    setLoadingState('loading');

    loadNaverMapsScript(clientId)
      .then(() => {
        setLoadingState('loaded');
      })
      .catch((error) => {
        setLoadingState('error');
        onError?.(error);
      });
  }, [clientId, loadingState, onError]);

  useEffect(() => {
    if (loadingState === 'loaded') {
      initializeMap();
    }
  }, [loadingState, initializeMap]);

  // Update map center when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && window.naver?.maps) {
      const newCenter = new window.naver.maps.LatLng(latitude, longitude);
      mapInstanceRef.current.setCenter(newCenter);

      if (markerInstanceRef.current) {
        markerInstanceRef.current.setPosition(newCenter);
      }
    }
  }, [latitude, longitude]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (markerInstanceRef.current) {
          markerInstanceRef.current.setMap(null);
          markerInstanceRef.current = null;
        }
      } catch {
        // Ignore cleanup errors
      }
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loadingState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-sm">Loading map...</div>
        </div>
      )}

      {loadingState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="text-gray-500 text-sm text-center mb-3">
            지도를 불러올 수 없습니다
          </div>
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(markerTitle || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#03C75A] text-white text-sm rounded-md hover:bg-[#02b350] transition-colors"
          >
            네이버 지도에서 보기
          </a>
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ visibility: loadingState === 'loaded' ? 'visible' : 'hidden' }}
      />
    </div>
  );
}

export default NaverMap;
