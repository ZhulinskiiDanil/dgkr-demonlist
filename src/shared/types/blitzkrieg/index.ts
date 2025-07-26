export type Stage = {
  stage: number;
  note: string;
  ranges: { from: number; to: number; checked: boolean; note: string }[];
};
