import { useMemo } from 'react';

/**
 * Query parameter flags system.
 * All flags are passed via ?q=flag1,flag2,flag3
 *
 * Available flags:
 * - dm: Dark mode
 * - hl: Hide location section
 * - hd: Hide date on landing
 * - gf: Show groom father account
 * - gm: Show groom mother account
 * - bf: Show bride father account
 * - bm: Show bride mother account
 * - bg2: Play bgm-digimon instead of default bgm
 * - na: Announcement mode (not attending) - different invitation message
 *
 * Recipient preset is passed via ?to=preset
 * - sk: 신랑측 전체 + 신부 단독, 사진 업로드 숨김
 * - yk: 5/31 날짜, 신랑/신부만, 사진 업로드 숨김
 */

function parseFlags(): Set<string> {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return new Set();
  return new Set(q.split(',').filter(Boolean));
}

function parseTo(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('to');
}

export function useQueryFlags() {
  const flags = useMemo(() => parseFlags(), []);
  const to = useMemo(() => parseTo(), []);

  const has = (flag: string) => flags.has(flag);

  return { flags, has, to };
}
