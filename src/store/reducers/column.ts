import { Column } from 'react-data-grid';
import { getGridColumns } from '../../utils';
import { INIT_ACTIONTYPE } from './base';

export interface ColumnInitialState {
  gridColumns: Column<any, any>[];
}

export const columnInitialState: ColumnInitialState = {
  gridColumns: [],
};

type COLUMN_ACTIONTYPE = INIT_ACTIONTYPE;

const ColumnReducer = (
  state: ColumnInitialState,
  action: COLUMN_ACTIONTYPE
) => {
  switch (action.type) {
    case 'INIT_TABLE': {
      return {
        ...state,
        gridColumns: getGridColumns(action.payload.table, {
          defaultWidth: action.payload.gridProps?.defaultColumnWidth,
        }),
      };
    }
    default:
      return state;
  }
};

export default ColumnReducer;
