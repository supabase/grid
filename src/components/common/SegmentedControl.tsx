import * as React from 'react';

type SegmentedControlProps = {
  options: [string, string];
  value: string;
  onToggle: (value: string) => void;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onToggle,
}) => {
  const borderOverride = 'border-gray-600';
  const buttonStyle = `absolute top-0 z-1 text-xs inline-flex h-full items-center justify-center font-medium
    hover:text-white focus:z-10 focus:outline-none active:bg-gray-100 transition ease-in-out duration-150`;

  return (
    <div
      className={`relative mx-2 border ${borderOverride} rounded-md h-8`}
      style={{ padding: 1, width: 102 }}
    >
      <span
        style={{ width: 50 }}
        aria-hidden="true"
        className={`${
          value === options[1] ? 'translate-x-0' : 'translate-x-12'
        } z-0 inline-block rounded h-full bg-gray-600 shadow transform transition ease-in-out duration-200 border border-gray-600`}
      ></span>
      {options.map((option, index) => (
        <span
          key={`toggle_${index}`}
          style={{ width: 51 }}
          className={`
              ${value === option ? 'text-gray-200' : 'text-gray-400'} 
              ${index === 0 ? 'right-0' : 'left-0'} 
              ${buttonStyle}
              cursor-pointer
            `}
          onClick={() => onToggle(option)}
        >
          <span className="text-color-inherit uppercase">{option}</span>
        </span>
      ))}
    </div>
  );
};
