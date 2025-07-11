import { getYoutubeVideoId } from '@/shared/utils/getYoutubeVideoId';
import { NextResponse } from 'next/server';

type WebhookRequestBody = {
  victorName: string;
  discordName: string;
  youtubeUrl: string;
  levelId: string;
};

const DISCORD_MODERATOR_SECRET = process.env.DISCORD_MODERATOR_SECRET;

export async function POST(req: Request) {
  const origin = req.headers.get('origin'); // https://example.com

  if (!DISCORD_MODERATOR_SECRET) {
    console.error(
      'DISCORD_MODERATOR_SECRET is not set in environment variables'
    );
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  const moderatorToken = req.headers.get('moderatorToken');
  if (moderatorToken !== `Bearer ${DISCORD_MODERATOR_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const webhookUrl =
    'https://discord.com/api/webhooks/1393032136281423985/wnJo7L_PB-dpU3H52LQWjIb8C5j4qkv08Mww3zPe5YPS5BVyh4Uf9ZEbt1j_5677xaMO';

  try {
    const body: WebhookRequestBody = await req.json();
    const { victorName, discordName, youtubeUrl, levelId } = body;
    const youtubeId = getYoutubeVideoId(youtubeUrl);
    const parsedYoutubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    if (!victorName || !discordName || !youtubeUrl || !levelId) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    // Формируем URL с query-параметрами
    const queryParams = new URLSearchParams({
      victorName,
      discordName,
      youtubeUrl,
      levelId,
    }).toString();

    const addToListUrl = `${origin}/demonlist/add?${queryParams}`;

    const payload = {
      content: `🏆 Новый рекорд от **${victorName} / @${discordName}**`,
      color: 0x1abc9c,
      embeds: [
        {
          title: 'Информация о рекорде',
          color: 65280,
          description: `[Добавить в лист](${addToListUrl})`,
          fields: [
            {
              name: 'Level ID',
              value: levelId || 'Не указано',
              inline: false,
            },
            {
              name: 'YouTube',
              value: parsedYoutubeUrl
                ? `[Видео](${parsedYoutubeUrl})`
                : 'Не указано',
              inline: false,
            },
          ],
          image: {
            url: thumbnail,
          },
        },
      ],
    };

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) {
      const errorText = await discordRes.text();
      return NextResponse.json(
        { error: 'Ошибка при отправке вебхука', details: errorText },
        { status: discordRes.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Сообщение успешно отправлено в Discord' },
      { status: 200 }
    );
  } catch (error: unknown) {
    let message = 'Неизвестная ошибка';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', details: message },
      { status: 500 }
    );
  }
}
