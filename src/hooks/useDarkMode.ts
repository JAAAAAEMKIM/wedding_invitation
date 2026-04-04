import { useState, useEffect, useCallback } from 'react';

function hasFlag(flag: string): boolean {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return false;
  return q.split(',').includes(flag);
}

function setFlag(flag: string, enabled: boolean) {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const flags = q ? q.split(',').filter(Boolean) : [];

  if (enabled && !flags.includes(flag)) {
    flags.push(flag);
  } else if (!enabled) {
    const idx = flags.indexOf(flag);
    if (idx !== -1) flags.splice(idx, 1);
  }

  if (flags.length > 0) {
    params.set('q', flags.join(','));
  } else {
    params.delete('q');
  }

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => hasFlag('dm'));

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      setFlag('dm', next);
      return next;
    });
  }, []);

  return { isDark, toggle };
}
