import { Dictionary } from './base';

export interface SupaColumn {
  readonly dataType: string;
  readonly format: string;
  readonly name: string;
  readonly comment?: string;
  readonly defaultValue?: string | null;
  readonly enum?: string[];
  readonly isIdentity?: boolean;
  readonly isGeneratable?: boolean;
  readonly isNullable?: boolean;
  readonly isUpdatable?: boolean;
  readonly targetTableSchema?: string;
  readonly targetTableName?: string;
  readonly targetColumnName?: string;
  position: number;
}

export interface SupaTable {
  readonly columns: SupaColumn[];
  readonly name: string;
  readonly schema?: string;
  readonly comment?: string;
  totalRows: number;
}

export interface SupaRow extends Dictionary<any> {
  readonly idx: number;
}
