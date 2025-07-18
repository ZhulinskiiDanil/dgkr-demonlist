'use client';

import { useEffect } from 'react';

import Script from 'next/script';
import { UIButton } from '@/shared/ui/Button/ui';
import { UINavButton } from '@/shared/ui/NavButton/ui';

declare global {
  interface Window {
    like?: (el: HTMLElement) => void;
  }
}

export default function DSServerLikeButton({
  navButton,
  onClick,
  ...props
}: React.ComponentProps<typeof UIButton> & {
  navButton?: boolean;
}) {
  const buttonLabel = 'Поднять Сервер';

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://discordserver.info/like.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadScript();
  }, []);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Вызываем функцию like из внешнего скрипта
    if (typeof window !== 'undefined' && typeof window.like === 'function') {
      // Find the closest parent <a> element or use currentTarget if it's a link
      let targetLink: HTMLElement | null = e.currentTarget;
      if (!(targetLink instanceof HTMLAnchorElement)) {
        targetLink = e.currentTarget.closest('a');
      }

      if (!targetLink) {
        console.error('No link element found for like()');
        return;
      }

      window.like(targetLink);
    } else {
      console.error('Функция like() недоступна');
    }
  };

  return (
    <>
      {navButton ? (
        <UINavButton
          href="https://discordserver.info/1391010207097683968/like"
          external
          onClick={(e) => {
            e.preventDefault();
            handleLike(e);
            onClick?.(e);
          }}
          {...props}
        >
          {buttonLabel}
        </UINavButton>
      ) : (
        <UIButton
          href="https://discordserver.info/1391010207097683968/like"
          external
          onClick={(e) => {
            e.preventDefault();
            handleLike(e);
            onClick?.(e);
          }}
          {...props}
        >
          {buttonLabel}
        </UIButton>
      )}
      <Script
        src="https://discordserver.info/like.js"
        strategy="afterInteractive"
      />
    </>
  );
}
