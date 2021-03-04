import { SelectColumn, TextEditor } from 'react-data-grid';
import { Dictionary, SupaColumn, SupaTable } from '../types';

function getColumnEditor(column: SupaColumn) {
  if (column.isIdentity || !column.isUpdatable) return null;
  const finalType = column.dataType.toLowerCase();
  switch (finalType) {
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'bigint':
      return null;
    case 'bool':
      return null;
    case 'text':
    case 'varchar':
    case 'user-defined':
      return TextEditor;
    default:
      return null;
  }
}

export function getGridColumns(
  table: SupaTable,
  options?: { defaultWidth?: number }
): any[] {
  const columns = table.columns.map(x => {
    let col: Dictionary<any> = {
      key: x.name,
      name: x.name,
      resizable: true,
      editor: getColumnEditor(x),
      width: options?.defaultWidth || 100,
    };

    return col;
  });
  console.log('columns', columns);
  return [SelectColumn, ...columns];
}
