import BaseReducer, { BaseInitialState, baseInitialState } from './base';
import ColumnReducer, {
  ColumnInitialState,
  columnInitialState,
} from './column';
import RowReducer, { RowInitialState, rowInitialState } from './row';
import SortReducer, { SortInitialState, sortInitialState } from './sort';
import FilterReducer, {
  FilterInitialState,
  filterInitialState,
} from './filter';

export interface InitialStateType
  extends BaseInitialState,
    ColumnInitialState,
    FilterInitialState,
    RowInitialState,
    SortInitialState {}

export const initialState = {
  ...baseInitialState,
  ...columnInitialState,
  ...filterInitialState,
  ...rowInitialState,
  ...sortInitialState,
};

export { BaseReducer, ColumnReducer, FilterReducer, RowReducer, SortReducer };
