import BaseReducer, { BaseInitialState, baseInitialState } from './base';
import RowReducer, { RowInitialState, rowInitialState } from './rows';
import SortReducer, { SortInitialState, sortInitialState } from './sort';
import FilterReducer, {
  FilterInitialState,
  filterInitialState,
} from './filter';

export interface InitialStateType
  extends BaseInitialState,
    FilterInitialState,
    RowInitialState,
    SortInitialState {}

export const initialState = {
  ...baseInitialState,
  ...filterInitialState,
  ...rowInitialState,
  ...sortInitialState,
};

export { BaseReducer, FilterReducer, RowReducer, SortReducer };
