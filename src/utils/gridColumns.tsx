import * as React from 'react';
import { Column } from '@supabase/react-data-grid';
import { ColumnType, SupaColumn, SupaRow, SupaTable } from '../types';
import {
  BooleanEditor,
  DateEditor,
  DateTimeEditor,
  DateTimeWithTimezoneEditor,
  JsonEditor,
  NullableBooleanEditor,
  NumberEditor,
  SelectEditor,
  TextEditor,
  TimeEditor,
} from '../components/editor';
import { AddColumn, ColumnHeader, SelectColumn } from '../components/grid';
import { COLUMN_MIN_WIDTH } from '../constants';
import {
  BooleanFormatter,
  DefaultFormatter,
  ForeignKeyFormatter,
} from '../components/formatter';

export function getGridColumns(
  table: SupaTable,
  options?: {
    onAddColumn?: () => void;
    defaultWidth?: string | number;
  }
): any[] {
  const columns = table.columns.map((x) => {
    const columnType = _getColumnType(x);
    const columnDefinition: Column<SupaRow> = {
      key: x.name,
      name: x.name,
      resizable: true,
      width: options?.defaultWidth || _getColumnWidth(x),
      minWidth: COLUMN_MIN_WIDTH,
      frozen: x.isPrimaryKey,
      headerRenderer: (props) => (
        <ColumnHeader
          {...props}
          columnType={columnType}
          isPrimaryKey={x.isPrimaryKey}
          format={x.format}
        />
      ),
      editor: _getColumnEditor(x, columnType),
      formatter: _getColumnFormatter(x, columnType),
    };

    return columnDefinition;
  });

  const gridColumns = [SelectColumn, ...columns];
  if (options?.onAddColumn) {
    gridColumns.push(AddColumn);
  }

  return gridColumns;
}

function _getColumnEditor(
  columnDefinition: SupaColumn,
  columnType: ColumnType
) {
  if (columnDefinition.isPrimaryKey || !columnDefinition.isUpdatable) {
    return;
  }

  switch (columnType) {
    case 'boolean': {
      return columnDefinition.isNullable
        ? NullableBooleanEditor
        : BooleanEditor;
    }
    case 'date': {
      return DateEditor;
    }
    case 'datetime': {
      return columnDefinition.format.endsWith('z')
        ? DateTimeWithTimezoneEditor
        : DateTimeEditor;
    }
    case 'time': {
      return TimeEditor;
    }
    case 'enum': {
      const options = columnDefinition.enum!.map((x) => {
        return { label: x, value: x };
      });
      return (p: any) => <SelectEditor {...p} options={options} />;
    }
    case 'array':
    case 'json': {
      return JsonEditor;
    }
    case 'number': {
      return NumberEditor;
    }
    case 'text': {
      return TextEditor;
    }
    default: {
      return undefined;
    }
  }
}

function _getColumnFormatter(columnDef: SupaColumn, columnType: ColumnType) {
  switch (columnType) {
    case 'boolean': {
      return BooleanFormatter;
    }
    case 'foreign_key': {
      if (columnDef.isPrimaryKey || !columnDef.isUpdatable) {
        return DefaultFormatter;
      } else {
        return ForeignKeyFormatter;
      }
    }
    default: {
      return DefaultFormatter;
    }
  }
}

function _getColumnType(columnDef: SupaColumn): ColumnType {
  if (_isForeignKeyColumn(columnDef)) {
    return 'foreign_key';
  } else if (_isNumericalColumn(columnDef.dataType)) {
    return 'number';
  } else if (_isArrayColumn(columnDef.dataType)) {
    return 'array';
  } else if (_isJsonColumn(columnDef.dataType)) {
    return 'json';
  } else if (_isTextColumn(columnDef.dataType)) {
    return 'text';
  } else if (_isDateColumn(columnDef.format)) {
    return 'date';
  } else if (_isTimeColumn(columnDef.format)) {
    return 'time';
  } else if (_isDateTimeColumn(columnDef.format)) {
    return 'datetime';
  } else if (_isBoolColumn(columnDef.dataType)) {
    return 'boolean';
  } else if (_isEnumColumn(columnDef.dataType)) {
    return 'enum';
  } else return 'unknown';
}

function _getColumnWidth(columnDef: SupaColumn): string | number | undefined {
  if (_isNumericalColumn(columnDef.dataType)) {
    return 120;
  } else if (
    _isDateTimeColumn(columnDef.format) ||
    _isDateColumn(columnDef.format) ||
    _isTimeColumn(columnDef.format)
  ) {
    return 150;
  } else if (_isBoolColumn(columnDef.dataType)) {
    return 120;
  } else if (_isEnumColumn(columnDef.dataType)) {
    return 150;
  } else return 250;
}

const NUMERICAL_TYPES = [
  'smallint',
  'integer',
  'bigint',
  'decimal',
  'numeric',
  'real',
  'double precision',
  'serial',
  'bigserial',
  'int2',
  'int4',
  'int8',
  'float4',
  'float8',
  'smallserial',
  'serial2',
  'serial4',
  'serial8',
];
function _isNumericalColumn(type: string) {
  return NUMERICAL_TYPES.indexOf(type.toLowerCase()) > -1;
}

const JSON_TYPES = ['json', 'jsonb', 'array'];
function _isJsonColumn(type: string) {
  return JSON_TYPES.indexOf(type.toLowerCase()) > -1;
}

const ARRAY_TYPES = ['array'];
function _isArrayColumn(type: string) {
  return ARRAY_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TEXT_TYPES = ['text', 'character varying'];
function _isTextColumn(type: string) {
  return TEXT_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TIMESTAMP_TYPES = ['timestamp', 'timestamptz'];
function _isDateTimeColumn(type: string) {
  return TIMESTAMP_TYPES.indexOf(type.toLowerCase()) > -1;
}

const DATE_TYPES = ['date'];
function _isDateColumn(type: string) {
  return DATE_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TIME_TYPES = ['time', 'timetz'];
function _isTimeColumn(type: string) {
  return TIME_TYPES.indexOf(type.toLowerCase()) > -1;
}

const BOOL_TYPES = ['boolean', 'bool'];
function _isBoolColumn(type: string) {
  return BOOL_TYPES.indexOf(type.toLowerCase()) > -1;
}

const ENUM_TYPES = ['user-defined'];
function _isEnumColumn(type: string) {
  return ENUM_TYPES.indexOf(type.toLowerCase()) > -1;
}

function _isForeignKeyColumn(columnDef: SupaColumn) {
  const { targetTableSchema, targetTableName, targetColumnName } = columnDef;
  return !!targetTableSchema && !!targetTableName && !!targetColumnName;
}
