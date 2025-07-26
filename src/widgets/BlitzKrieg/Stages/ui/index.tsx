import _ from 'lodash';
import clsx from 'clsx';
import styles from './Stages.module.scss';

import type { Stage } from '@/shared/types/blitzkrieg';

import { useState } from 'react';

import { PencilMiniIcon } from '@/shared/icons/Pencil';
import { UICheckbox } from '@/shared/ui/Checkbox/ui';
import { XMarkMiniIcon } from '@/shared/icons/XMarkMini';

type StagesProps = {
  stages: Stage[];
  onChange?: (stages: Stage[]) => void;
};

const MAX_NOTE_LENGTH = 16;

export const Stages: React.FC<StagesProps> = ({
  stages: _stages,
  onChange,
}) => {
  const [stages, setStages] = useState(_stages);

  function handleStageCheckedChange(stage: Stage, checked: boolean) {
    stage.ranges.forEach((range) => handleRangeCheckedChange(range, checked));
  }

  function handleRangeCheckedChange(
    range: Stage['ranges']['0'],
    checked: boolean
  ) {
    const newStages: Stage[] = stages.map((oldStage) => {
      const newRanges = oldStage.ranges.map((elm) => {
        if (elm === range) {
          return {
            ...elm,
            checked,
          };
        }

        return elm;
      });

      return {
        ...oldStage,
        ranges: _.cloneDeep(newRanges),
      };
    });

    setStages(newStages);
    onChange?.(_.cloneDeep(newStages));
  }

  function handleStageNoteChange(stage: Stage, note: string) {
    if (note.length > MAX_NOTE_LENGTH) return;

    const newStages: Stage[] = stages.map((oldStage) => ({
      ...oldStage,
      note: oldStage === stage ? note : oldStage.note,
    }));

    setStages(newStages);
    onChange?.(_.cloneDeep(newStages));
  }

  function handleRangeNoteChange(range: Stage['ranges']['0'], note: string) {
    if (note.length > MAX_NOTE_LENGTH) return;

    const newStages: Stage[] = stages.map((oldStage) => ({
      ...oldStage,
      ranges: oldStage.ranges.includes(range)
        ? oldStage.ranges.map((oldRange) => {
            if (oldRange === range) {
              return {
                ...oldRange,
                note,
              };
            } else {
              return oldRange;
            }
          })
        : oldStage.ranges,
    }));

    setStages(newStages);
    onChange?.(_.cloneDeep(newStages));
  }

  if (stages.length === 0) return <></>;

  return (
    <div className={styles.stages}>
      <p className={styles.title}>Стадии</p>
      <div className={styles.stagesList}>
        {stages.map((stage, index) => (
          <div key={index} className={styles.stage}>
            <div className={styles.header}>
              <label className={styles.checkbox}>
                <UICheckbox
                  checked={stage.ranges.every((range) => range.checked)}
                  onChange={(e) =>
                    handleStageCheckedChange(stage, e.target.checked)
                  }
                />
                Stage {stage.stage}
              </label>
              <label className={styles.note}>
                {/* <PencilMiniIcon className={styles.icon} />{' '} */}
                <input
                  type="text"
                  placeholder="Заметка"
                  maxLength={MAX_NOTE_LENGTH}
                  value={stage.note}
                  className={styles.noteInput}
                  onChange={(e) => handleStageNoteChange(stage, e.target.value)}
                />
              </label>
            </div>
            <ul className={styles.rangesList}>
              {stage.ranges.map((range, idx) => (
                <StageRange
                  key={idx}
                  range={range}
                  onNote={(note) => handleRangeNoteChange(range, note)}
                  onChecked={(checked) =>
                    handleRangeCheckedChange(range, checked)
                  }
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

function StageRange({
  range,
  onChecked,
  onNote,
}: {
  range: Stage['ranges']['0'];
  onChecked: (checked: boolean) => void;
  onNote: (note: string) => void;
}) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <li className={clsx(range.checked && styles.checked)}>
      <div className={styles.content}>
        <UICheckbox
          onChange={(e) => onChecked(e.target.checked)}
          checked={range.checked}
          className={styles.checkbox}
        />{' '}
        <span className={styles.range}>
          <span>{range.from}</span> - <span>{range.to}</span>
        </span>
        <label className={styles.note}>
          <PencilMiniIcon className={styles.icon} />{' '}
          <input
            type="text"
            value={range.note}
            maxLength={MAX_NOTE_LENGTH}
            className={styles.noteInput}
            placeholder="Заметка"
            onChange={(e) => onNote(e.target.value)}
          />
          {/* <XMarkMiniIcon
            className={styles.icon}
            onClick={() => setIsEdit(!isEdit)}
          /> */}
        </label>
        {/* {!isEdit && (
          <PencilMiniIcon
            className={styles.icon}
            onClick={() => setIsEdit(!isEdit)}
          />
        )} */}
      </div>
      <div
        className={styles.line}
        style={
          {
            '--from': (range.from / 100).toString(),
            '--to': (range.to / 100).toString(),
          } as React.CSSProperties
        }
      ></div>
      {isEdit && (
        <label className={styles.note}>
          <PencilMiniIcon className={styles.icon} />{' '}
          <input
            type="text"
            value={range.note}
            maxLength={MAX_NOTE_LENGTH}
            className={styles.noteInput}
            placeholder="Заметка"
            onChange={(e) => onNote(e.target.value)}
          />
          <XMarkMiniIcon
            className={styles.icon}
            onClick={() => setIsEdit(!isEdit)}
          />
        </label>
      )}
    </li>
  );
}
