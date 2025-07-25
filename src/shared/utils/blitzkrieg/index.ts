import type { Stage } from '@/shared/types/blitzkrieg';

export function generateStages(sps: number[]): Stage[] {
  if (sps[0] !== 0) sps.unshift(0);
  if (sps[sps.length - 1] !== 100) sps.push(100);

  const stages: Stage[] = [];
  const seen = new Set<string>(); // Хранилище уже добавленных диапазонов

  for (let i = 0; i < sps.length; i++) {
    const stageRanges: Stage['ranges'] = [];

    const from1 = sps[sps.length - 1 - i];
    const to1 = 100;
    const key1 = `${from1}-${to1}`;
    if (from1 !== to1 && !seen.has(key1)) {
      seen.add(key1);
      stageRanges.push({ from: from1, to: to1, checked: false });
    }

    for (let j = sps.length - i - 1; j > 0; j--) {
      const from2 = sps[j - 1];
      const to2 = sps[j + i];
      const key2 = `${from2}-${to2}`;
      if (from2 !== to2 && !seen.has(key2)) {
        seen.add(key2);
        stageRanges.push({ from: from2, to: to2, checked: false });
      }
    }

    if (stageRanges.length > 0) {
      stages.push({
        stage: i + 1,
        note: '',
        ranges: stageRanges,
      });
    }
  }

  return stages;
}
