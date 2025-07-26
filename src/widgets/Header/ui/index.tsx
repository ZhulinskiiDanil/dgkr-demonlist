'use client';

import styles from './Header.module.scss';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import Link from 'next/link';
import Image from 'next/image';
import DSServerLikeButton from '@/widgets/DSServerLikeButton/ui';
import { UIButton } from '@/shared/ui/Button/ui';
import { UINavButton } from '@/shared/ui/NavButton/ui';
import clsx from 'clsx';

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.cw}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            title="Join our Discord"
            width={48}
            height={48}
            className={styles.logo}
          />
        </Link>

        <div className={styles.nav}>
          <Link
            href="/"
            className={clsx(styles.link, pathname === '/' && styles.current)}
          >
            Главная
          </Link>
          <Link
            href="/users"
            className={clsx(
              styles.link,
              pathname === '/users' && styles.current
            )}
          >
            Рейтинг
          </Link>
          <Link
            href="/blitzkrieg"
            className={clsx(
              styles.link,
              pathname === '/blitzkrieg' && styles.current
            )}
          >
            Блицкриг
          </Link>
        </div>

        <div className={styles.right}>
          {/* Desktop buttons */}
          <div className={styles.buttonsDesktop}>
            <HeaderButtons />
          </div>

          {/* Hamburger */}
          <button
            className={styles.burger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={menuOpen ? styles.burgerLineActive : styles.burgerLine}
            ></span>
            <span
              className={menuOpen ? styles.burgerLineActive : styles.burgerLine}
            ></span>
            <span
              className={menuOpen ? styles.burgerLineActive : styles.burgerLine}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <HeaderMobileMenu opened={menuOpen} toggleMenu={toggleMenu} />
    </header>
  );
}

function HeaderButtons() {
  const { data: session } = useSession();

  return (
    <div className={styles.buttons}>
      {session?.user ? (
        <>
          <span className={styles.username}>{session.user.name}</span>
          <UIButton onClick={() => signOut()}>Выйти</UIButton>
        </>
      ) : (
        <UIButton className={styles.button} onClick={() => signIn('discord')}>
          Войти с Discord
        </UIButton>
      )}
    </div>
  );
}

function HeaderMobileMenu({
  opened = false,
  toggleMenu,
}: {
  opened?: boolean;
  toggleMenu?: () => void;
}) {
  return (
    <>
      <div className={styles.mobileMenuWrapper}>
        <div
          className={`${styles.mobileMenu} ${opened ? styles.mobileMenuOpen : ''}`}
        >
          <div className={styles.menuHeader}>
            <Link href="https://discord.gg/z9pmtkHX9b" target="_blank">
              <Image
                src="/logo.png"
                alt="Logo"
                title="Join our Discord"
                width={48}
                height={48}
                className={styles.logo}
              />
            </Link>
            <div className={styles.dgkrWrapper}>
              <Image
                alt="DGKR"
                src="/logo - DGKR.png"
                objectFit="contain"
                className={styles.dgkr}
                fill
              />
            </div>
          </div>
          <HeaderMobileButtons />
        </div>
      </div>

      {/* Overlay */}
      {opened && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </>
  );
}

function HeaderMobileButtons() {
  const { data: session } = useSession();

  return (
    <div className={styles.buttons}>
      <UINavButton href="/users" fill onClick={() => signOut()}>
        Рейтинг игроков
      </UINavButton>
      <iframe
        src="https://discord.com/widget?id=1391010207097683968&theme=dark"
        width="100%"
        height="100%"
        style={{ borderRadius: '0.5rem', border: 'none' }}
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>

      <hr className={styles.hr} style={{ marginTop: 'auto' }} />

      {/* Like Server Button */}
      <DSServerLikeButton navButton fill />
      <UINavButton href="https://discord.gg/z9pmtkHX9b" external fill big>
        Присоедениться к серверу
      </UINavButton>

      {session?.user ? (
        <>
          <span className={styles.username}>{session.user.name}</span>
          <UINavButton fill onClick={() => signOut()}>
            Выйти
          </UINavButton>
        </>
      ) : (
        <UINavButton variant="discord" fill onClick={() => signIn('discord')}>
          Вход в аккаунт
        </UINavButton>
      )}
    </div>
  );
}
