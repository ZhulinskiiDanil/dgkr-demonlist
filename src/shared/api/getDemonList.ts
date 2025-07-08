import type { DemonlistLevel } from '../types/demonlist';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // На клиенте можно использовать относительный путь
    return '';
  }

  // На сервере: определяем базовый URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback для локальной разработки
  return 'http://localhost:3000';
};

export async function getDemonList() {
  const response = await fetch(`${getBaseUrl()}/api/demonlist`);
  if (!response.ok) {
    return [];
  }
  const json = await response.json();
  if (json?.data && Array.isArray(json.data)) {
    return json.data as DemonlistLevel[];
  }
  return [];
}
