import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.demonlist.org/levels/classic?search=&levels_type=all&limit=0',
      {
        next: { revalidate: 60 * 60 * 2 }, // Кэш на 2 часа
      }
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json(
      { error: 'Не удалось получить данные с Demonlist API' },
      { status: 500 }
    );
  }
}
