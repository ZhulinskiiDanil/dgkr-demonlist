export function generateStages(sps: number[]) {
  if (sps[0] !== 0) sps.unshift(0);
  if (sps[sps.length - 1] !== 100) sps.push(100);

  const stages = [];

  for (let i = 0; i < sps.length; i++) {
    const stageRanges: { from: number; to: number }[] = [];

    const from1 = sps[sps.length - 1 - i];
    const to1 = 100;
    if (from1 !== to1) {
      stageRanges.push({
        from: from1,
        to: to1,
      });
    }

    for (let j = sps.length - i - 1; j > 0; j--) {
      const from2 = sps[j - 1];
      const to2 = sps[j + i];
      if (from2 !== to2) {
        stageRanges.push({
          from: from2,
          to: to2,
        });
      }
    }

    stages.push({
      stage: i + 1,
      ranges: stageRanges,
    });
  }

  return stages;
}
