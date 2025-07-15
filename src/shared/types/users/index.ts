import type { DGKRVictor } from '../demonlist';

export type TopUser = {
  victor: DGKRVictor;
  meta: {
    totalScore: number;
    count: number;
  };
};
