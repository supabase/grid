import TableService from '../services/TableService';
import { Dictionary, SupaColumn, SupaTable } from '../types';

export async function fetchTable(
  service: TableService,
  table: string,
  schema?: string
): Promise<SupaTable | null> {
  const resTable = await service.fetch(table as string, schema);
  const resColumns = await service.fetchColumns(table as string, schema);
  if (
    resTable.data &&
    resColumns.data &&
    resTable.data.length > 0 &&
    resColumns.data.length > 0
  ) {
    const supaTable = getSupaTable(resTable.data[0], resColumns.data);
    return supaTable;
  }
  return null;
}

export function getSupaTable(
  table: Dictionary<any>,
  columns: Dictionary<any>[]
) {
  const supaColumns: SupaColumn[] = columns.map(x => {
    return {
      tableId: x.table_id,
      schema: x.schema,
      id: x.id,
      position: x.ordinal_position,
      name: x.name,
      defaultValue: x.default_value,
      dataType: x.data_type,
      format: x.format,
      isIdentity: x.is_identity,
      isGeneratable: x.identity_generation == 'BY DEFAULT',
      isNullable: x.is_nullable,
      isUpdatable: x.is_updatable,
      enums: x.enums,
      comment: x.comment,
    };
  });

  return {
    id: table.id,
    name: table.name,
    comment: table.comment,
    schema: table.schema,
    totalRows: table.rows_estimate,
    columns: supaColumns,
    relationships: [],
  };
}
