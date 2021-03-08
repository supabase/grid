import * as React from 'react';
import { Dropdown, Button } from '@supabase/ui';
import Filter from './filter';
import SortDropdown from './sort';
import StatusLabel from './StatusLabel';

type HeaderProps = {};

const Header: React.FunctionComponent<HeaderProps> = ({}) => {
  return (
    <div className="flex justify-between h-10 z-10 px-2 bg-gray-800">
      <div className="flex items-center">
        <Dropdown placement="bottomLeft" overlay={<Filter />}>
          <Button style={{ marginRight: '10px' }} type="outline">
            Filter 1
          </Button>
        </Dropdown>
        <SortDropdown />
      </div>
      <div className="flex items-center">
        <StatusLabel />
      </div>
    </div>
  );
};
export default Header;
