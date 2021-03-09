import * as React from 'react';
import { Typography, Button, IconX } from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../../store';
import { SegmentedControl } from '../../common';

type SortRowProps = {
  columnId: string | number;
};

const SortRow: React.FC<SortRowProps> = ({ columnId }) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const column = state?.table?.columns.find(x => x.id === columnId);
  const sort = state?.sorts.find(x => x.columnId === columnId);
  if (!column || !sort) return null;

  function onToogle(value: string) {
    dispatch({
      type: 'UPDATE_SORT',
      payload: { columnId, order: value },
    });
  }

  function onDeleteClick() {
    dispatch({
      type: 'REMOVE_SORT',
      payload: columnId,
    });
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
          onClick={onDeleteClick}
        />
        <Typography.Text>{column.name}</Typography.Text>
      </div>
      <div className="w-32">
        <SegmentedControl
          options={['ASC', 'DESC']}
          value={sort.order}
          onToggle={onToogle}
        />
      </div>
    </div>
  );
};
export default React.memo(SortRow);
