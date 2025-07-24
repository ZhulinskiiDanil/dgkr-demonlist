import styles from './Stages.module.scss';

type Stage = {
  stage: number;
  ranges: {
    from: number;
    to: number;
  }[];
};

type StagesProps = {
  stages: Stage[];
};

export const Stages: React.FC<StagesProps> = ({ stages }) => {
  if (stages.length === 0) return null;

  return (
    <div className={styles.stages}>
      <h3 className={styles.title}>Стадии:</h3>
      <div className={styles.stagesList}>
        {stages.map((stage, index) => (
          <div key={index} className={styles.stage}>
            <div className={styles.stageHead}>
              <input type="checkbox" />
              Stage {stage.stage}
            </div>
            <ul className={styles.rangesList}>
              {stage.ranges.map((range, idx) => (
                <li key={idx}>
                  <input type="checkbox" /> {range.from} - {range.to}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
