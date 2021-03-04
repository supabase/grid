import {
  EditableGridCell,
  GridCell,
  GridCellKind,
} from '@glideapps/glide-data-grid';
import RowService from '../services/RowService';
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
    data: value || '',
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
    data: value || '',
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

export async function updateCell(
  table: SupaTable,
  col: number,
  newValue: EditableGridCell,
  rowData: Dictionary<any>,
  service: RowService
): Promise<Dictionary<any> | null> {
  // find primary key
  const primaryKeys = table.columns.filter(x => x.isIdentity);
  if (!primaryKeys || primaryKeys.length == 0) return null;
  // TODO: support multi primary keys
  if (primaryKeys.length > 1) return null;

  // update rowData with newValue
  const column = table.columns.find(x => x.position == col + 1);
  if (!column || !rowData) throw new Error('This should not happen');
  const newRowData = { ...rowData };
  newRowData[column.name] = newValue.data;

  // call RowService
  const res = await service.update(table.name, primaryKeys[0].name, newRowData);
  if (res.error) return null;

  // return new rowData
  return newRowData;
}
