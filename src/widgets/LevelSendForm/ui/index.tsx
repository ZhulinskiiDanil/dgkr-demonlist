'use client';
import _ from 'lodash';
import styles from './LevelSendForm.module.scss';

import type {
  DemonlistLevel,
  DGKRListLevel,
  DGKRVictor,
} from '@/shared/types/demonlist';

import { useEffect, useState } from 'react';
import { useDemonlistQuery } from '@/shared/hooks/useDemonlistQuery';
import { useDGKRListQuery } from '@/shared/hooks/useDGKRListQuery';

import { UIButton } from '@/shared/ui/Button/ui';
import clsx from 'clsx';

export default function LevelSendForm() {
  const { data: demonlist } = useDemonlistQuery();
  const { data: dgkrList } = useDGKRListQuery();

  // Управляемые состояния
  const [level, setLevel] = useState<DemonlistLevel | null>(null);
  const [levelId, setLevelId] = useState('');
  const [victorName, setVictorName] = useState('');
  const [discord, setDiscord] = useState('');
  const [youtube, setYouTube] = useState('');
  const [jsonList, setJsonList] = useState(
    JSON.stringify(dgkrList, undefined, 2)
  );

  const [error, setError] = useState(''); // для ошибок

  const listMatches = _.uniqBy(
    demonlist
      .filter((elm) => {
        if (levelId) {
          return (JSON.stringify(elm) + `#${elm.place}`).includes(levelId);
        }
        {
          return false;
        }
      }) // выбираем по ID
      .concat(demonlist),
    (level) => level.level_id
  ).slice(0, 5);

  function saveDGKRList(list: DGKRListLevel[]) {
    setJsonList(JSON.stringify(list, undefined, 2));
  }

  function handleLevelClick(level: DemonlistLevel) {
    setLevelId(level.level_id.toString());
  }

  function handleCopyList() {
    navigator.clipboard.writeText(jsonList);
  }

  function handleResetList() {
    setJsonList(JSON.stringify(dgkrList, undefined, 2));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // отменяем стандартный submit
    setError(''); // сбрасываем ошибку

    // Простая валидация
    if (!levelId || !victorName || !discord || !youtube) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Если всё ок - можно отправлять данные
    const payload = {
      levelId,
      listName: victorName,
      discord,
      youtube,
    };

    if (!level) {
      setError('Уровня с таким ID нет');
      return;
    }

    // ✅ Validate YouTube link
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;

    if (!youtubeRegex.test(payload.youtube)) {
      setError('Введите корректную ссылку на YouTube');
      return;
    }

    const newVictor: DGKRVictor = {
      percent: 100,
      victorName,
      videoUrl: youtube,
      flag: null,
      discordTag: discord,
      addedAt: new Date().toISOString(),
    };

    const dgkrListCopy = _.cloneDeep(dgkrList);
    let dgkrLevel = dgkrList.find(
      (level) => level.levelId.toString() === levelId
    );

    if (!dgkrLevel) {
      // ✅ Если уровня нет — создаём новый
      const newLevel: DGKRListLevel = {
        name: level.name, // название берем из input
        levelId: parseInt(levelId), // приводим к числу
        victors: [], // сразу добавляем победителя
      };

      dgkrListCopy.push(newLevel);
      dgkrLevel = dgkrListCopy.find(
        (level) => level.levelId.toString() === levelId
      );
    }

    if (!dgkrLevel) {
      setError('Не удалось создать уровень');
      return;
    }

    // ✅ Проверка на наличие такого победителя в этом уровне
    const isVictorExists = dgkrLevel.victors.some(
      (v) => v.victorName === victorName || v.discordTag === discord
    );

    if (isVictorExists) {
      setError('Этот победитель уже есть на данном уровне');
      return;
    }

    // ✅ Попытка найти флаг по другим уровням
    const existingFlag = dgkrList
      .flatMap((level) => level.victors) // собираем всех победителей
      .find((victor) => victor.victorName === victorName)?.flag;

    if (existingFlag && existingFlag !== 'N/A') {
      newVictor.flag = existingFlag; // присваиваем найденный флаг
    }

    // Добавляем нового победителя к списку уровня
    const updatedVictors = [...dgkrLevel.victors, newVictor];

    // Создаём новый список уровней с обновлённым уровнем
    const newList = dgkrListCopy.map((level) =>
      level.levelId.toString() === levelId
        ? { ...level, victors: updatedVictors }
        : level
    );

    // console.log('✅ Обновлённый список уровней:', newList);
    saveDGKRList(newList);
  };

  useEffect(() => {
    const level = demonlist.find(
      (level) => level.level_id.toString() === levelId
    );

    if (level) {
      setLevel(level);
    } else {
      setLevel(null);
    }
  }, [levelId]);

  useEffect(() => {
    setJsonList(JSON.stringify(dgkrList, undefined, 2));
  }, [dgkrList]);

  return (
    <div className={styles.formWrapper}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div>
          Current level:{' '}
          {level ? (
            <p className={styles.title}>
              <span>{level.name}</span> <b>by {level.creator}</b>
            </p>
          ) : (
            <p className={styles.title}>N/A</p>
          )}
        </div>
        <input
          type="text"
          placeholder="Level ID"
          value={levelId}
          onChange={(e) => setLevelId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Listname"
          value={victorName}
          onChange={(e) => setVictorName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Discord"
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
        />
        <input
          type="text"
          placeholder="YouTube"
          value={youtube}
          onChange={(e) => setYouTube(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttons}>
          <UIButton className={styles.button} type="submit" fill big>
            Создать новый лист
          </UIButton>
          <UIButton className={styles.button} type="button" fill big>
            Очистить все поля
          </UIButton>
        </div>
      </form>
      <div className={styles.sidebar}>
        {listMatches.map((elm) => (
          <div
            key={elm.level_id}
            className={clsx(
              styles.levelItem,
              elm.level_id === level?.level_id && styles.selected
            )}
            onClick={() => {
              handleLevelClick(elm);
            }}
          >
            <h4>
              #{elm.place} - <b>{elm.name}</b>
            </h4>
            <p>by {elm.creator}</p>
            <p>ID: {elm.level_id}</p>
          </div>
        ))}
      </div>
      <div className={styles.jsonWrapper}>
        <textarea
          value={jsonList}
          onChange={(e) => setJsonList(e.target.value)}
          className={styles.json}
        ></textarea>
        <div className={styles.buttons}>
          <UIButton
            fill
            className={styles.button}
            big
            onClick={handleResetList}
          >
            Сбросить лист
          </UIButton>
          <UIButton fill className={styles.button} big onClick={handleCopyList}>
            Копировать новый лист
          </UIButton>
        </div>
      </div>
    </div>
  );
}
