import * as React from 'react';

type NullValueProps = {};

export const NullValue: React.FC<NullValueProps> = ({}) => {
  return (
    <span className="block" style={{ opacity: 0.5 }}>
      NULL
    </span>
  );
};
