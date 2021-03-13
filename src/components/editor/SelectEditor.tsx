import * as React from 'react';
import { EditorProps } from '@phamhieu1998/react-data-grid';
import styles from './editor.module.css';

interface SelectEditorProps<TRow, TSummaryRow = unknown>
  extends EditorProps<TRow, TSummaryRow> {
  options: { label: string; value: string }[];
}

export function SelectEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
  options,
}: SelectEditorProps<TRow, TSummaryRow>) {
  const value = (row[column.key as keyof TRow] as unknown) as string;

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onRowChange({ ...row, [column.key]: event.target.value }, true);
  }

  function onBlur() {
    onClose(false);
  }

  return (
    <select
      className={styles.textEditor}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus
    >
      <option disabled value="">
        - Please select -
      </option>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
