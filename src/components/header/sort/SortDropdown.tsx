import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dropdown, Button, Typography } from '@supabase/ui';
import { ColumnDropdown } from '../../common';
import { useDispatch, useTrackedState } from '../../../store';
import SortRow from './SortRow';

type SortDropdownProps = {};

const SortDropdown: React.FC<SortDropdownProps> = p => {
  const state = useTrackedState();
  const btnText =
    state.sorts.length > 0 ? `Sort ${state.sorts.length}` : 'Sort';

  return (
    <Dropdown
      className="w-80 overflow-visible"
      placement="bottomLeft"
      overlay={<Sort {...p} />}
    >
      <Button type="secondary">{btnText}</Button>
    </Dropdown>
  );
};
export default SortDropdown;

const Sort: React.FC<SortDropdownProps> = ({}) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const columns = state?.table?.columns!.filter(x => {
    const found = state.sorts.find(y => y.columnId == x.id);
    return !found;
  });

  function onAddSort(columnId: string | number) {
    dispatch({
      type: 'ADD_SORT',
      payload: { columnId, order: 'ASC' },
    });
  }

  function onDragEnd(result: any) {
    const { source: from, destination: to } = result;
    if (!to) return;
    if (to.droppableId === from.droppablesId && to.index === from.index) return;
    dispatch({
      type: 'MOVE_SORT',
      payload: { fromIndex: from.index, toIndex: to.index },
    });
  }

  return (
    <div className="p-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sort_rows">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {state.sorts.map((x, index) => (
                <Draggable
                  key={`drop_${x.columnId}`}
                  draggableId={`sort_row_${x.columnId}`}
                  index={index}
                >
                  {provided => (
                    <SortRow
                      key={x.columnId}
                      provided={provided}
                      columnId={x.columnId}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {state.sorts.length == 0 && (
        <div>
          <Typography.Text>No sorts applied</Typography.Text>
        </div>
      )}
      <div className="mt-2">
        <ColumnDropdown
          btnText="Pick another column to sort by"
          columns={columns || []}
          onClick={onAddSort}
        />
      </div>
    </div>
  );
};
