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
  const value = p.row[p.column.key] as string | null;
  if (value === null) return <NullValue />;
  const isVideo = value.toLowerCase().endsWith('.mp4');
  const fullUrl = p.mediaUrlPrefix + value;
  return isVideo ? (
    <video controls>
      <source type="video/mp4" src={fullUrl} />
    </video>
  ) : (
    <img height="200" width="auto" src={fullUrl} />
  );
};
