import RowService from '../services/RowService';
import { Dictionary, SupaTable } from '../types';

// TODO: should return response type obj
export async function updateCell(
  table: SupaTable,
  rowData: Dictionary<any>,
  service: RowService
): Promise<Dictionary<any> | null> {
  // find primary key
  const primaryKeys = table.columns.filter(x => x.isIdentity);
  if (!primaryKeys || primaryKeys.length == 0) return null;
  // TODO: support multi primary keys
  if (primaryKeys.length > 1) return null;

  // call RowService
  const res = await service.update(table.name, primaryKeys[0].name, rowData);
  if (res.error) return null;

  // return new rowData
  return rowData;
}
