export interface Dictionary<T> {
  [Key: string]: T;
}

export type GridProps = {
  width?: string | number;
  height?: string | number;
  defaultColumnWidth?: string | number;
  containerClass?: string;
  gridClass?: string;
  rowClass?: ((row: Dictionary<any>) => string | undefined) | undefined;
};

export type SupaRelationship = {
  readonly id: number;
  readonly name: string;
  readonly sourceSchema: string;
  readonly sourceTableName: string;
  readonly sourceColumnName: string;
  readonly targetTableSchema: string;
  readonly targetTableName: string;
  readonly targetColumnName: string;
};

export interface SupaBase {
  readonly id: string | number;
  readonly comment: string | null;
  readonly name: string;
  readonly schema: string;
}

export interface SupaColumn extends SupaBase {
  readonly defaultValue: string | null;
  readonly dataType: string;
  readonly enums: string[];
  readonly format: string;
  readonly isIdentity: boolean;
  readonly isGeneratable: boolean;
  readonly isNullable: boolean;
  readonly isUpdatable: boolean;
  readonly tableId: number;
  position: number;
}

export interface SupaTable extends SupaBase {
  readonly columns: SupaColumn[];
  readonly relationships: SupaRelationship[];
  totalRows: number;
}
