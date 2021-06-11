import * as React from 'react';
import { FormatterProps } from '@w3b6x9/react-data-grid-w3b6x9';
import { SupaRow } from '../../types';
import { NullValue } from '../common';
import { ForeignTableModal } from '../common/ForeignTableModal';
import { useDispatch, useTrackedState } from '../../store';
import { deepClone } from '../../utils';

export const ForeignKeyFormatter = (
  p: React.PropsWithChildren<FormatterProps<SupaRow, unknown>>
) => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const value = p.row[p.column.key];

  function onRowChange(_value: any | null) {
    const rowData = deepClone(p.row);
    rowData[p.column.key] = _value;

    const { error } = state.rowService!.update(rowData);
    if (error) {
      if (state.onError) state.onError(error);
    } else {
      dispatch({
        type: 'EDIT_ROW',
        payload: { row: rowData, idx: p.rowIdx },
      });
    }
  }

  function onChange(_value: any | null) {
    onRowChange(_value);
  }

  return (
    <div className="flex items-center px-2">
      <p className="m-0 flex-grow text-sm overflow-hidden overflow-ellipsis">
        {value === null ? <NullValue /> : value}
      </p>
      <ForeignTableModal
        columnName={p.column.key}
        defaultValue={value}
        onChange={onChange}
      />
    </div>
  );
};
