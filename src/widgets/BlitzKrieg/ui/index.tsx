'use client';
import _ from 'lodash';
import styles from './BlitzKrieg.module.scss';

import type { Stage } from '@/shared/types/blitzkrieg';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { generateStages as _generateStages } from '@/shared/utils/blitzkrieg';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Stages } from '../Stages/ui';
import { TagInput } from '@/shared/ui/TagInput';
import { ContextMenu } from '@/shared/ui/ContextMenu/ui';
// import { UIInput } from '@/shared/ui/Input/ui';
import { UIButton } from '@/shared/ui/Button/ui';
import { UIDropdown } from '@/shared/ui/UIDropdown/ui';
import { ChevronDownIcon } from '@/shared/icons/ChevronDown';

const MySwal = withReactContent(Swal);

type BlitzKriegProfile = {
  type: 'tags';
  profileName: string;
  data: {
    tags: (string | number)[];
    stages: Stage[];
  };
};

function generateProfile(
  profileName: string,
  tags: (string | number)[],
  stages: Stage[]
): BlitzKriegProfile {
  return {
    type: 'tags',
    profileName,
    data: { tags, stages },
  };
}

export function BlitzKrieg() {
  const [profileName, setProfileName] = useState('');
  const [profiles, setProfiles] = useState<BlitzKriegProfile[]>([]);
  const profile = useMemo(() => {
    return profiles.find((elm) => elm.profileName === profileName) || null;
  }, [profiles, profileName]);
  const [tags, setTags] = useState<(string | number)[]>([]);
  const startPositions = useMemo(() => {
    return tags
      .map((tag) => parseInt(tag.toString()))
      .filter((tag) => !isNaN(tag));
  }, [tags]);
  const [stages, setStages] = useState(_generateStages(startPositions));

  const generateStages = (startPositions: number[]) => {
    const generatedStages: Stage[] = _generateStages(startPositions);
    const map = new Map<string, Stage['ranges']['0']>();

    for (const stage of generatedStages) {
      for (const range of stage.ranges) {
        const key = `${stage.stage}-${range.from}-${range.to}`;
        map.set(key, range);
      }
    }

    stages.forEach((stage) => {
      stage.ranges.forEach((oldRange) => {
        const key = `${stage.stage}-${oldRange.from}-${oldRange.to}`;
        const range = map.get(key);

        if (range) {
          range.checked = oldRange.checked;
        }
      });
    });

    return generatedStages;
  };

  const getAllProfilesFromStorage = useCallback((): BlitzKriegProfile[] => {
    const profiles: BlitzKriegProfile[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('blitzkrieg-profile-')) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed === 'object' &&
            'type' in parsed &&
            'profileName' in parsed &&
            'data' in parsed
          ) {
            profiles.push(parsed as BlitzKriegProfile);
          }
        } catch {
          // Игнорируем ошибки парсинга
        }
      }
    }

    return profiles;
  }, []);

  async function handleCreateProfile() {
    const { value: profileName } = await MySwal.fire({
      title: 'Создание профиля',
      input: 'text',
      inputLabel: 'Для примера можно написать название уровня',
      inputPlaceholder: 'Название профиля',
      showCancelButton: true,
      theme: 'dark',
      confirmButtonText: 'Создать профиль',
      cancelButtonText: 'Отмена',
      customClass: {
        confirmButton: 'swal2-confirm-stretch',
        cancelButton: 'swal2-cancel-stretch',
        actions: 'swal2-stretch-buttons swal2-actions-padding',
      },
    });

    if (profileName) {
      setProfileName(profileName);
    }

    return {
      profileName,
    };
  }

  async function handleEditProfile() {
    const newProfile = _.cloneDeep(profile);

    if (newProfile) {
      const { value: profileName } = await MySwal.fire({
        title: 'Редактирование профиля',
        input: 'text',
        inputLabel: 'Название профиля',
        inputPlaceholder: 'Название профиля',
        inputValue: newProfile.profileName,
        showCancelButton: true,
        theme: 'dark',
        confirmButtonText: 'Применить изменения',
        cancelButtonText: 'Отмена',
        customClass: {
          confirmButton: 'swal2-confirm-stretch',
          cancelButton: 'swal2-cancel-stretch',
          actions: 'swal2-stretch-buttons swal2-actions-padding',
        },
      });

      localStorage.removeItem(`blitzkrieg-profile-${newProfile.profileName}`);

      newProfile.profileName = profileName;
      localStorage.setItem(
        `blitzkrieg-profile-${profileName}`,
        JSON.stringify(newProfile)
      );

      setProfileName(profileName);
      updateProfilesList();
    }
  }

  async function handleTagsChange(value: typeof tags) {
    let newProfileName = profileName;

    if (!profileName) {
      const { profileName: response } = await handleCreateProfile();
      newProfileName = response;
    }

    if (newProfileName) {
      setTags(value);
    }
  }

  const updateProfilesList = () => {
    const allProfiles = getAllProfilesFromStorage();
    setProfiles(allProfiles);
  };

  // Set/Update profile
  const handleUpdateProfile = () => {
    const profile = profiles.find((elm) => elm.profileName === profileName);

    // Fix infinite data/tags loop
    if ((profile && _.isEqual(profile.data, tags)) || !profileName) {
      return;
    }

    const newProfile = generateProfile(profileName, tags, stages);
    localStorage.setItem(
      `blitzkrieg-profile-${profileName}`,
      JSON.stringify(newProfile)
    );

    updateProfilesList();
  };

  const handleDeleteProfile = async () => {
    const result = await MySwal.fire({
      title: 'Подтверждение удаления',
      text: 'Вы уверены, что хотите удалить этот профиль?',
      icon: 'warning',
      theme: 'dark',
      showCancelButton: true,
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      localStorage.removeItem(`blitzkrieg-profile-${profileName}`);
      MySwal.fire({
        icon: 'success',
        title: 'Профиль удалён',
        timer: 1500,
        theme: 'dark',
        showConfirmButton: false,
      });
    }

    setTags([]);
    setProfileName('');
    updateProfilesList();
  };

  useEffect(() => {
    setStages(generateStages(startPositions));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startPositions]);

  useEffect(() => {
    updateProfilesList();
  }, []);

  useEffect(() => {
    // Just cause
    handleUpdateProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, stages]);

  useEffect(() => {
    if (profile) {
      setTags((pre) =>
        Array.isArray(profile.data.tags) ? profile.data.tags : pre
      );
      setStages((pre) =>
        Array.isArray(profile.data.stages) ? profile.data.stages : pre
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileName]);

  return (
    <div className={styles.container}>
      <div className={styles.profileNameWrapper}>
        <div className={styles.cell}>
          <p className={styles.name}>Выбранный профиль</p>
          <UIDropdown<string>
            value={profileName}
            className={styles.dropdown}
            onChange={(val) => setProfileName(val)}
            options={profiles.map((profile) => ({
              label: profile.profileName,
              value: profile.profileName,
            }))}
            placeholder="Выбрать"
            fill
          />
        </div>
        <div className={styles.cell}>
          <ContextMenu
            className={styles.contextMenu}
            button={<UIButton icon={ChevronDownIcon} big />}
          >
            <div className={styles.contextMenuList}>
              <UIButton
                onClick={handleCreateProfile}
                className={styles.button}
                fill
              >
                Новый профиль
              </UIButton>
              {!!profile && (
                <UIButton
                  onClick={handleEditProfile}
                  className={styles.button}
                  fill
                >
                  Редактировать
                </UIButton>
              )}
              {!!profile && (
                <UIButton
                  onClick={handleDeleteProfile}
                  className={styles.button}
                  fill
                >
                  Удалить профиль
                </UIButton>
              )}
            </div>
          </ContextMenu>
        </div>
      </div>
      {tags.length > 1 && (
        <div className={styles.line}>
          {tags.map((tag, index) => {
            const prevTag = tags[index - 1];
            const prevPercent =
              (!isNaN(parseInt(prevTag?.toString())) &&
                parseInt(prevTag?.toString())) ||
              0;
            const currentPercent =
              (!isNaN(parseInt(tag?.toString())) &&
                parseInt(tag?.toString())) ||
              prevPercent ||
              0;
            const diff = currentPercent - prevPercent;
            const isLast = index + 1 === tags.length;

            const element = (
              <div
                key={tag}
                className={styles.sp}
                style={
                  {
                    '--size': diff / 100,
                  } as React.CSSProperties
                }
              ></div>
            );
            const last = (
              <div
                key={tag}
                className={styles.sp}
                style={
                  {
                    '--size': (100 - currentPercent) / 100,
                  } as React.CSSProperties
                }
              ></div>
            );

            return (
              <>
                {element}
                {isLast && last}
              </>
            );
          })}
        </div>
      )}
      <p className={styles.subtitle}>Стартовые позиции (по возрастанию)</p>
      <div className={styles.inputWrapper}>
        <TagInput
          value={tags}
          onChange={handleTagsChange}
          numericOnly
          min={1}
          max={99}
          sort="asc"
          placeholder="Введите число от 1 до 99 и нажмите Enter"
        />
        <p className={styles.subtitle}>
          Вводите все проценты на которых стоят ваши стартовые позиции исключая
          0 и 100
        </p>
        <p className={styles.subtitle}>
          Вы можете вставить числа через пробел или через зяпятую чтобы
          заполнить все сразу, например: 25, 50, 75 или 25 50 75
        </p>
      </div>
      {tags.length > 0 && <>Теги: {tags.join(', ')}</>}
      {tags.length > 0 && <Stages stages={stages} onChange={setStages} />}
    </div>
  );
}
