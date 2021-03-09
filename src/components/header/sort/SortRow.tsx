import * as React from 'react';
import {
  Typography,
  Button,
  IconXSquare,
  IconAlignJustify,
} from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../../store';
import { SegmentedControl } from '../../common';
import { constrainDragAxis } from '../../../utils';

type SortRowProps = {
  columnId: string | number;
  provided: any;
};

const SortRow: React.FC<SortRowProps> = ({ columnId, provided }) => {
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
    <div
      className="flex justify-between py-1"
      {...provided.draggableProps}
      ref={provided.innerRef}
      style={constrainDragAxis(provided.draggableProps.style, 'y')}
    >
      <div className="flex items-center">
        <Button
          className="mr-4 p-2"
          icon={<IconXSquare />}
          shadow={false}
          size="tiny"
          type="text"
          onClick={onDeleteClick}
        />
        <Typography.Text>{column.name}</Typography.Text>
      </div>
      <div className="flex items-center w-32">
        <SegmentedControl
          options={['ASC', 'DESC']}
          value={sort.order}
          onToggle={onToogle}
        />
        <div className="ml-5" {...provided.dragHandleProps}>
          <IconAlignJustify />
        </div>
      </div>
    </div>
  );
};
export default SortRow;
