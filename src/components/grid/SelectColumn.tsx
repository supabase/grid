import * as React from 'react';
import { Column, useRowSelection } from '@supabase/react-data-grid';
import { Button, IconMaximize2 } from '@supabase/ui';
import { SupaRow } from '../../types';
import { RowMenu } from '../menu';

export function SelectColumn(
  onEditRow?: (row: SupaRow) => void
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
      const [isRowSelected, onRowSelectionChange] = useRowSelection();
      return (
        <SelectCellFormatter
          aria-label="Select"
          tabIndex={-1}
          isCellSelected={props.isCellSelected}
          value={isRowSelected}
          row={props.row}
          onChange={(checked, isShiftClick) => {
            onRowSelectionChange({
              rowIdx: props.rowIdx,
              checked,
              isShiftClick,
            });
          }}
          onEditRow={onEditRow}
          // Stop propagation to prevent row selection
          onClick={stopPropagation}
        />
      );
    },
    groupFormatter(props) {
      const [isRowSelected, onRowSelectionChange] = useRowSelection();
      return (
        <SelectCellFormatter
          aria-label="Select Group"
          tabIndex={-1}
          isCellSelected={props.isCellSelected}
          value={isRowSelected}
          onChange={checked => {
            onRowSelectionChange({
              checked,
              isShiftClick: false,
              rowIdx: props.rowIdx,
            });
          }}
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
  onEditRow?: (row: SupaRow) => void;
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
    if (onEditRow && row) {
      onEditRow(row);
    }
  }

  return (
    <div className="flex justify-between items-center h-full">
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={tabIndex}
        ref={ref}
        type="checkbox"
        className="rdg-row__select-column__select-action"
        // className="focus:ring-brand-500 border-gray-300"
        disabled={disabled}
        checked={value}
        onChange={handleChange}
        onClick={onClick}
      />
      {onEditRow && (
        <Button
          type="text"
          size="tiny"
          className="rdg-row__select-column__edit-action"
          icon={<IconMaximize2 size="tiny" />}
          onClick={onEditClick}
          style={{ padding: '2px' }}
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
  const ref = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  }

  return (
    <div className="flex justify-between items-center h-full">
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={tabIndex}
        ref={ref}
        type="checkbox"
        className="focus:ring-brand-500 border-gray-300"
        disabled={disabled}
        checked={value}
        onChange={handleChange}
        onClick={onClick}
      />
      <RowMenu />
    </div>
  );
}
