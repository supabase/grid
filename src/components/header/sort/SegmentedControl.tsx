import * as React from 'react';
import styles from './segmentedControl.module.css';

type SegmentedControlProps = {
  options: string[];
  defaultValue: string;
  onToggle: (value: string) => void;
};

const SegmentedControl: React.FunctionComponent<SegmentedControlProps> = ({
  options,
  defaultValue,
  onToggle,
}) => {
  const [value, setValue] = React.useState(defaultValue);
  const uniqueId = `${Math.floor(Math.random() * 100000)}`;

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;
    setValue(newValue);
    onToggle(newValue);
  }

  return (
    <div className={styles.segmentedControl}>
      {options.map(x => {
        const valueId = `${x}-${uniqueId}`;
        return (
          <React.Fragment key={x}>
            <input
              type="radio"
              name={`segmented-control-${uniqueId}`}
              id={valueId}
              value={x}
              checked={value.toLowerCase() == x.toLowerCase()}
              onChange={onChange}
            />
            <label htmlFor={valueId}>{x}</label>
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default SegmentedControl;
