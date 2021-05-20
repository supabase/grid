import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';

export function CheckboxEditor<TRow, TSummaryRow = unknown>({
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
    <div className="flex w-full h-full">
      <input
        className="m-auto w-4 h-4"
        checked={(row[column.key as keyof TRow] as unknown) as boolean}
        onChange={onChange}
        onBlur={onBlur}
        type="checkbox"
      />
    </div>
  );
}
