import * as React from 'react';
import { Popover } from 'react-tiny-popover';
import { EditorProps } from 'react-data-grid';

function autoFocusAndSelect(input: HTMLTextAreaElement | null) {
  // nee a timeout to wait for popover appear
  setTimeout(() => {
    input?.focus();
    input?.select();
  }, 0);
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
      positions={['bottom', 'top', 'left']}
      align="start"
      content={
        <textarea
          ref={autoFocusAndSelect}
          style={{ width: '15rem' }}
          value={value}
          rows={5}
          onChange={onChange}
          onBlur={() => onClose(true)}
        />
      }
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{value}</div>
    </Popover>
  );
}
