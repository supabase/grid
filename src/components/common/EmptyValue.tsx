import * as React from 'react';

type EmptyValueProps = {};

export const EmptyValue: React.FC<EmptyValueProps> = ({}) => {
  return <span className="block">EMPTY</span>;
};
