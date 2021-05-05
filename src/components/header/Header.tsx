import * as React from 'react';
import { Button, IconPlus } from '@supabase/ui';
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
      <Button
        className="grid-ml-2"
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
        className="grid-ml-2"
        style={{ padding: '3px 10px' }}
        icon={<IconPlus />}
        onClick={onAddRow}
      >
        Add Row
      </Button>
    );
  };

  return (
    <div className="grid-flex grid-justify-between grid-h-10 grid-z-10 grid-px-2 grid-bg-gray-700">
      <div className="grid-flex grid-items-center">
        <FilterDropdown />
        <SortDropdown />
        {renderNewColumn(onAddColumn)}
        {renderAddRow(onAddRow)}
      </div>
      <div className="grid-flex grid-items-center">
        <StatusLabel />
      </div>
    </div>
  );
};
export default Header;
