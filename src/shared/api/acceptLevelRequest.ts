import Cookies from 'js-cookie';

type LevelRequestPayload = {
  place: number;
  creator: string;
  levelName: string;
  victorName: string;
  discordName: string;
  youtubeUrl: string;
  levelId: string;
};

type LevelRequestResponse = {
  success: boolean;
  isError: boolean;
  message: string | null;
};

export async function acceptLevelRequest({
  place,
  creator,
  levelName,
  victorName,
  discordName,
  youtubeUrl,
  levelId,
}: LevelRequestPayload): Promise<LevelRequestResponse> {
  const payload = {
    place,
    creator,
    levelName,
    victorName,
    discordName,
    youtubeUrl,
    levelId,
  };

  try {
    const moderatorToken = Cookies.get('moderatorToken');

    if (!moderatorToken) {
      console.error('❌ Ошибка при отправке:', 'Неверный токен');

      return {
        success: false,
        isError: false,
        message: 'Неверный токен',
      };
    }

    const response = await fetch('/api/discord-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        moderatorToken: moderatorToken,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Ошибка при отправке:', error);

      return {
        success: false,
        isError: true,
        message: String(error),
      };
    }

    return {
      success: true,
      isError: false,
      message: null,
    };
  } catch (error) {
    console.error('❌ Ошибка сети:', error);

    return {
      success: false,
      isError: true,
      message: String(error),
    };
  }
}
