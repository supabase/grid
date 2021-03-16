import * as React from 'react';
import { Button, IconPlus } from '@supabase/ui';
import FilterDropdown from './filter';
import SortDropdown from './sort';
import StatusLabel from './StatusLabel';
import Pagination from './pagination';

type HeaderProps = {
  onAddColumn?: () => void;
  onAddRow?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onAddColumn, onAddRow }) => {
  const renderNewColumn = (onAddColumn?: () => void) => {
    if (!onAddColumn) return null;
    return (
      <Button
        className="ml-2"
        type="outline"
        style={{ padding: '3px 10px', borderColor: '#333' }}
        onClick={onAddColumn}
      >
        New Column
      </Button>
    );
  };

  const renderAddRow = (onAddRow?: () => void) => {
    if (!onAddRow) return null;
    return (
      <Button
        className="ml-2"
        style={{ padding: '3px 10px' }}
        icon={<IconPlus />}
        onClick={onAddRow}
      >
        Add Row
      </Button>
    );
  };

  return (
    <div className="flex justify-between h-10 z-10 px-2 bg-gray-700">
      <div className="flex items-center">
        <FilterDropdown />
        <SortDropdown />
        {renderNewColumn(onAddColumn)}
        {renderAddRow(onAddRow)}
      </div>
      <div className="flex items-center">
        <Pagination />
      </div>
      <div className="flex items-center">
        <StatusLabel />
      </div>
    </div>
  );
};
export default Header;
