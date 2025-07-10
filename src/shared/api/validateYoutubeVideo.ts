export async function validateYoutubeVideo(
  url: string
): Promise<{ valid: boolean; reason?: string }> {
  // Нормализация shorts → watch?v=
  const shortsRegex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/([\w-]{11})(\?.*)?$/;
  if (shortsRegex.test(url)) {
    url = url.replace(shortsRegex, 'https://www.youtube.com/watch?v=$3');
  }

  // Проверка формата ссылки
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([\w-]{11})(&.*)?$/;
  const match = url.match(youtubeRegex);

  if (!match) {
    return { valid: false, reason: 'Неверный формат ссылки' };
  }

  // Проверка существования видео через oEmbed
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);

    if (response.ok) {
      return { valid: true };
    } else if (response.status === 404) {
      return { valid: false, reason: 'Видео не существует' };
    } else {
      return { valid: false, reason: `Ошибка проверки: ${response.status}` };
    }
  } catch {
    return { valid: false, reason: 'Ошибка сети или YouTube' };
  }
}
