import * as React from 'react';
import { Column } from '@phamhieu1998/react-data-grid';
import { TriggerEvent, useContextMenu } from 'react-contexify';
import { Button, IconEdit, IconChevronDown } from '@supabase/ui';
import { SupaRow } from '../../types';
import { MENU_IDS } from '../menu';

export function SelectColumn(
  onEditRow?: (rowIdx: number) => void
): Column<any, any> {
  return {
    key: 'select-row',
    name: '',
    width: 65,
    maxWidth: 65,
    resizable: false,
    sortable: false,
    frozen: true,
    headerRenderer(props) {
      return (
        <SelectCellHeader
          aria-label="Select All"
          value={props.allRowsSelected}
          onChange={props.onAllRowsSelectionChange}
        />
      );
    },
    formatter(props) {
      return (
        <SelectCellFormatter
          aria-label="Select"
          tabIndex={-1}
          isCellSelected={props.isCellSelected}
          value={props.isRowSelected}
          row={props.row}
          onChange={props.onRowSelectionChange}
          onEditRow={onEditRow}
          // Stop propagation to prevent row selection
          onClick={stopPropagation}
        />
      );
    },
    groupFormatter(props) {
      return (
        <SelectCellFormatter
          aria-label="Select Group"
          tabIndex={-1}
          isCellSelected={props.isCellSelected}
          value={props.isRowSelected}
          onChange={props.onRowSelectionChange}
          // Stop propagation to prevent row selection
          onClick={stopPropagation}
        />
      );
    },
  };
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation();
}

type SharedInputProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'disabled' | 'tabIndex' | 'onClick' | 'aria-label' | 'aria-labelledby'
>;

interface SelectCellFormatterProps extends SharedInputProps {
  isCellSelected?: boolean;
  value: boolean;
  row?: SupaRow;
  onChange: (value: boolean, isShiftClick: boolean) => void;
  onEditRow?: (rowIdx: number) => void;
}

function SelectCellFormatter({
  row,
  value,
  tabIndex,
  isCellSelected,
  disabled,
  onClick,
  onChange,
  onEditRow,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SelectCellFormatterProps) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useLayoutEffect(() => {
    if (!isCellSelected) return;
    ref.current?.focus({ preventScroll: true });
  }, [isCellSelected]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  function onEditClick() {
    if (onEditRow && row) onEditRow(row.idx);
  }

  return (
    <div className="flex items-center h-full">
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={tabIndex}
        ref={ref}
        type="checkbox"
        className="focus:ring-brand-500 h-4 w-4 border-gray-300"
        disabled={disabled}
        checked={value}
        onChange={handleChange}
        onClick={onClick}
      />
      {onEditRow && (
        <Button
          type="text"
          className="ml-3"
          icon={<IconEdit />}
          onClick={onEditClick}
          style={{ padding: '3px' }}
        />
      )}
    </div>
  );
}

interface SelectCellHeaderProps extends SharedInputProps {
  value: boolean;
  onChange: (value: boolean, isShiftClick: boolean) => void;
}

function SelectCellHeader({
  disabled,
  tabIndex,
  value,
  onChange,
  onClick,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SelectCellHeaderProps) {
  const { show } = useContextMenu({
    id: MENU_IDS.MULTI_ROWS_MENU_ID,
  });
  const triggerRef = React.useRef<any>(null);
  const ref = React.useRef<HTMLInputElement>(null);

  function getMenuPosition() {
    const { left, bottom } = triggerRef?.current.button.getBoundingClientRect();
    return { x: left, y: bottom + 8 };
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  function displayMenu(e: TriggerEvent) {
    show(e, { position: getMenuPosition(), props: { allRowsSelected: true } });
  }

  return (
    <div className="flex items-center h-full">
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={tabIndex}
        ref={ref}
        type="checkbox"
        className="focus:ring-brand-500 h-4 w-4 border-gray-300"
        disabled={disabled}
        checked={value}
        onChange={handleChange}
        onClick={onClick}
      />
      <Button
        type="text"
        className="ml-3"
        ref={triggerRef}
        icon={<IconChevronDown />}
        onClick={displayMenu}
        style={{ padding: '3px' }}
      />
    </div>
  );
}
