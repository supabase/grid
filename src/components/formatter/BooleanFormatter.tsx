import * as React from 'react';
import { FormatterProps } from '@w3b6x9/react-data-grid-w3b6x9';
import { SupaRow } from '../../types';

export const BooleanFormatter = (
  p: React.PropsWithChildren<FormatterProps<SupaRow, unknown>>
) => {
  const value = p.row[p.column.key] as boolean;
  return <>{value ? 'true' : 'false'}</>;
};
