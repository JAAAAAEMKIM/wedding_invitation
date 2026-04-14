import { useState, useCallback } from 'react';
import type { AccountSection as AccountSectionType } from '@/types';

interface AccountSectionProps {
  accountSections: AccountSectionType[];
}

export function AccountSection({ accountSections }: AccountSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleAccordionToggle = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  const handleCopyAccount = useCallback(async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch {
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

  if (accountSections.length === 0) return null;

  return (
    <div className="max-w-md mx-auto">
        <h2 className="text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 text-center mb-8">
          ACCOUNT
        </h2>

        <div className="space-y-2">
          {accountSections.map((section) => (
            <div
              key={section.title}
              className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleAccordionToggle(section.title)}
                className="w-full px-4 py-4 flex justify-between items-center bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                type="button"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {section.title}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
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

              {expandedSection === section.title && (
                <div className="px-4 pb-4 space-y-3 bg-white dark:bg-neutral-800">
                  {section.accounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                    >
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {account.bank}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {account.accountNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          예금주: {account.holder}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyAccount(account.accountNumber)}
                        className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors whitespace-nowrap dark:text-gray-300"
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
    </div>
  );
}

export default AccountSection;
