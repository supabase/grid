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
import TableService from '../../services/TableService';

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
    <div className="flex items-center px-2 overflow-hidden">
      <p className="m-0 flex-grow text-sm overflow-ellipsis">
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
  const [foreignColumns, setForeignColumns] = React.useState<
    Dictionary<any>[] | null
  >(null);
  const [rows, setRows] = React.useState<Dictionary<any>[] | null>(null);
  const state = useTrackedState();
  const columnDefinition = state.table?.columns.find(x => x.name == columnName);

  React.useEffect(() => {
    fetchColumns();
    fetchData();
  }, []);

  async function fetchColumns() {
    if (
      !state.client ||
      !columnDefinition?.targetTableName ||
      !columnDefinition?.targetTableSchema
    )
      return;

    const tableService = new TableService(state.client);
    const resColumns = await tableService.fetchColumns(
      columnDefinition?.targetTableName,
      columnDefinition?.targetTableSchema
    );
    if (resColumns.data && resColumns.data.length > 0) {
      setForeignColumns(resColumns.data);
    }
  }

  async function fetchData() {
    if (!state.client || !columnDefinition?.targetTableName) return;

    const res = await state.client
      .from(columnDefinition?.targetTableName)
      .select()
      .limit(10);

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
    console.log('onFilterChange', value);
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
              foreignColumns={foreignColumns || []}
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
  foreignColumns: Dictionary<any>[];
  onChange: (value: {
    columnName: string;
    condition: string;
    filterText: string;
  }) => void;
};

export const Filter: React.FC<FilterProps> = ({ foreignColumns, onChange }) => {
  const [columnName, setColumnName] = React.useState(foreignColumns[0].name);
  const [condition, setCondition] = React.useState(
    FilterConditionOptions[0].value
  );
  const [filterText, setFilterText] = React.useState('');

  const columnOptions =
    foreignColumns.map(x => {
      return { value: x.name, label: x.name };
    }) || [];

  function triggerOnChange() {
    onFilterChangeDebounced(columnName, condition, filterText, onChange);
  }

  function onColumnChange(value: string | number) {
    setColumnName(value + '');
    triggerOnChange();
  }

  function onConditionChange(condition: string | number) {
    setCondition(condition + '');
    triggerOnChange();
  }

  function onFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setFilterText(value);
    triggerOnChange();
  }

  return (
    <div className="flex items-center w-full">
      <DropdownControl
        className="z-20"
        options={columnOptions}
        onSelect={onColumnChange}
      >
        <Button className="mr-2" type="outline">
          {columnName}
        </Button>
      </DropdownControl>
      <DropdownControl
        className="z-20"
        options={FilterConditionOptions}
        onSelect={onConditionChange}
      >
        <Button className="mr-2" type="outline">
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
