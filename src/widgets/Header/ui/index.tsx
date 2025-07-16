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

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.cw}>
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

        <Link href="/">
          <div className={styles.dgkrWrapper}>
            <Image
              alt="DGKR"
              src="/logo - DGKR.png"
              objectFit="contain"
              className={styles.dgkr}
              fill
            />
          </div>
        </Link>

        <hr className={styles.hr} data-vertical />

        {pathname === '/' ? (
          <>
            <Image
              className={styles.rank}
              src="/icons/rankIcon_top10.png"
              width={28}
              height={24}
              alt="Rank"
            />
            <Link href="/users" className={styles.button}>
              Рейтинг игроков
            </Link>
          </>
        ) : (
          <Link href="/" className={styles.button}>
            На главную
          </Link>
        )}

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
      <HeaderNav opened={menuOpen} toggleMenu={toggleMenu} />
    </header>
  );
}

function HeaderNav({
  opened = false,
  toggleMenu,
}: {
  opened?: boolean;
  toggleMenu?: () => void;
}) {
  return (
    <>
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
        <HeaderNavButtons />
      </div>

      {/* Overlay */}
      {opened && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </>
  );
}

function HeaderNavButtons() {
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
