import { Dictionary } from './base';

interface _SupaColumn {
  readonly dataType: string;
  readonly format: string;
  readonly name: string;
  readonly comment?: string | null;
  readonly defaultValue?: string | null;
  readonly enum?: string[] | null;
  readonly isPrimaryKey?: boolean;
  readonly isIdentity?: boolean;
  readonly isGeneratable?: boolean;
  readonly isStorageMedia?: boolean;
  readonly isNullable?: boolean;
  readonly isUpdatable?: boolean;
  readonly targetTableSchema?: string | null;
  readonly targetTableName?: string | null;
  readonly targetColumnName?: string | null;
  position: number;
}

export interface SupaStorageMediaColumn extends _SupaColumn {
  readonly bucketName: string;
  readonly mediaUrlPrefix: string;
}

export type SupaColumn = _SupaColumn & SupaStorageMediaColumn;

export interface SupaTable {
  readonly columns: SupaColumn[];
  readonly name: string;
  readonly schema?: string | null;
  readonly comment?: string | null;
}

export interface SupaRow extends Dictionary<any> {
  readonly idx: number;
}
