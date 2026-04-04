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
 */

function parseFlags(): Set<string> {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return new Set();
  return new Set(q.split(',').filter(Boolean));
}

export function useQueryFlags() {
  const flags = useMemo(() => parseFlags(), []);

  const has = (flag: string) => flags.has(flag);

  return { flags, has };
}
