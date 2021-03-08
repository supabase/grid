import * as React from 'react';
import { EditorProps } from 'react-data-grid';
import styles from './editor.module.css';

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export default function NumberEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  return (
    <input
      className={styles.textEditor}
      ref={autoFocusAndSelect}
      value={(row[column.key as keyof TRow] as unknown) as string}
      onChange={event =>
        onRowChange({ ...row, [column.key]: event.target.value })
      }
      onBlur={() => onClose(true)}
      type="number"
    />
  );
}
