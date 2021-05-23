import * as React from 'react';
import Editor from '@monaco-editor/react';

type MonacoEditorProps = {
  width?: string | number | undefined;
  height?: string | number | undefined;
  value?: string | undefined;
  language?: string | undefined;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any) => void;
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  width,
  height,
  value,
  language,
  onChange,
  onMount,
}) => {
  function handleEditorOnMount(editor: any) {
    // add margin above first line
    editor.changeViewZones((accessor: any) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 4,
        domNode: document.createElement('div'),
      });
    });

    // auto focus on mount
    setTimeout(() => {
      editor?.focus();
    }, 0);

    if (onMount) onMount(editor);
  }

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
      onMount={handleEditorOnMount}
      options={{
        tabSize: 2,
        fontSize: 13,
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
