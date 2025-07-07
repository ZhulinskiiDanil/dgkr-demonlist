'use client';

import styles from './Header.module.scss';
import { useState } from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import DSServerLikeButton from '@/widgets/DSServerLikeButton/ui';
import { UIButton } from '@/shared/ui/Button/ui';
import { UINavButton } from '@/shared/ui/NavButton/ui';

export function Header() {
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

        <div className={styles.dgkrWrapper}>
          <Image
            alt="DGKR"
            src="/logo - DGKR.png"
            objectFit="contain"
            className={styles.dgkr}
            fill
          />
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
      <div
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ''
        }`}
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
      {menuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </header>
  );
}

function HeaderNavButtons() {
  const { data: session } = useSession();

  return (
    <div className={styles.buttons}>
      {/* Like Server Button */}
      <DSServerLikeButton navButton fill />

      <hr className={styles.hr} />

      {session?.user ? (
        <>
          <span className={styles.username}>{session.user.name}</span>
          <UINavButton fill onClick={() => signOut()}>
            Выйти
          </UINavButton>
        </>
      ) : (
        <UINavButton fill variant="discord" onClick={() => signIn('discord')}>
          Войти с Discord
        </UINavButton>
      )}
    </div>
  );
}

function HeaderButtons() {
  const { data: session } = useSession();

  return (
    <div className={styles.buttons}>
      <DSServerLikeButton />
      {session?.user ? (
        <>
          <span className={styles.username}>{session.user.name}</span>
          <UIButton onClick={() => signOut()}>Выйти</UIButton>
        </>
      ) : (
        <UIButton onClick={() => signIn('discord')}>Войти с Discord</UIButton>
      )}
    </div>
  );
}
