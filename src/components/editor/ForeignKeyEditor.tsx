import * as React from 'react';
import { EditorProps } from '@supabase/react-data-grid';
import {
  Button,
  Divider,
  Modal,
  Menu,
  Input,
  Typography,
  IconExternalLink,
  IconX,
} from '@supabase/ui';
import { useTrackedState } from '../../store';
import { DropdownControl, ModalPortal, NullValue } from '../common';
import { Dictionary } from '../../types';
import { FilterConditionOptions } from '../../components/header/filter/FilterRow';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export function ForeignKeyEditor<TRow, TSummaryRow = unknown>({
  row,
  column,
  onRowChange,
}: EditorProps<TRow, TSummaryRow>) {
  const rawValue = row[column.key as keyof TRow] as unknown;
  const value = rawValue ? rawValue + '' : null;

  function onChange(_value: any | null) {
    if (!_value || _value == '')
      onRowChange({ ...row, [column.key]: null }, true);
    else onRowChange({ ...row, [column.key]: _value }, true);
  }

  function onClearValue() {
    onRowChange({ ...row, [column.key]: null }, true);
  }

  return (
    <div className="flex items-center px-2">
      <p className="m-0 flex-grow text-sm overflow-hidden overflow-ellipsis">
        {value ? value : <NullValue />}
      </p>
      {value && (
        <Button
          type="text"
          onClick={onClearValue}
          icon={<IconX />}
          style={{ padding: '3px' }}
        />
      )}
      <ForeignTableModal columnName={column.key} onChange={onChange} />
    </div>
  );
}

type ForeignTableModalProps = {
  columnName: string | undefined;
  onChange: (value: any | null) => void;
};

export const ForeignTableModal: React.FC<ForeignTableModalProps> = ({
  columnName,
  onChange,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [foreignColumnNames, setForeignColumnNames] = React.useState<string[]>(
    []
  );
  const [rows, setRows] = React.useState<Dictionary<any>[] | null>(null);
  const state = useTrackedState();
  const columnDefinition = state.table?.columns.find(x => x.name == columnName);

  React.useEffect(() => {
    fetchColumns();
    fetchData();
  }, []);

  async function fetchColumns() {
    if (
      !state.openApiService ||
      !columnDefinition?.targetTableName ||
      !columnDefinition?.targetTableSchema
    )
      return;

    const { data, error } = await state.openApiService.fetchDescription();
    if (!error && data) {
      const tableInfo = data.definitions[columnDefinition?.targetTableName];
      const columns = tableInfo.properties as Dictionary<any>;
      const columnNames = Object.keys(columns) as string[];
      setForeignColumnNames(columnNames);
    }
  }

  async function fetchData(filter?: {
    columnName: string;
    condition: string;
    filterText: string;
  }) {
    if (!state.client || !columnDefinition?.targetTableName) return;

    let request = state.client.from(columnDefinition?.targetTableName).select();

    if (filter) {
      const { columnName, condition, filterText } = filter;
      switch (condition) {
        case 'is':
          const _filterText = filterText.toLowerCase();
          if (_filterText == 'null') request = request.is(columnName, null);
          else if (_filterText == 'true')
            request = request.is(columnName, true);
          else if (_filterText == 'false')
            request = request.is(columnName, false);
          break;
        case 'in':
          const filterValues = filterText.split(',').map(x => x.trim());
          request = request.in(columnName, filterValues);
          break;
        default:
          request = request.filter(
            columnName,
            // @ts-ignore
            condition.toLowerCase(),
            filterText
          );
          break;
      }
    }

    // TODO: How to let users know that filter result limit at 20 results
    // should we allow a higher value?
    const res = await request.limit(20);
    if (!res.data || res.error) {
      setRows(null);
    } else {
      setRows(res.data);
    }
  }

  function toggle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (event && event.stopPropagation) event.stopPropagation();
    setVisible(!visible);
  }

  function onItemSelect(item: Dictionary<any>) {
    if (item && columnDefinition && columnDefinition.targetColumnName) {
      const value = item[columnDefinition.targetColumnName];
      onChange(value);
    }

    setVisible(false);
  }

  function renderRows() {
    if (!rows) return null;
    const temp = rows.map((x, i) => {
      return <RowItem key={`menu-${i}`} item={x} onSelect={onItemSelect} />;
    });
    return <Menu>{temp}</Menu>;
  }

  function onFilterChange(value: {
    columnName: string;
    condition: string;
    filterText: string;
  }) {
    const { columnName, condition, filterText } = value;
    if (columnName && condition && filterText) fetchData(value);
  }

  return (
    <>
      <Button
        type="text"
        onClick={toggle}
        icon={<IconExternalLink />}
        style={{ padding: '3px' }}
      />
      {visible && (
        <ModalPortal>
          <Modal visible={visible} onCancel={toggle} closable hideFooter>
            <Filter
              foreignColumnNames={foreignColumnNames}
              onChange={onFilterChange}
            />
            <Divider />
            <div
              className="w-full overflow-scroll"
              style={{ minHeight: '20rem', maxHeight: '20rem' }}
            >
              {renderRows()}
            </div>
            <Divider />
          </Modal>
        </ModalPortal>
      )}
    </>
  );
};

