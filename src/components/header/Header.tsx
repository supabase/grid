import * as React from 'react';
import FilterDropdown from './filter';
import SortDropdown from './sort';
import StatusLabel from './StatusLabel';
import Pagination from './pagination';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className="flex justify-between h-10 z-10 px-2 bg-gray-800">
      <div className="flex items-center">
        <FilterDropdown />
        <SortDropdown />
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
