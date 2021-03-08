import * as React from 'react';
import { Dropdown, Button } from '@supabase/ui';
import Filter from './filter';
import Sort from './sort';
import StatusLabel from './StatusLabel';
import styles from './header.module.css';

type HeaderProps = {};

const Header: React.FunctionComponent<HeaderProps> = ({}) => {
  return (
    <div className={styles.gridHeader}>
      <div className={styles.gridHeaderLeft}>
        <Dropdown placement="bottomLeft" overlay={<Filter />}>
          <Button style={{ marginRight: '10px' }} type="outline">
            Filter 1
          </Button>
        </Dropdown>
        <Dropdown
          placement="bottomLeft"
          overlay={<Sort />}
          style={{ width: '20rem' }}
        >
          <Button type="outline">Sort 1</Button>
        </Dropdown>
      </div>
      <div className={styles.gridHeaderRight}>
        <StatusLabel />
      </div>
    </div>
  );
};
export default Header;
