import * as React from 'react';

type EmptyValueProps = {};

export const EmptyValue: React.FC<EmptyValueProps> = ({}) => {
  return (
    <span className="block" style={{ opacity: 0.5 }}>
      EMPTY
    </span>
  );
};
