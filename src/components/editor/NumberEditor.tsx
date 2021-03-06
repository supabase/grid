import * as React from 'react';
import { Input } from '@supabase/ui';
import { EditorProps } from 'react-data-grid';

export default function NumberEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onRowChange({ ...row, [column.key]: event.target.value });
  }

  return (
    <Input
      autofocus
      value={(row[column.key as keyof TRow] as unknown) as string}
      type="number"
      onChange={onChange}
      onBlur={() => onClose(true)}
    />
  );
}
