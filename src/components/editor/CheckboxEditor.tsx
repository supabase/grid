import * as React from 'react';
import { Checkbox } from '@supabase/ui';
import { EditorProps } from 'react-data-grid';

export default function CheckboxEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    onRowChange({ ...row, [column.key]: event.target.checked });
  }

  function onBlur() {
    onClose(true);
  }

  return (
    <Checkbox
      checked={(row[column.key as keyof TRow] as unknown) as boolean}
      onChange={onChange}
      onBlur={onBlur}
      description=""
      label=""
      size="small"
    />
  );
}
