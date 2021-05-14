import * as React from 'react';
import { Popover } from 'react-tiny-popover';
import { EditorProps } from '@supabase/react-data-grid';
import { useTrackedState } from '../../store';
import { BlockKeys, NullValue } from '../common';

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
}: EditorProps<TRow, TSummaryRow>) {
  const state = useTrackedState();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const gridColumn = state.gridColumns.find(x => x.name == column.key);
  const initialValue = (row[column.key as keyof TRow] as unknown) as string;
  const [value, setValue] = React.useState<string | null>(initialValue);

  const onEscape = React.useCallback((newValue: string | null) => {
    onRowChange({ ...row, [column.key]: newValue }, true);
    setIsPopoverOpen(false);
  }, []);

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const _value = event.target.value;
    if (_value == '') setValue(null);
    else setValue(_value);
  }

  const onBlur = () => {
    console.log('onBlur onBlur onBlur', value);
    onRowChange({ ...row, [column.key]: value }, true);
    setIsPopoverOpen(false);
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={onBlur}
      padding={-35}
      containerClassName=""
      positions={['bottom', 'top', 'left']}
      align="start"
      content={
        <BlockKeys value={value} onEscape={onEscape}>
          <textarea
            ref={autoFocusAndSelect}
            className="p-2 resize-none text-sm rounded-none border-0 
          text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700"
            style={{ width: `${gridColumn?.width || column.width}px` }}
            value={value || ''}
            rows={5}
            onChange={onChange}
            onBlur={onBlur}
          />
        </BlockKeys>
      }
    >
      <div
        className={`${
          !!value && value.trim().length == 0 ? 'fillContainer' : ''
        } px-2 text-sm`}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {value ? value : <NullValue />}
      </div>
    </Popover>
  );
}
