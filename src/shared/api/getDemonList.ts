import type { DemonlistLevel } from '../types/demonlist';

const isClient = () => typeof window !== 'undefined';

export async function getDemonList() {
  const response = isClient()
    ? await fetch(`/api/demonlist`)
    : await fetch(
        'https://api.demonlist.org/levels/classic?search=&levels_type=all&limit=0',
        {
          next: { revalidate: 60 * 60 * 2 }, // Кэш на 2 часа
        }
      );

  if (!response.ok) {
    return [];
  }

  const json = await response.json();
  if (json?.data && Array.isArray(json.data)) {
    return json.data as DemonlistLevel[];
  }
  return [];
}
