import * as React from 'react';
import {
  Button,
  Divider,
  Modal,
  Menu,
  Input,
  Space,
  Typography,
  IconExternalLink,
  IconChevronDown,
  IconSearch,
  IconTrash,
} from '@supabase/ui';
import { useTrackedState } from '../../store';
import { DropdownControl, ModalPortal } from '../common';
import { Dictionary } from '../../types';
import { FilterConditionOptions } from '../../components/header/filter/FilterRow';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

type ForeignTableModalProps = {
  columnName?: string;
  defaultValue?: string;
  onChange: (value: any | null) => void;
};

export const ForeignTableModal: React.FC<ForeignTableModalProps> = ({
  columnName,
  defaultValue,
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
    if (!visible) return;

    fetchColumns();

    if (defaultValue && columnDefinition) {
      fetchData({
        columnName: columnDefinition.targetColumnName!,
        condition: 'eq',
        filterText: defaultValue,
      });
    } else {
      fetchData();
    }
  }, [visible]);

  async function fetchColumns() {
    if (
      !state.openApiService ||
      !columnDefinition?.targetTableName ||
      !columnDefinition?.targetTableSchema
    )
      return;

    const { data, error } = await state.openApiService.fetchDescription();
    if (!error && data && data.definitions) {
      const tableInfo = data.definitions[columnDefinition?.targetTableName];
      if (tableInfo) {
        const columns = tableInfo.properties as Dictionary<any>;
        const columnNames = Object.keys(columns) as string[];
        setForeignColumnNames(columnNames);
      }
    }
  }

  async function fetchData(filter?: {
    columnName: string;
    condition: string;
    filterText: string;
  }) {
    if (!state.client || !columnDefinition?.targetTableName) return;

    let request = state.client.from(columnDefinition?.targetTableName).select();

    if (filter && filter.filterText) {
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
    return <Menu className="foreign-table-modal__menu">{temp}</Menu>;
  }

  function onFilterChange(value: {
    columnName: string;
    condition: string;
    filterText: string;
  }) {
    const { columnName, condition } = value;
    if (columnName && condition) fetchData(value);
  }

  function onClearValueClick() {
    onChange(null);
    setVisible(false);
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
          <Modal
            visible={visible}
            onCancel={toggle}
            closable
            contentStyle={{ padding: 0 }}
            customFooter={
              <Space style={{ width: '100%' }}>
                <Button
                  block
                  danger
                  icon={<IconTrash />}
                  onClick={onClearValueClick}
                >
                  Clear value
                </Button>
              </Space>
            }
          >
            <Filter
              defaultColumnName={
                columnDefinition?.targetColumnName ?? undefined
              }
              defaultValue={defaultValue}
              foreignColumnNames={foreignColumnNames}
              onChange={onFilterChange}
            />
            <div className="foreign-table-modal__content-container">
              <Divider light />
              <div className="foreign-table-modal__content-container__inner">
                <div
                  className="foreign-table-modal__content-container__inner__overflow"
                  style={{ minHeight: '21rem', maxHeight: '20rem' }}
                >
                  {renderRows()}
                </div>
              </div>
            </div>
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
  defaultColumnName?: string;
  defaultValue?: string;
  foreignColumnNames: string[];
  onChange: (value: {
    columnName: string;
    condition: string;
    filterText: string;
  }) => void;
};

export const Filter: React.FC<FilterProps> = ({
  defaultColumnName,
  defaultValue,
  foreignColumnNames,
  onChange,
}) => {
  const [columnName, setColumnName] = React.useState(
    defaultColumnName
      ? defaultColumnName
      : foreignColumnNames.length > 0
      ? foreignColumnNames[0]
      : ''
  );
  const [condition, setCondition] = React.useState(
    FilterConditionOptions[0].value
  );
  const [filterText, setFilterText] = React.useState(defaultValue ?? '');

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
    <div className="foreign-table-modal__filter">
      <DropdownControl
        side="bottom"
        align="start"
        options={columnOptions}
        onSelect={onColumnChange}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          <span className="foreign-table-modal__filter__trigger-content">
            <span className="foreign-table-modal__filter__trigger-content__label">
              Column
            </span>
            <span className="foreign-table-modal__filter__trigger-content__name">
              {columnName}
            </span>
          </span>
        </Button>
      </DropdownControl>
      <DropdownControl
        side="bottom"
        align="start"
        options={FilterConditionOptions}
        onSelect={onConditionChange}
      >
        <Button as="span" type="outline" iconRight={<IconChevronDown />}>
          <span className="foreign-table-modal__filter__trigger-content">
            <span className="foreign-table-modal__filter__trigger-content__label">
              Filter
            </span>
            <span className="foreign-table-modal__filter__trigger-content__name">
              {condition}
            </span>
          </span>
        </Button>
      </DropdownControl>
      <Input
        size="tiny"
        className="foreign-table-modal__filter__search-input"
        placeholder="Find a record"
        value={filterText}
        onChange={onFilterChange}
        icon={<IconSearch size="small" />}
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
    <div className="foreign-table-modal__row-item">
      <Menu.Item onClick={() => onSelect(item)}>
        <div className="foreign-table-modal__row-item__inner">
          {keys.map((key, j) => {
            //
            // limit to 5 attributes
            //
            // this could be improved so the user could pick which attributes to display
            // @mildtomato
            if (j > 5) return null;

            return (
              <div
                className="foreign-table-modal__row-item__inner__key-item"
                key={`item-${j}`}
              >
                <Typography.Text
                  small
                  type="secondary"
                  className="foreign-table-modal__row-item__inner__key-item__key"
                >
                  {key}
                </Typography.Text>
                <Typography.Text small strong>
                  {item[key] || '[null]'}
                </Typography.Text>
              </div>
            );
          })}
        </div>
      </Menu.Item>
    </div>
  );
};
