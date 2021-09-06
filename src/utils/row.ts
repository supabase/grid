import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { InitialStateType } from '../store/reducers';

export async function fetchPage(
  state: InitialStateType,
  dispatch: (value: unknown) => void
) {
  const { data, error } = await state.rowService!.fetchPage(
    state.page,
    state.rowsPerPage,
    state.filters,
    state.sorts
  );
  if (error) {
    // TODO: handle fetch rows data error
  } else {
    dispatch({
      type: 'SET_ROWS',
      payload: { rows: data?.rows ?? [], totalRows: data?.count },
    });
  }
}
export const refreshPageDebounced = AwesomeDebouncePromise(fetchPage, 500);
