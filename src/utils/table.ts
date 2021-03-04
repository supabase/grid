import { Dictionary, SupaColumn } from '../types';

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
