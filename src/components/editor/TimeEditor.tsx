import * as React from 'react';
import { EditorProps } from '@mildtomato/react-data-grid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

/**
 * original input time format 'HH:mm'
 * when step=1, it becomes 'HH:mm:ss'
 */
const INPUT_TIME_FORMAT = 'HH:mm:ss';

export function TimeEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  const value = (row[column.key as keyof TRow] as unknown) as string;
  const serverTimeFormat =
    value && value.includes('+') ? 'HH:mm:ssZZ' : 'HH:mm:ss';
  const timeValue = value
    ? dayjs(value, serverTimeFormat).format(INPUT_TIME_FORMAT)
    : value;

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const _value = event.target.value;
    if (_value == '') {
      onRowChange({ ...row, [column.key]: null });
    } else {
      const _timeValue = dayjs(_value, INPUT_TIME_FORMAT).format(
        serverTimeFormat
      );
      onRowChange({ ...row, [column.key]: _timeValue });
    }
  }

  return (
    <input
      className="sb-grid-time-editor"
      ref={autoFocusAndSelect}
      value={timeValue ?? ''}
      onChange={onChange}
      onBlur={() => onClose(true)}
      type="time"
      step="1"
    />
  );
}
