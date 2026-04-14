import { NaverMap } from '@/components';
import type { LocationInfo } from '@/types';

interface LocationSectionProps {
  location: LocationInfo;
  naverClientId: string;
}

export function LocationSection({
  location,
  naverClientId,
}: LocationSectionProps) {
  const openNaverMap = () => {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  const openKakaoMap = () => {
    const url = `https://map.kakao.com/link/search/${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-md mx-auto mb-12">
        {/* Title */}
        <h2 className="text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 text-center mb-8">
          LOCATION
        </h2>

        {/* Location Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            {location.name}
          </h3>
          {location.floor && location.hall && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {location.floor} {location.hall}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">{location.address}</p>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden shadow-md mb-4">
          <NaverMap
            clientId={naverClientId}
            latitude={location.coordinates.lat}
            longitude={location.coordinates.lng}
            zoom={16}
            markerTitle={location.name}
            height="250px"
          />
        </div>

        {/* Map Links */}
        <div className="flex gap-2">
          <button
            onClick={openNaverMap}
            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            type="button"
          >
            네이버 지도
          </button>
          <button
            onClick={openKakaoMap}
            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            type="button"
          >
            카카오맵
          </button>
        </div>
    </div>
  );
}

export default LocationSection;
