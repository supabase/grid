import * as React from 'react';
import { Column, SelectColumn } from '@phamhieu1998/react-data-grid';
import { ColumnHeaderProps, Dictionary, SupaColumn, SupaTable } from './types';
import {
  CheckboxEditor,
  NumberEditor,
  SelectEditor,
  TextEditor,
} from './components/editor';

export function getGridColumns(
  table: SupaTable,
  options?: { defaultWidth?: string | number },
  headerRenderer?: React.ComponentType<ColumnHeaderProps<any>>
): any[] {
  const columns = table.columns.map(x => {
    let columnDef: Column<Dictionary<any>> = {
      key: x.name,
      name: x.name,
      resizable: true,
      width: options?.defaultWidth || _getColumnWidth(x),
      minWidth: 50,
      headerRenderer: x.isIdentity ? undefined : headerRenderer,
    };

    if (x.isIdentity) columnDef.frozen = true;

    _setupColumnEditor(x, columnDef);
    return columnDef;
  });
  console.log('columns', columns);
  return [SelectColumn, ...columns];
}

function _setupColumnEditor(
  columnDef: SupaColumn,
  config: Column<Dictionary<any>>
) {
  if (columnDef.isIdentity || !columnDef.isUpdatable) {
    return;
  }

  if (_isNumericalColumn(columnDef.dataType)) {
    config.editor = NumberEditor;
  } else if (_isJsonColumn(columnDef.dataType)) {
    // TODO
  } else if (_isTextColumn(columnDef.dataType)) {
    config.editor = TextEditor;
    config.editorOptions = {
      editOnClick: true,
    };
  } else if (_isDateTimeColumn(columnDef.dataType)) {
    // TODO
  } else if (_isBoolColumn(columnDef.dataType)) {
    config.editor = CheckboxEditor;
    config.formatter = p => {
      const value = p.row[p.column.key] as boolean;
      return <>{value ? 'true' : 'false'}</>;
    };
    config.editorOptions = {
      editOnClick: true,
    };
  } else if (_isEnumColumn(columnDef.dataType)) {
    const options = columnDef.enums.map(x => {
      return { label: x, value: x };
    });
    config.formatter = p => {
      return <>{p.row[p.column.key]}</>;
    };
    config.editor = p => <SelectEditor {...p} options={options} />;
    config.editorOptions = {
      editOnClick: true,
    };
  }
}

function _getColumnWidth(columnDef: SupaColumn): string | number | undefined {
  if (_isNumericalColumn(columnDef.dataType)) {
    return 100;
  } else if (_isDateTimeColumn(columnDef.dataType)) {
    return 150;
  } else if (_isBoolColumn(columnDef.dataType)) {
    return 100;
  } else if (_isEnumColumn(columnDef.dataType)) {
    return 150;
  } else return 250;
}

const NUMERICAL_TYPES = [
  'bigint',
  'bigserial',
  'int2',
  'int4',
  'int8',
  'integer',
  'float4',
  'float8',
  'real',
  'smallint',
  'smallserial',
  'serial2',
  'serial4',
  'serial8',
];
function _isNumericalColumn(type: string) {
  return NUMERICAL_TYPES.indexOf(type.toLowerCase()) > -1;
}

const JSON_TYPES = ['json', 'jsonb'];
function _isJsonColumn(type: string) {
  return JSON_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TEXT_TYPES = ['text', 'varchar'];
function _isTextColumn(type: string) {
  return TEXT_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TIMESTAMP_TYPES = ['date', 'time', 'timestamp', 'timetz', 'timestamptz'];
function _isDateTimeColumn(type: string) {
  return TIMESTAMP_TYPES.indexOf(type.toLowerCase()) > -1;
}

const BOOL_TYPES = ['boolean', 'bool'];
function _isBoolColumn(type: string) {
  return BOOL_TYPES.indexOf(type.toLowerCase()) > -1;
}

const ENUM_TYPES = ['user-defined'];
function _isEnumColumn(type: string) {
  return ENUM_TYPES.indexOf(type.toLowerCase()) > -1;
}
