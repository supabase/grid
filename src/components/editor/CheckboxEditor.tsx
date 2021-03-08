import * as React from 'react';
import { EditorProps } from 'react-data-grid';
import styles from './editor.module.css';

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
    <div className={styles.checkboxContainer}>
      <input
        className={styles.checkboxEditor}
        checked={(row[column.key as keyof TRow] as unknown) as boolean}
        onChange={onChange}
        onBlur={onBlur}
        type="checkbox"
      />
    </div>
  );
}
