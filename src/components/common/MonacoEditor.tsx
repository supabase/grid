import * as React from 'react';
import Editor from '@monaco-editor/react';

type MonacoEditorProps = {
  width?: string | number | undefined;
  height?: string | number | undefined;
  value?: string | undefined;
  language?: string | undefined;
  onChange: (value: string | undefined) => void;
  onMount: (editor: any) => void;
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  width,
  height,
  value,
  language,
  onChange,
  onMount,
}) => {
  return (
    <Editor
      width={width}
      height={height || '200px'}
      theme="supabase"
      wrapperClassName="grid-monaco-editor-container"
      className="grid-monaco-editor"
      defaultLanguage={language || 'plaintext'}
      defaultValue={value}
      onChange={onChange}
      onMount={onMount}
      options={{
        tabSize: 2,
        fontSize: 11,
        minimap: {
          enabled: false,
        },
        glyphMargin: false,
        folding: false,
        lineNumbers: 'off',
        // lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
    />
  );
};
