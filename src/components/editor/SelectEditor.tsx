import * as React from 'react';
import { EditorProps } from 'react-data-grid';
import styles from './editor.module.css';

interface SelectEditorProps<TRow, TSummaryRow = unknown>
  extends EditorProps<TRow, TSummaryRow> {
  options: { label: string; value: string }[];
}

export default function SelectEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
  options,
}: SelectEditorProps<TRow, TSummaryRow>) {
  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onRowChange({ ...row, [column.key]: event.target.value }, true);
  }

  function onBlur() {
    onClose(false);
  }

  return (
    <select
      className={styles.textEditor}
      value={(row[column.key as keyof TRow] as unknown) as string}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus
    >
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
