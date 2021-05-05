import * as React from 'react';
import Pagination from './pagination';

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="grid-flex grid-justify-between grid-h-10 grid-z-10 grid-px-2 grid-bg-gray-700">
      <div className="grid-flex grid-items-center">
        <Pagination />
      </div>
    </div>
  );
};
export default Footer;
