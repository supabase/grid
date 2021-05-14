import * as React from 'react';
import Editor from '@monaco-editor/react';
import { Popover } from 'react-tiny-popover';
import { EditorProps } from '@supabase/react-data-grid';
import { useTrackedState } from '../../store';
import { BlockKeys, NullValue } from '../common';

export function JsonEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  const state = useTrackedState();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const gridColumn = state.gridColumns.find(x => x.name == column.key);
  const value = row[column.key as keyof TRow] as unknown;
  const jsonString = value ? JSON.stringify(value) : '';
  const prettyJsonValue = prettifyJSON(jsonString);

  function handleEditorDidMount(editor: any) {
    setTimeout(() => {
      editor?.focus();
    }, 0);
  }

  function onChange(_value: string | undefined) {
    if (!_value || _value == '') {
      onRowChange({ ...row, [column.key]: null });
    } else {
      if (verifyJSON(_value)) {
        const jsonValue = JSON.parse(_value);
        onRowChange({ ...row, [column.key]: jsonValue });
      }
    }
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
        <BlockKeys>
          <Editor
            width={`${gridColumn?.width || column.width}px`}
            height="200px"
            theme="vs-dark"
            defaultLanguage="json"
            defaultValue={prettyJsonValue || ''}
            onChange={onChange}
            onMount={handleEditorDidMount}
            options={{
              tabSize: 2,
              fontSize: 11,
              minimap: {
                enabled: false,
              },
              glyphMargin: false,
              folding: false,
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
            }}
          />
        </BlockKeys>
      }
    >
      <div
        className={`${
          !!value && jsonString.trim().length == 0 ? 'fillContainer' : ''
        } px-2 text-sm`}
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        {value ? jsonString : <NullValue />}
      </div>
    </Popover>
  );
}

export const prettifyJSON = (value: string) => {
  if (value.length > 0) {
    try {
      return JSON.stringify(JSON.parse(value), undefined, 2);
    } catch (err) {
      // dont need to throw error, just return text value
      // Users have to fix format if they want to save
      return value;
    }
  } else {
    return value;
  }
};

export const minifyJSON = (value: string) => {
  try {
    return JSON.stringify(JSON.parse(value));
  } catch (err) {
    throw err;
  }
};

export const verifyJSON = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (err) {
    return false;
  }
};
