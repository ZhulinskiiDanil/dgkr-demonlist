'use client';
import styles from './DGKRList.module.scss';

import Fuse from 'fuse.js';

import { DGKRListLevel } from '../DGKRListLevel/ui';
import { useState } from 'react';
import { useDGKRListQuery } from '@/shared/hooks/useDGKRListQuery';
import { useDemonlistQuery } from '@/shared/hooks/useDemonlistQuery';

export function DGKRList() {
  const { data: levelsList } = useDGKRListQuery();
  const { data: demonlist } = useDemonlistQuery();

  const [query, setQuery] = useState('');

  function getDemonlistLevelById(id: string | number) {
    return demonlist.find((level) => level.level_id === id) || null;
  }

  function getItemsText(count: number) {
    const pluralRules = new Intl.PluralRules('ru-RU');
    const suffixes: Record<Intl.LDMLPluralRule, string> = {
      one: 'элемент',
      few: 'элемента',
      many: 'элементов',
      other: 'элемента',
      two: 'элемента',
      zero: 'элемент',
    };

    const rule = pluralRules.select(count);
    return `${count} ${suffixes[rule]}`;
  }

  function getFoundText(count: number) {
    const pluralRules = new Intl.PluralRules('ru-RU');
    const suffixes: Record<Intl.LDMLPluralRule, string> = {
      one: 'найден',
      few: 'найдено',
      many: 'найдено',
      other: 'найдено',
      two: 'найдено',
      zero: 'найдено',
    };

    const rule = pluralRules.select(count);
    return suffixes[rule];
  }

  const parsedLevels = levelsList
    .map((level) => ({
      level,
      listmeta: demonlist.find(
        (demonlistLevel) => demonlistLevel.level_id === level.levelId
      ),
    }))
    .filter(
      (
        elm
      ): elm is NonNullable<typeof elm> & {
        listmeta: NonNullable<typeof elm.listmeta>;
      } => !!elm.listmeta
    );

  // Sort levels by place
  const sortedLevels =
    parsedLevels?.sort((a, b) => {
      const aLevel = getDemonlistLevelById(a.level.levelId);
      const bLevel = getDemonlistLevelById(b.level.levelId);

      if (!aLevel || !bLevel) return 0;
      const placeA = aLevel.place || 0;
      const placeB = bLevel.place || 0;
      return placeA - placeB;
    }) || [];

  // Настройки Fuse.js
  const fuse = new Fuse(sortedLevels, {
    keys: [
      'level.name',
      'listmeta.creator',
      'listmeta.verifier',
      'level.victors.victorName',
    ],
    threshold: 0.3, // чувствительность (меньше = строже)
  });

  // Если есть query - используем Fuse.js, иначе оставляем отсортированный список
  const filteredLevels = query
    ? fuse.search(query).map((result) => result.item)
    : sortedLevels;

  return (
    <div className={styles.listWrapper}>
      <div className={styles.search}>
        <p className={styles.title}>Поиск по списку</p>
        <input
          type="text"
          placeholder="Поиск по имени, создателю, вериферу..."
          className={styles.searchInput} // добавь стили для инпута в DGKRList.module.scss
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!filteredLevels.length && (
          <p className={styles.sub}>По запросу "{query}" ничего найдено</p>
        )}
        {query.length > 1 && filteredLevels.length > 0 && (
          <p className={styles.sub}>
            По запросу "{query}" {getFoundText(filteredLevels.length)}{' '}
            {getItemsText(filteredLevels.length)}
          </p>
        )}
      </div>

      <ul className={styles.list}>
        {filteredLevels.map((level, index) => {
          return (
            <DGKRListLevel
              key={level.level.levelId}
              data={level.level}
              demonlistLevel={level.listmeta}
              place={index + 1}
            />
          );
        })}
      </ul>
    </div>
  );
}
