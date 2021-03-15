import * as React from 'react';
import { Popover } from 'react-tiny-popover';
import { EditorProps } from '@phamhieu1998/react-data-grid';
import { useTrackedState } from '../../store';

function autoFocusAndSelect(input: HTMLTextAreaElement | null) {
  // nee a timeout to wait for popover appear
  setTimeout(() => {
    input?.focus();
    input?.select();
  }, 0);
}

export function TextEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  const state = useTrackedState();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const value = (row[column.key as keyof TRow] as unknown) as string;
  const gridColumn = state.gridColumns.find(x => x.name == column.key);

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onRowChange({ ...row, [column.key]: event.target.value });
  }

  function onBlur() {
    setIsPopoverOpen(false);
    onClose(true);
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={onBlur}
      padding={-35}
      containerClassName=""
      positions={['bottom', 'top', 'left']}
      align="start"
      content={
        <textarea
          ref={autoFocusAndSelect}
          className="p-2 resize-none text-sm"
          style={{ width: `${gridColumn?.width || column.width}px` }}
          value={value}
          rows={5}
          onChange={onChange}
          onBlur={onBlur}
        />
      }
    >
      <div className="px-2" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        {value}
      </div>
    </Popover>
  );
}
