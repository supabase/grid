import { GridColumn } from '@glideapps/glide-data-grid';
import { HeaderIcon } from '@glideapps/glide-data-grid/dist/ts/data-grid/data-grid-sprites';
import { Dictionary, SupaColumn, SupaTable } from '../types';

function getColumnIcon(column: SupaColumn): HeaderIcon | null {
  if (column.isIdentity) return 'headerRowID';
  const finalType = column.dataType.toLowerCase();
  switch (finalType) {
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'bigint':
      return 'headerNumber';
    case 'bool':
      return 'headerBoolean';
    case 'text':
    case 'varchar':
    case 'user-defined':
      return 'headerString';
    default:
      return null;
  }
}

export function getGridColumns(
  table: SupaTable,
  options?: { defaultWidth?: number }
): GridColumn[] {
  const result = table.columns.map(x => {
    let col: Dictionary<any> = {
      title: x.name,
      style: (x.isIdentity ? 'highlight' : 'normal') as 'normal' | 'highlight',
      width: options?.defaultWidth || 100,
    };

    const colIcon = getColumnIcon(x);
    if (colIcon) col.icon = colIcon;

    return col;
  });
  return result as GridColumn[];
}
