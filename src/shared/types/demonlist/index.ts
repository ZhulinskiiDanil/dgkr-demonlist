export type DemonlistLevel = {
  id: number;
  level_id: number;
  verifier_id: number;
  place: number;
  score: number;
  minimal_percent: number;
  length: number;
  objects: number;
  name: string;
  description: string;
  verifier: string;
  creator: string;
  holder: string;
  video: string;
  song: string;
  created_in: string;
  password: string;
};

export type DGKRVictor = {
  discordTag: string; // минимальная видимая информация о Discord (например, username#1234)
  demonlistNick: string; // ник на demonlist сайте
  percent: number; // процент прохождения (1-100)
  flag: string | null; // флаг, например, "verified", "unverified", "incomplete"
  videoUrl: string; // ссылка на видео прохождения
  addedAt: string; // дата прохождения в формате ISO (например, "2023-10-01T12:00:00Z")
};

export type DGKRListLevel = {
  name: string;
  levelId: number;
  victors: DGKRVictor[];
};
