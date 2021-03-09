import * as React from 'react';
import { Typography, Button, IconX } from '@supabase/ui';
import SegmentedControl from './SegmentedControl';
import { useTrackedState } from '../../../store';

type SortRowProps = {
  columnId: string | number;
  order: string;
};

const SortRow: React.FC<SortRowProps> = ({ columnId, order }) => {
  const state = useTrackedState();
  const column = state?.table?.columns.find(x => x.id === columnId);
  if (!column) return null;

  function onToogle(value: string) {
    console.log('select', value);
  }

  return (
    <div className="flex justify-between px-2 py-1">
      <div className="flex items-center">
        <Button
          className="mr-4 p-2"
          icon={<IconX />}
          shadow={false}
          size="tiny"
          type="text"
        />
        <Typography.Text>{column.name}</Typography.Text>
      </div>
      <div className="w-32">
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
