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
  TimeWithTimezoneEditor,
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
    editable?: boolean;
    defaultWidth?: string | number;
    onAddColumn?: () => void;
  }
): any[] {
  const columns = table.columns.map((x) => {
    const columnType = getColumnType(x);
    const columnDefinition: Column<SupaRow> = {
      key: x.name,
      name: x.name,
      resizable: true,
      width: options?.defaultWidth || getColumnWidth(x),
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
      editor: options?.editable ? getColumnEditor(x, columnType) : undefined,
      formatter: getColumnFormatter(x, columnType),
    };

    return columnDefinition;
  });

  const gridColumns = [SelectColumn, ...columns];
  if (options?.onAddColumn) {
    gridColumns.push(AddColumn);
  }

  return gridColumns;
}

function getColumnEditor(columnDefinition: SupaColumn, columnType: ColumnType) {
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
      return columnDefinition.format.endsWith('z')
        ? TimeWithTimezoneEditor
        : TimeEditor;
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

function getColumnFormatter(columnDef: SupaColumn, columnType: ColumnType) {
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

function getColumnType(columnDef: SupaColumn): ColumnType {
  if (isForeignKeyColumn(columnDef)) {
    return 'foreign_key';
  } else if (isNumericalColumn(columnDef.dataType)) {
    return 'number';
  } else if (isArrayColumn(columnDef.dataType)) {
    return 'array';
  } else if (isJsonColumn(columnDef.dataType)) {
    return 'json';
  } else if (isTextColumn(columnDef.dataType)) {
    return 'text';
  } else if (isDateColumn(columnDef.format)) {
    return 'date';
  } else if (isTimeColumn(columnDef.format)) {
    return 'time';
  } else if (isDateTimeColumn(columnDef.format)) {
    return 'datetime';
  } else if (isBoolColumn(columnDef.dataType)) {
    return 'boolean';
  } else if (isEnumColumn(columnDef.dataType)) {
    return 'enum';
  } else return 'unknown';
}

function getColumnWidth(columnDef: SupaColumn): string | number | undefined {
  if (isNumericalColumn(columnDef.dataType)) {
    return 120;
  } else if (
    isDateTimeColumn(columnDef.format) ||
    isDateColumn(columnDef.format) ||
    isTimeColumn(columnDef.format)
  ) {
    return 150;
  } else if (isBoolColumn(columnDef.dataType)) {
    return 120;
  } else if (isEnumColumn(columnDef.dataType)) {
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
export function isNumericalColumn(type: string) {
  return NUMERICAL_TYPES.indexOf(type.toLowerCase()) > -1;
}

const JSON_TYPES = ['json', 'jsonb', 'array'];
function isJsonColumn(type: string) {
  return JSON_TYPES.indexOf(type.toLowerCase()) > -1;
}

const ARRAY_TYPES = ['array'];
function isArrayColumn(type: string) {
  return ARRAY_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TEXT_TYPES = ['text', 'character varying'];
function isTextColumn(type: string) {
  return TEXT_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TIMESTAMP_TYPES = ['timestamp', 'timestamptz'];
function isDateTimeColumn(type: string) {
  return TIMESTAMP_TYPES.indexOf(type.toLowerCase()) > -1;
}

const DATE_TYPES = ['date'];
function isDateColumn(type: string) {
  return DATE_TYPES.indexOf(type.toLowerCase()) > -1;
}

const TIME_TYPES = ['time', 'timetz'];
function isTimeColumn(type: string) {
  return TIME_TYPES.indexOf(type.toLowerCase()) > -1;
}

const BOOL_TYPES = ['boolean', 'bool'];
function isBoolColumn(type: string) {
  return BOOL_TYPES.indexOf(type.toLowerCase()) > -1;
}

const ENUM_TYPES = ['user-defined'];
function isEnumColumn(type: string) {
  return ENUM_TYPES.indexOf(type.toLowerCase()) > -1;
}

function isForeignKeyColumn(columnDef: SupaColumn) {
  const { targetTableSchema, targetTableName, targetColumnName } = columnDef;
  return !!targetTableSchema && !!targetTableName && !!targetColumnName;
}
