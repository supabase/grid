import * as React from 'react';

type NullValueProps = {};

export const NullValue: React.FC<NullValueProps> = ({}) => {
  return <span className="block">NULL</span>;
};
