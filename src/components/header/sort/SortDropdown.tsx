import * as React from 'react';
import { Dropdown, Button } from '@supabase/ui';
import SortRow from './SortRow';
import ColumnDropdown from './ColumnDropdown';

type SortDropdownProps = {};

const SortDropdown: React.FC<SortDropdownProps> = p => {
  return (
    <Dropdown
      className="w-80 overflow-visible"
      placement="bottomLeft"
      overlay={<Sort {...p} />}
    >
      <Button type="secondary">Sort 1</Button>
    </Dropdown>
  );
};
export default SortDropdown;

const Sort: React.FC<SortDropdownProps> = ({}) => {
  return (
    <>
      <div>
        <SortRow columnId="16525.1" order="desc" />
        <SortRow columnId="16525.3" order="desc" />
        <SortRow columnId="16525.4" order="asc" />
      </div>
      <div className="m-2">
        <ColumnDropdown />
      </div>
    </>
  );
};
