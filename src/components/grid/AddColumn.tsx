import * as React from 'react';
import { Column } from '@supabase/react-data-grid';
import { Button, IconPlus } from '@supabase/ui';
import { ADD_COLUMN_KEY } from '../../constants';

export function AddColumn(onAddColumn?: () => void): Column<any, any> {
  return {
    key: ADD_COLUMN_KEY,
    name: '',
    width: 100,
    maxWidth: 100,
    resizable: false,
    sortable: false,
    frozen: false,
    headerRenderer(props) {
      return (
        <AddColumnHeader
          aria-label="Add New Row"
          value={props.allRowsSelected}
          onChange={props.onAllRowsSelectionChange}
          onAddColumn={onAddColumn}
        />
      );
    },
  };
}

type SharedInputProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'disabled' | 'tabIndex' | 'onClick' | 'aria-label' | 'aria-labelledby'
>;

interface AddColumnHeaderProps extends SharedInputProps {
  value: boolean;
  onChange: (value: boolean, isShiftClick: boolean) => void;
  onAddColumn?: () => void;
}

function AddColumnHeader({ onAddColumn }: AddColumnHeaderProps) {
  return (
    <div className="sb-grid-add-column">
      <Button block type="text" onClick={onAddColumn} icon={<IconPlus />} />
    </div>
  );
}
