import * as React from 'react';
import { Typography, Button, IconX } from '@supabase/ui';
import SegmentedControl from './SegmentedControl';
import styles from './sort.module.css';
import { SupabaseGridCtx } from '../../../constants';

type SortRowProps = {
  columnId: string | number;
  order: string;
};

const SortRow: React.FunctionComponent<SortRowProps> = ({
  columnId,
  order,
}) => {
  const ctx = React.useContext(SupabaseGridCtx);
  const column = ctx?.table?.columns.find(x => x.id === columnId);
  if (!column) return null;

  function onToogle(value: string) {
    console.log('select', value);
  }

  return (
    <div className={styles.sortRow}>
      <div className={styles.sortRowLeft}>
        <Button
          icon={<IconX />}
          shadow={false}
          size="tiny"
          type="text"
          style={{ padding: '4px', marginRight: '1rem' }}
        />
        <Typography.Text>{column.name}</Typography.Text>
      </div>
      <div className={styles.sortRowRight}>
        <SegmentedControl
          options={['ASC', 'DESC']}
          defaultValue={order}
          onToggle={onToogle}
        />
      </div>
    </div>
  );
};
export default SortRow;
