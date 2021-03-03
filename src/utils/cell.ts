import { GridCell, GridCellKind } from '@glideapps/glide-data-grid';
import { Dictionary, SupaColumn, SupaTable } from '../types';

function getRowIdCell(value: number): GridCell {
  return {
    kind: GridCellKind.RowID,
    data: value.toString(),
    allowOverlay: true,
  };
}

function getTextCell(value: string): GridCell {
  return {
    kind: GridCellKind.Text,
    data: value,
    displayData: value?.toString() || '',
    allowOverlay: true,
  };
}

function getNumberCell(value: number): GridCell {
  return {
    kind: GridCellKind.Number,
    data: value,
    displayData: value?.toString() || '',
    allowOverlay: true,
  };
}

function getBooleanCell(value: boolean, column: SupaColumn): GridCell {
  return {
    kind: GridCellKind.Boolean,
    data: value,
    showUnchecked: true,
    allowOverlay: true,
    allowEdit: column.isUpdatable,
  };
}

function getSelectCell(value: string): GridCell {
  return {
    kind: GridCellKind.Text,
    data: value,
    displayData: value?.toString() || '',
    allowOverlay: true,
  };
}

export function getCellContent(
  table: SupaTable,
  col: number,
  rowData: Dictionary<any>
): GridCell {
  const column = table.columns.find(x => x.position == col + 1);
  if (!column || !rowData) throw new Error('This should not happen');

  const key = column.name;
  const value = rowData[key];
  switch (column.dataType) {
    case 'int4':
    case 'int8':
    case 'float4':
    case 'float8':
    case 'bigint':
      if (column.isIdentity) return getRowIdCell(value);
      else return getNumberCell(value);
      break;
    case 'bool':
      return getBooleanCell(value, column);
      break;
    case 'text':
      return getTextCell(value);
      break;
    case 'USER-DEFINED':
      return getSelectCell(value);
      break;
    default:
      return getTextCell(value);
      break;
  }
}
