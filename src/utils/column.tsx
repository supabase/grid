import * as React from 'react';
import { Column, SelectColumn, TextEditor } from 'react-data-grid';
import { Dictionary, SupaColumn, SupaTable } from '../types';
import { SelectEditor } from '../components/SelectEditor';

function setupColumnEditor(col: SupaColumn, column: Column<Dictionary<any>>) {
  if (col.isIdentity || !col.isUpdatable) return;
  const finalType = col.dataType.toLowerCase();
  switch (finalType) {
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'bigint': {
      break;
    }
    case 'bool': {
      break;
    }
    case 'text':
    case 'varchar': {
      column.editor = TextEditor;
      break;
    }
    case 'user-defined': {
      column.editor = p => {
        const { row, onRowChange } = p;
        const readonlyCol = p.column;
        return (
          <SelectEditor
            value={(row[readonlyCol.key] as unknown) as string}
            onChange={value =>
              onRowChange({ ...row, [readonlyCol.key]: value })
            }
            options={col.enums}
          />
        );
      };
      column.editorOptions = {
        editOnClick: true,
      };
      break;
    }
    default: {
      break;
    }
  }
}

export function getGridColumns(
  table: SupaTable,
  options?: { defaultWidth?: number }
): any[] {
  const columns = table.columns.map(x => {
    let col: Column<Dictionary<any>> = {
      key: x.name,
      name: x.name,
      resizable: true,
      width: options?.defaultWidth || 100,
    };

    setupColumnEditor(x, col);
    return col;
  });
  console.log('columns', columns);
  return [SelectColumn, ...columns];
}
