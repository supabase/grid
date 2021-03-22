import { Dictionary } from './base';
import { SupaRow, SupaTable } from './table';

export type GridProps = {
  width?: string | number;
  height?: string | number;
  defaultColumnWidth?: string | number;
  containerClass?: string;
  gridClass?: string;
  rowClass?: ((row: SupaRow) => string | undefined) | undefined;
};

export type SupabaseGridProps = {
  /**
   * database table swagger or table name
   */
  table: SupaTable | string;
  schema?: string;
  /**
   * storageRef is used to save state on localstorage
   */
  storageRef?: string;
  /**
   * show create new column button if available
   */
  onAddColumn?: () => void;
  /**
   * show edit column menu if available
   */
  onEditColumn?: (columnName: string) => void;
  /**
   * show delete column menu if available
   */
  onDeleteColumn?: (columnName: string) => void;
  /**
   * show add row button if available
   */
  onAddRow?: () => Dictionary<any>;
  /**
   * show edit row button if available
   */
  onEditRow?: (rowIdx: number) => void;
  /**
   * props to create client
   */
  clientProps: {
    supabaseUrl: string;
    supabaseKey: string;
    headers?: { [key: string]: string };
  };
  /**
   * props to config grid view
   */
  gridProps?: GridProps;
};
