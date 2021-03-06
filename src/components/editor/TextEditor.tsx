//@ts-nocheck
import * as React from 'react';
import { Popover } from 'react-tiny-popover';
import { Input } from '@supabase/ui';
import { EditorProps } from 'react-data-grid';

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export default function TextEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(true);
  const value = (row[column.key as keyof TRow] as unknown) as string;

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onRowChange({ ...row, [column.key]: event.target.value });
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom', 'top']}
      content={
        <Input.TextArea
          ref={autoFocusAndSelect}
          style={{ width: `${column.width}px`, marginLeft: '12px' }}
          autofocus={true}
          value={value}
          onChange={onChange}
          onBlur={() => onClose(true)}
        />
      }
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{value}</div>
    </Popover>
  );
}
