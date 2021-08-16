import OpenApiService from '../services/OpenApiService';
import TableService from '../services/TableService';
import { Dictionary, SupaColumn, SupaTable } from '../types';

// Using stored procedures function
export async function fetchTableInfo(
  service: TableService,
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
    resTable.data.length > 0 &&
    resColumns.data.length > 0
  ) {
    const supaTable = parseSupaTable({
      table: resTable.data[0],
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
  const supaColumns: SupaColumn[] = columns.map(x => {
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
    const primaryKey = primaryKeys.find(pk => pk.name == x.name);
    temp.isPrimaryKey = !!primaryKey;

    const relationship = relationships.find(r => {
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

// Using postgrest OpenAPI description
export async function fetchReadonlyTableInfo(
  service: OpenApiService,
  tableName: string
): Promise<SupaTable | null> {
  const { data, error } = await service.fetchDescription();
  if (error || !data || !data.definitions) return null;

  const tableInfo = data.definitions[tableName];
  if (tableInfo) {
    const supaTable = parseReadonlySupaTable(tableInfo, tableName);
    return supaTable;
  } else {
    return null;
  }
}

export function parseReadonlySupaTable(
  table: Dictionary<any>,
  tableName: string
): SupaTable | null {
  if (!table) return null;

  const columns = table.properties ? (table.properties as Dictionary<any>) : {};
  const columnNames = Object.keys(columns) as string[];
  const supaColumns: SupaColumn[] = columnNames.map((x, index) => {
    const col = columns[x];
    return {
      name: x,
      dataType: col.type,
      format: col.format,
      enum: col.enum,
      comment: col.description,
      position: index,
      isUpdatable: false,
    };
  });

  return {
    name: tableName,
    comment: table.description,
    columns: supaColumns,
  };
}
