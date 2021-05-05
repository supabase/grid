import * as React from 'react';
import Pagination from './pagination';

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="flex justify-between h-10 z-10 px-2 bg-gray-700">
      <div className="flex items-center">
        <Pagination />
      </div>
    </div>
  );
};
export default Footer;
