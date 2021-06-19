import * as React from 'react';
import { Button, Divider, IconPlus } from '@supabase/ui';
import FilterDropdown from './filter';
import SortDropdown from './sort';
import StatusLabel from './StatusLabel';

type HeaderProps = {
  onAddColumn?: () => void;
  onAddRow?: () => void;
  headerActions?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  onAddColumn,
  onAddRow,
  headerActions,
}) => {
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
        className="sb-grid-header__inner__insert-row"
        style={{ padding: '4px 8px' }}
        icon={<IconPlus size="tiny" />}
        onClick={onAddRow}
      >
        Insert row
      </Button>
    );
  };

  return (
    <div className="sb-grid-header">
      <div className="sb-grid-header__inner">
        <FilterDropdown />
        <SortDropdown />
        <Divider type="vertical" className="sb-grid-header__inner__divider" />
        {renderNewColumn(onAddColumn)}
        {renderAddRow(onAddRow)}
      </div>
      <div className="sb-grid-header__inner">
        {headerActions}
        <StatusLabel />
      </div>
    </div>
  );
};
export default Header;
