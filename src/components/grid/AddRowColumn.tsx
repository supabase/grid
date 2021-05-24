import * as React from 'react';
import { Column } from '@supabase/react-data-grid';
import { Button, IconPlus } from '@supabase/ui';

export function AddRowColumn(onAddRow?: () => void): Column<any, any> {
  return {
    key: 'add-row',
    name: '',
    width: 100,
    maxWidth: 100,
    resizable: false,
    sortable: false,
    frozen: false,
    headerRenderer(props) {
      return (
        <AddRowHeader
          aria-label="Add New Row"
          value={props.allRowsSelected}
          onChange={props.onAllRowsSelectionChange}
          onAddRow={onAddRow}
        />
      );
    },
  };
}

type SharedInputProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'disabled' | 'tabIndex' | 'onClick' | 'aria-label' | 'aria-labelledby'
>;

interface AddRowHeaderProps extends SharedInputProps {
  value: boolean;
  onChange: (value: boolean, isShiftClick: boolean) => void;
  onAddRow?: () => void;
}

function AddRowHeader({ onAddRow }: AddRowHeaderProps) {
  return (
    <div className="flex h-full">
      <Button block type="text" onClick={onAddRow} icon={<IconPlus />} />
    </div>
  );
}
