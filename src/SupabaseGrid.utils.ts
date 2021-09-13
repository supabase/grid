import { IMetaService } from './services/meta';
import { Dictionary, SupaColumn, SupaTable } from './types';

export async function fetchEditableInfo(
  service: IMetaService,
  tableName: string,
  schema?: string
): Promise<SupaTable | null> {
  const resTable = await service.fetchInfo(tableName, schema);
  const resColumns = await service.fetchColumns(tableName, schema);
  const resPrimaryKeys = await service.fetchPrimaryKeys(tableName, schema);
  const resRelationships = await service.fetchRelationships(tableName, schema);
  if (
    resTable.data &&
    resColumns.data &&
    resPrimaryKeys.data &&
    resRelationships.data &&
    resColumns.data.length > 0
  ) {
    const supaTable = parseSupaTable({
      table: resTable.data,
      columns: resColumns.data,
      primaryKeys: resPrimaryKeys.data,
      relationships: resRelationships.data,
    });
    return supaTable;
  }
  return null;
}

export function parseSupaTable(data: {
  table: Dictionary<any>;
  columns: Dictionary<any>[];
  primaryKeys: Dictionary<any>[];
  relationships: Dictionary<any>[];
}): SupaTable {
  const { table, columns, primaryKeys, relationships } = data;
  const supaColumns: SupaColumn[] = columns.map((x) => {
    const temp = {
      position: x.ordinal_position,
      name: x.name,
      defaultValue: x.default_value,
      dataType: x.data_type,
      format: x.format,
      isPrimaryKey: false,
      isIdentity: x.is_identity,
      isGeneratable: x.identity_generation == 'BY DEFAULT',
      isNullable: x.is_nullable,
      isUpdatable: x.is_updatable,
      enum: x.enums,
      comment: x.comment,
      targetTableSchema: null,
      targetTableName: null,
      targetColumnName: null,
    };
    const primaryKey = primaryKeys.find((pk) => pk.name == x.name);
    temp.isPrimaryKey = !!primaryKey;

    const relationship = relationships.find((r) => {
      return r.source_column_name == x.name;
    });
    if (relationship) {
      temp.targetTableSchema = relationship.target_table_schema;
      temp.targetTableName = relationship.target_table_name;
      temp.targetColumnName = relationship.target_column_name;
    }
    return temp;
  });

  return {
    name: table.name,
    comment: table.comment,
    schema: table.schema,
    columns: supaColumns,
  };
}

export async function fetchReadOnlyInfo(
  service: IMetaService,
  name: string,
  schema?: string
): Promise<SupaTable | null> {
  const { data } = await service.fetchColumns(name, schema);

  if (data) {
    const supaColumns: SupaColumn[] = data.map((x, index) => {
      return {
        name: x.name,
        dataType: x.format,
        format: x.format,
        position: index,
        isUpdatable: false,
      };
    });

    return {
      name: name,
      columns: supaColumns,
    };
  }
  return null;
}
