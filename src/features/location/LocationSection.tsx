import { useState, useCallback } from 'react';
import { NaverMap } from '@/components';
import type { LocationInfo, AccountSection } from '@/types';

interface LocationSectionProps {
  location: LocationInfo;
  naverClientId: string;
  accountSections?: AccountSection[];
}

export function LocationSection({
  location,
  naverClientId,
  accountSections = [],
}: LocationSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleAccordionToggle = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  const handleCopyAccount = useCallback(async (accountNumber: string, _holder: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = accountNumber;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    }
  }, []);

  const openNaverMap = () => {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  const openKakaoMap = () => {
    const url = `https://map.kakao.com/link/search/${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Title */}
        <h2 className="text-sm tracking-[0.3em] text-gray-500 text-center mb-8">
          LOCATION
        </h2>

        {/* Location Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {location.name}
          </h3>
          {location.floor && location.hall && (
            <p className="text-sm text-gray-600 mb-1">
              {location.floor} {location.hall}
            </p>
          )}
          <p className="text-sm text-gray-500">{location.address}</p>
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
        <div className="flex gap-2 mb-12">
          <button
            onClick={openNaverMap}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            type="button"
          >
            네이버 지도
          </button>
          <button
            onClick={openKakaoMap}
            className="flex-1 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            type="button"
          >
            카카오맵
          </button>
        </div>

        {/* Account Section */}
        {accountSections.length > 0 && (
          <>
            <h2 className="text-sm tracking-[0.3em] text-gray-500 text-center mb-8">
              ACCOUNT
            </h2>

            <div className="space-y-2">
              {accountSections.map((section) => (
                <div
                  key={section.title}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => handleAccordionToggle(section.title)}
                    className="w-full px-4 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    <span className="font-medium text-gray-800 text-sm">
                      {section.title}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedSection === section.title ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Accordion Content */}
                  {expandedSection === section.title && (
                    <div className="px-4 pb-4 space-y-3 bg-white">
                      {section.accounts.map((account, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              {account.bank}
                            </p>
                            <p className="text-sm text-gray-800">
                              {account.accountNumber}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              예금주: {account.holder}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyAccount(account.accountNumber, account.holder)}
                            className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap"
                            type="button"
                          >
                            {copiedAccount === account.accountNumber
                              ? '복사됨!'
                              : '복사'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default LocationSection;
