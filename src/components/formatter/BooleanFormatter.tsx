import * as React from 'react';
import { FormatterProps } from '@supabase/react-data-grid';
import { NullValue } from '../common';
import { SupaRow } from '../../types';

export const BooleanFormatter = (
  p: React.PropsWithChildren<FormatterProps<SupaRow, unknown>>
) => {
  const value = p.row[p.column.key] as boolean | null;
  return <>{value === null ? <NullValue /> : value ? 'true' : 'false'}</>;
};
