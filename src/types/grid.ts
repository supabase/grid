import React from 'react';
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
  /**
   * table schema. Default set to 'public' if not provided
   */
  schema?: string;
  /**
   * storageRef is used to save state on localstorage
   */
  storageRef?: string;
  /**
   * enable table editor
   */
  editable?: boolean;
  /**
   * Optional react node to display in grid header
   */
  headerActions?: React.ReactNode;
  /**
   * Optional grid theme
   */
  theme?: 'dark' | 'light';
  /**
   * show create new column button if available
   */
  onAddColumn?: () => void;
  /**
   * show add row button if available
   */
  onAddRow?: () => void;
  /**
   * error handler
   */
  onError?: (error: any) => void;
  /**
   * show edit column menu if available
   */
  onEditColumn?: (columnName: string) => void;
  /**
   * show delete column menu if available
   */
  onDeleteColumn?: (columnName: string) => void;
  /**
   * show edit row button if available
   */
  onEditRow?: (row: SupaRow) => void;
};

export type SupabaseGridRef = {
  rowAdded(row: Dictionary<any>): void;
  rowEdited(row: Dictionary<any>, idx: number): void;
};
