import * as React from 'react';
import { Column, SelectColumn } from 'react-data-grid';
import { Dictionary, SupaColumn, SupaTable } from '../types';
import CheckboxEditor from '../components/editor/CheckboxEditor';
import NumberEditor from '../components/editor/NumberEditor';
import SelectEditor from '../components/editor/SelectEditor';
import TextEditor from '../components/editor/TextEditor';

function setupColumnEditor(col: SupaColumn, column: Column<Dictionary<any>>) {
  if (col.isIdentity || !col.isUpdatable) return;
  const finalType = col.dataType.toLowerCase();
  console.log('finalType', finalType);
  switch (finalType) {
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'bigint': {
      column.editor = NumberEditor;
      break;
    }
    case 'boolean': {
      column.editor = CheckboxEditor;
      column.formatter = p => {
        const value = p.row[p.column.key] as boolean;
        return <>{value ? 'true' : 'false'}</>;
      };
      column.editorOptions = {
        editOnClick: true,
      };
      break;
    }
    case 'text':
    case 'varchar': {
      column.editor = TextEditor;
      break;
    }
    case 'user-defined': {
      const options = col.enums.map(x => {
        return { label: x, value: x };
      });
      column.editor = p => <SelectEditor {...p} options={options} />;
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
