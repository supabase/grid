import { Column, HeaderRendererProps } from '@w3b6x9/react-data-grid-w3b6x9';

export interface Dictionary<T> {
  [Key: string]: T;
}

export interface Sort {
  columnName: string;
  order: string;
}

export interface Filter {
  clause: string;
  columnName: string;
  condition: string;
  filterText: string;
}

export interface SavedState {
  filters: Filter[];
  gridColumns: Column<any, any>[];
  sorts: Sort[];
}

export interface DragItem {
  index: number;
  key: string;
}

export type ColumnType =
  | 'array'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'enum'
  | 'foreign_key'
  | 'json'
  | 'number'
  | 'primary_key'
  | 'text'
  | 'time'
  | 'unknown';

export interface ColumnHeaderProps<R> extends HeaderRendererProps<R> {
  columnType: ColumnType;
  isPrimaryKey: Boolean | undefined;
  format: string;
}
