import * as React from 'react';
import { Input } from '@supabase/ui';
import { EditorProps } from 'react-data-grid';

export default function TextEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
}: EditorProps<TRow, TSummaryRow>) {
  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onRowChange({ ...row, [column.key]: event.target.value });
  }

  return (
    <Input.TextArea
      value={(row[column.key as keyof TRow] as unknown) as string}
      onChange={onChange}
    />
  );
}
