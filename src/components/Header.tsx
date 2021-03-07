import * as React from 'react';
import { SupabaseGridQueue } from '../constants';
import styles from '../style.module.css';

type HeaderProps = {};

const Header: React.FunctionComponent<HeaderProps> = ({}) => {
  const [msg, setMsg] = React.useState('idel');
  let timer = React.useRef<NodeJS.Timeout | null>(null);

  SupabaseGridQueue.on('add', () => {
    console.log(
      `Task is added.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });

  SupabaseGridQueue.on('active', () => {
    if (timer && timer.current) clearTimeout(timer.current!);
    setMsg('Saving ...');
    console.log(
      `Queue is active.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });
  SupabaseGridQueue.on('idle', () => {
    setMsg('All changes saved');
    timer.current = setTimeout(() => setMsg('idel'), 3000);
    console.log(
      `Queue is idle.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });

  return (
    <div className={styles.gridHeader}>
      <div className={styles.gridHeaderState}>
        <label>{msg}</label>
      </div>
    </div>
  );
};
export default Header;
