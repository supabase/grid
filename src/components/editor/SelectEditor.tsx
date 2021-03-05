import * as React from 'react';
import { Select } from '@supabase/ui';
import { EditorProps } from 'react-data-grid';

const { Option } = Select;

interface SelectEditorProps<TRow, TSummaryRow = unknown>
  extends EditorProps<TRow, TSummaryRow> {
  options: { label: string; value: string }[];
}

export default function SelectEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  options,
}: SelectEditorProps<TRow, TSummaryRow>) {
  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onRowChange({ ...row, [column.key]: event.target.value });
  }

  return (
    <Select
      value={(row[column.key as keyof TRow] as unknown) as string}
      layout="vertical"
      onChange={onChange}
      size="tiny"
    >
      {options.map(({ label, value }) => {
        return (
          <Option key={value} value={value}>
            {label}
          </Option>
        );
      })}
    </Select>
  );
}
