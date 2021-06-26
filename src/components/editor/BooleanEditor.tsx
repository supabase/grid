import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';


export function BooleanEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  const value = (row[column.key as keyof TRow] as unknown) as string | null;

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (!value || value == '') {
      onRowChange({ ...row, [column.key]: null }, true);
    } else {
      onRowChange({ ...row, [column.key]: JSON.parse(value) }, true);
    }
  }

  function onBlur() {
    onClose(false);
  }

  return (
    <select
      className="sb-grid-select-editor"
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus
    >
      <option value={''}>[null]</option>
      <option value="true">True</option>
      <option value="false">True</option>
    </select>
  );
}
