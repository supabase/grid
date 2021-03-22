import { Column, HeaderRendererProps } from '@phamhieu1998/react-data-grid';

export interface Dictionary<T> {
  [Key: string]: T;
}

export interface Sort {
  columnId: string | number;
  order: string;
}

export interface Filter {
  clause: string;
  columnId: string | number;
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
  id: string;
  type: string;
}

export type ColumnType =
  | 'boolean'
  | 'date'
  | 'enum'
  | 'foreign_key'
  | 'json'
  | 'number'
  | 'primary_key'
  | 'text'
  | 'unknown';

export interface ColumnHeaderProps<R> extends HeaderRendererProps<R> {
  columnId: string | number;
  columnType: ColumnType;
}
