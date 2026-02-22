import { useState, useEffect } from 'react';
import { fetchGuestbookEntries, createGuestbookEntry } from '@/lib/guestbook';
import type { GuestbookEntry, GuestbookFormData } from '@/types';

interface GuestbookSectionProps {
  title?: string;
}

export function GuestbookSection({
  title = 'GUESTBOOK',
}: GuestbookSectionProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [formData, setFormData] = useState<GuestbookFormData>({
    name: '',
    password: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      const data = await fetchGuestbookEntries();
      setEntries(data);
      setIsLoading(false);
    }
    loadEntries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.password || !formData.message) {
      return;
    }

    setIsSubmitting(true);

    const newEntry = await createGuestbookEntry(formData);

    if (newEntry) {
      setEntries((prev) => [newEntry, ...prev]);
      setFormData({ name: '', password: '', message: '' });
    }

    setIsSubmitting(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-md mx-auto">
        {/* Title */}
        <h2 className="text-sm tracking-[0.3em] text-gray-500 text-center mb-8">
          {title}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-12">
          <div className="flex gap-2">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="축하 메시지를 남겨주세요"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '등록 중...' : '작성하기'}
          </button>
        </form>

        {/* Entries List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400 text-sm py-8">
              불러오는 중...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">
              첫 번째 축하 메시지를 남겨주세요!
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {entry.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default GuestbookSection;
