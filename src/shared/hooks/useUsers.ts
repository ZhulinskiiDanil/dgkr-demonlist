import type { TopUser } from '../types/users';
import type { DGKRVictor } from '../types/demonlist';

import { useMemo } from 'react';
import { useDemonlistQuery } from './useDemonlistQuery';
import { useDGKRListQuery } from './useDGKRListQuery';

export function useUsers(): TopUser[] {
  const { data: demonlist } = useDemonlistQuery();
  const { data: dgkrList } = useDGKRListQuery();

  const users = useMemo(() => {
    if (!demonlist || !dgkrList) return [];

    const scoreMap = new Map<number | string, number>();
    demonlist.forEach(({ level_id, score }) => {
      scoreMap.set(level_id, score);
    });

    const userMap = new Map<
      string,
      { victor: DGKRVictor; meta: TopUser['meta'] }
    >();

    dgkrList.forEach(({ levelId, victors }) => {
      victors.forEach((victor: DGKRVictor) => {
        const { victorName } = victor;
        const score = scoreMap.get(levelId) ?? 0;

        if (!userMap.has(victorName)) {
          userMap.set(victorName, {
            victor,
            meta: {
              totalScore: 0,
              count: 0,
            },
          });
        }

        const userData = userMap.get(victorName)!;

        userData.meta.totalScore += score;
        userData.meta.count += 1;
      });
    });

    // Преобразуем levels из Set в массив
    const result = Array.from(userMap.values()).map(({ victor, meta }) => ({
      victor,
      meta: {
        totalScore: meta.totalScore,
        count: meta.count,
      },
    }));

    // Сортируем по убыванию totalScore
    result.sort((a, b) => b.meta.totalScore - a.meta.totalScore);

    return result;
  }, [demonlist, dgkrList]);

  return users;
}
