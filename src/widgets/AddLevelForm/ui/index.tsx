'use client';

import _ from 'lodash';
import clsx from 'clsx';
import styles from './AddLevelForm.module.scss';
import Cookies from 'js-cookie';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import type {
  DemonlistLevel,
  DGKRListLevel,
  DGKRVictor,
} from '@/shared/types/demonlist';

import { hasFlag } from 'country-flag-icons';
import { validateYoutubeVideo } from '@/shared/api/validateYoutubeVideo';
import { useEffect, useMemo, useState } from 'react';
import { useDemonlistQuery } from '@/shared/hooks/useDemonlistQuery';
import { useDGKRListQuery } from '@/shared/hooks/useDGKRListQuery';

import { UIButton } from '@/shared/ui/Button/ui';
import { useSearchParams } from 'next/navigation';
import { acceptLevelRequest } from '@/shared/api/acceptLevelRequest';

export enum PanelVariant {
  ADD_VICTOR = 'ADD_VICTOR',
  CHANGE_FLAG = 'CHANGE_FLAG',
}

const MySwal = withReactContent(Swal);

export default function AddLevelForm() {
  const searchParams = useSearchParams();
  const { data: demonlist } = useDemonlistQuery();
  const { data: dgkrList } = useDGKRListQuery();

  const [panelVariant, setPanelVariant] = useState<PanelVariant>(
    PanelVariant.ADD_VICTOR
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState('');
  const [level, setLevel] = useState<DemonlistLevel | null>(null);
  const [levelId, setLevelId] = useState('');
  const [victorName, setVictorName] = useState('');
  const [flagVictorName, setFlagVictorName] = useState('');
  const [discordName, setDiscordName] = useState('');
  const [youtube, setYouTube] = useState('');
  const [isVideoValid, setIsVideoValid] = useState(false);
  const [jsonList, setJsonList] = useState(
    JSON.stringify(dgkrList, undefined, 2)
  );
  const listMatches = useMemo(() => {
    return _.uniqBy(
      demonlist
        .filter((elm) => {
          if (levelId) {
            return (JSON.stringify(elm) + `#${elm.place}`).includes(levelId);
          }
          {
            return false;
          }
        })
        .concat(demonlist),
      (level) => level.level_id
    ).slice(0, 5);
  }, [demonlist, levelId]);

  const debouncedValidate = useMemo(() => {
    return _.debounce(async (url: string) => {
      const notFoundErrorText = 'Видео не существует';
      const result = await validateYoutubeVideo(url);
      setIsVideoValid(result.valid);

      if (!result.valid && url) {
        setError(notFoundErrorText);
      } else if (error === notFoundErrorText) {
        setError('');
      }
    }, 500);
  }, [error]);

  function saveDGKRList(list: DGKRListLevel[]) {
    setJsonList(JSON.stringify(list, undefined, 2));
  }

  const handleSetToken = async () => {
    const { value: token } = await MySwal.fire({
      title: 'Введите ключ модератора',
      input: 'password',
      text: 'Для отправки запроса требуется ключ модератора',
      inputPlaceholder: 'Введите ключ модератора',
      showCancelButton: true,
      theme: 'dark',
      confirmButtonText: 'Записать ключ модератора',
      cancelButtonText: 'Отменить',
      customClass: {
        confirmButton: 'swal2-confirm-stretch',
        cancelButton: 'swal2-cancel-stretch',
        actions: 'swal2-stretch-buttons swal2-actions-padding',
      },
    });

    if (token) {
      // Установить куку на 7 дней
      Cookies.set('moderatorToken', `Bearer ${token}`, {
        expires: 7, // 7 дней
        secure: true, // только по HTTPS
        sameSite: 'strict', // защитит от CSRF
        path: '/', // доступна на всём сайте
      });

      await MySwal.fire({
        icon: 'success', // ✅ иконка успеха
        title: 'Ключ сохранён',
        text: 'Теперь вы можете отправлять запросы как модератор.',
        confirmButtonText: 'Отлично!',
        theme: 'dark',
      });
    }
  };

  const isTokenExists = () => !!Cookies.get('moderatorToken');

  function handleLevelClick(level: DemonlistLevel) {
    setLevelId(level.level_id.toString());
  }

  function handleCopyList() {
    navigator.clipboard.writeText(jsonList);
  }

  function handleResetList() {
    setJsonList(JSON.stringify(dgkrList, undefined, 2));
  }

  const handleVictorSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // отменяем стандартный submit
    setError(''); // сбрасываем ошибку

    // Простая валидация
    if (!levelId || !victorName || !discordName || !youtube) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Если всё ок - можно отправлять данные
    const payload = {
      levelId,
      listName: victorName,
      discord: discordName,
      youtube,
    };

    if (!level) {
      setError('Уровня с таким ID нет');
      return;
    }

    // ✅ Validate YouTube link
    const youtubeUrl = payload.youtube.trim();

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/;

    if (!youtubeRegex.test(youtubeUrl)) {
      setError('Введите корректную ссылку на YouTube');
      return;
    }

    const newVictor: DGKRVictor = {
      percent: 100,
      victorName,
      videoUrl: youtubeUrl,
      flag: null,
      discordTag: discordName,
      addedAt: new Date().toISOString(),
    };

    const dgkrListCopy: DGKRListLevel[] = JSON.parse(jsonList);
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
      setError('Не удалось добавить уровень');
      return;
    }

    // ✅ Проверка на наличие такого победителя в этом уровне
    const isVictorExists = dgkrLevel.victors.some(
      (v) => v.victorName === victorName || v.discordTag === discordName
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

    saveDGKRList(newList);
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ✅ Простая валидация
    if (!flagVictorName || !flag) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    let victor = null as DGKRVictor | null;

    dgkrList.find((level) => {
      const findedVictor = level.victors.find(
        (victor) => victor.victorName === flagVictorName
      );

      if (findedVictor) {
        victor = findedVictor;
      }

      return !!findedVictor;
    });

    if (!victor) {
      setError(`Не удалось найти пользователя с ником "${flagVictorName}"`);
      return;
    }

    if (!hasFlag(flag.toUpperCase()) && flag !== 'N/A') {
      setError(`Не удалось найти флаг "${flag.toUpperCase()}"`);
      return;
    }

    const newList: DGKRListLevel[] = JSON.parse(jsonList);
    newList.forEach((level) => {
      level.victors.forEach((victor) => {
        if (victor.victorName === flagVictorName) {
          victor.flag = flag === 'N/A' ? null : flag.toUpperCase();
        }
      });
    });

    saveDGKRList(newList);
  };

  const handleAcceptLevelRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isTokenExists()) {
      await handleSetToken();
    }

    if (!isTokenExists()) {
      setError('Отказано в доступе');
      return;
    }

    // ✅ Простая валидация
    if (!levelId || !victorName || !discordName || !youtube) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // ✅ Validate YouTube link
    const youtubeUrl = youtube.trim();

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/;

    if (!youtubeRegex.test(youtubeUrl)) {
      setError('Введите корректную ссылку на YouTube');
      return;
    }

    const dgkrLevel = dgkrList.find(
      (level) => level.levelId.toString() === levelId
    );

    // ✅ Проверка на наличие такого победителя в этом уровне
    const isVictorExists = dgkrLevel?.victors.some(
      (v) => v.victorName === victorName || v.discordTag === discordName
    );

    if (isVictorExists) {
      setError('Этот победитель уже есть на данном уровне');
      return;
    }

    if (!level) {
      setError("Ну удалось найти уровень в global demon list'е");
      return;
    }

    setLoading(true);
    await acceptLevelRequest({
      place: level.place,
      creator: level.creator,
      levelName: level.name,
      victorName,
      discordName,
      levelId,
      youtubeUrl: youtube,
    });
    setLoading(false);
  };

  // Auto fill fields from query
  useEffect(() => {
    if (demonlist.length && dgkrList.length) {
      setVictorName(searchParams.get('victorName') || '');
      setDiscordName(searchParams.get('discordName') || '');
      setYouTube(searchParams.get('youtubeUrl') || '');
      setLevelId(searchParams.get('levelId') || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demonlist, dgkrList]);

  // Auto find level from input
  useEffect(() => {
    const level = demonlist.find(
      (level) => level.level_id.toString() === levelId
    );

    if (level) {
      setLevel(level);
    } else {
      setLevel(null);
    }
  }, [demonlist, levelId]);

  // If it's a Shorts or short link, convert to normal watch link
  useEffect(() => {
    let newYoutubeUrl = youtube.trim();

    // https://www.youtube.com/shorts/SXaOufRuiJ8
    const shortsRegex =
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/([\w-]{11})(\?.*)?$/;
    if (shortsRegex.test(newYoutubeUrl)) {
      newYoutubeUrl = newYoutubeUrl.replace(
        shortsRegex,
        'https://www.youtube.com/watch?v=$3'
      );
    }

    // https://youtu.be/aJP_x31Pp0k
    const shortLinkRegex = /^(https?:\/\/)?youtu\.be\/([\w-]{11})(\?.*)?$/;
    if (shortLinkRegex.test(newYoutubeUrl)) {
      newYoutubeUrl = newYoutubeUrl.replace(
        shortLinkRegex,
        'https://www.youtube.com/watch?v=$2'
      );
    }

    if (youtube !== newYoutubeUrl) {
      setYouTube(newYoutubeUrl);
    }
  }, [youtube]);

  // Validate video url
  useEffect(() => {
    setIsVideoValid(false);
    debouncedValidate(youtube);

    return () => debouncedValidate.cancel();
  }, [youtube, debouncedValidate]);

  // First load dgkrList JSON.stringify
  useEffect(() => {
    setJsonList(JSON.stringify(dgkrList, undefined, 2));
  }, [dgkrList]);

  const addVictorForm = (
    <div className={styles.addVictor}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleVictorSubmit(e);
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
          placeholder="Level ID or Level name"
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
          value={discordName}
          onChange={(e) => setDiscordName(e.target.value)}
        />
        <input
          type="text"
          placeholder="YouTube"
          value={youtube}
          onChange={(e) => setYouTube(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttons}>
          <UIButton
            type="submit"
            className={styles.button}
            disabled={!isVideoValid || loading}
            title={isVideoValid ? '' : 'Неправильная ссылка видео'}
            fill
            big
          >
            Добавить в лист
          </UIButton>
          <UIButton
            type="button"
            className={styles.button}
            disabled={!isVideoValid || loading}
            title={isVideoValid ? '' : 'Неправильная ссылка видео'}
            onClick={handleAcceptLevelRequest}
            fill
          >
            (MOD) Принять реквест
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
    </div>
  );

  const changeFlagForm = (
    <div className={styles.changeFlag}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleFlagSubmit(e);
        }}
      >
        <input
          type="text"
          placeholder="Victor name"
          value={flagVictorName}
          onChange={(e) => setFlagVictorName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Flag"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <UIButton className={styles.button} type="submit" fill big>
          Создать новый лист
        </UIButton>
      </form>
    </div>
  );

  return (
    <div className={styles.formWrapper}>
      <div className={styles.panelButtons}>
        <UIButton
          big
          fill
          disabled={panelVariant === PanelVariant.ADD_VICTOR}
          onClick={() => setPanelVariant(PanelVariant.ADD_VICTOR)}
        >
          Add victor
        </UIButton>
        <UIButton
          big
          fill
          disabled={panelVariant === PanelVariant.CHANGE_FLAG}
          onClick={() => setPanelVariant(PanelVariant.CHANGE_FLAG)}
        >
          Change flag
        </UIButton>
      </div>
      {
        {
          [PanelVariant.ADD_VICTOR]: addVictorForm,
          [PanelVariant.CHANGE_FLAG]: changeFlagForm,
        }[panelVariant]
      }
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
        <UIButton
          big
          fill
          external
          target="_blank"
          href="https://gist.github.com/ZhulinskiiDanil/8133426c3ec239bbb1ce103f6401bb87/edit"
        >
          Перейти на gist
        </UIButton>
      </div>
    </div>
  );
}