const onFilterChange = (
  columnName: string,
  condition: string,
  filterText: string,
  onChange: (value: {
    columnName: string;
    condition: string;
    filterText: string;
  }) => void
) => {
  onChange({ columnName, condition, filterText });
};
const onFilterChangeDebounced = AwesomeDebouncePromise(onFilterChange, 500);

type FilterProps = {
  foreignColumnNames: string[];
  onChange: (value: {
    columnName: string;
    condition: string;
    filterText: string;
  }) => void;
};

export const Filter: React.FC<FilterProps> = ({
  foreignColumnNames,
  onChange,
}) => {
  const [columnName, setColumnName] = React.useState(
    foreignColumnNames.length > 0 ? foreignColumnNames[0] : ''
  );
  const [condition, setCondition] = React.useState(
    FilterConditionOptions[0].value
  );
  const [filterText, setFilterText] = React.useState('');

  const columnOptions =
    foreignColumnNames.map(x => {
      return { value: x, label: x };
    }) || [];

  function triggerOnChange(
    _columnName: string,
    _condition: string,
    _filterText: string
  ) {
    onFilterChangeDebounced(_columnName, _condition, _filterText, onChange);
  }

  function onColumnChange(value: string | number) {
    const _value = value + '';
    setColumnName(_value);
    triggerOnChange(_value, condition, filterText);
  }

  function onConditionChange(value: string | number) {
    const _value = value + '';
    setCondition(_value);
    triggerOnChange(columnName, _value, filterText);
  }

  function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setFilterText(value);
    triggerOnChange(columnName, condition, value);
  }

  return (
    <div className="flex items-center w-full space-x-2">
      <DropdownControl
        side="bottom"
        align="start"
        options={columnOptions}
        onSelect={onColumnChange}
      >
        <Button as="span" type="outline">
          {columnName}
        </Button>
      </DropdownControl>
      <DropdownControl
        side="bottom"
        align="start"
        options={FilterConditionOptions}
        onSelect={onConditionChange}
      >
        <Button as="span" type="outline">
          {condition}
        </Button>
      </DropdownControl>
      <Input
        size="tiny"
        className="flex-grow"
        placeholder="Find a record"
        value={filterText}
        onChange={onFilterChange}
      />
    </div>
  );
};

type RowItemProps = {
  item: Dictionary<any>;
  onSelect: (item: Dictionary<any>) => void;
};

export const RowItem: React.FC<RowItemProps> = ({ item, onSelect }) => {
  const keys = Object.keys(item);
  return (
    <Menu.Item onClick={() => onSelect(item)}>
      <div className="flex space-x-4">
        {keys.map((key, j) => {
          return (
            <div className="flex flex-col flex-initial" key={`item-${j}`}>
              <Typography.Text strong>{key}</Typography.Text>
              <Typography.Text>{item[key] || '[null]'}</Typography.Text>
            </div>
          );
        })}
      </div>
    </Menu.Item>
  );
};
