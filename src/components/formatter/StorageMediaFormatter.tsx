import * as React from 'react';
import { FormatterProps } from '@supabase/react-data-grid';
import { SupaRow } from '../../types';
import { NullValue } from '../common';

interface StorageMediaFormatterProps<T, Q> extends FormatterProps<T, Q> {
  mediaUrlPrefix: string;
}

export const StorageMediaFormatter = (
  p: React.PropsWithChildren<StorageMediaFormatterProps<SupaRow, unknown>>
) => {
  const value = p.row[p.column.key] as boolean | null;
  if (value === null) return <NullValue />;
  return <img height="200" width="auto" src={p.mediaUrlPrefix + value} />;
};
