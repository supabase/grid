import * as React from 'react';
import { Button, Divider, IconPlus } from '@supabase/ui';
import FilterDropdown from './filter';
import SortDropdown from './sort';
import StatusLabel from './StatusLabel';

type HeaderProps = {
  onAddColumn?: () => void;
  onAddRow?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onAddColumn, onAddRow }) => {
  const renderNewColumn = (onAddColumn?: () => void) => {
    if (!onAddColumn) return null;
    return (
      <Button type="text" onClick={onAddColumn}>
        New Column
      </Button>
    );
  };

  const renderAddRow = (onAddRow?: () => void) => {
    if (!onAddRow) return null;
    return (
      <Button
        className="ml-2"
        style={{ padding: '4px 8px' }}
        icon={<IconPlus size="tiny" />}
        onClick={onAddRow}
      >
        Insert row
      </Button>
    );
  };

  return (
    <div className="flex justify-between h-10 z-10 px-2 dark:bg-gray-700">
      <div className="flex items-center space-x-2">
        <FilterDropdown />
        <SortDropdown />
        <Divider type="vertical" className="py-2" />
        {renderNewColumn(onAddColumn)}
        {renderAddRow(onAddRow)}
      </div>
      <div className="flex items-center">
        <StatusLabel />
      </div>
    </div>
  );
};
export default Header;
