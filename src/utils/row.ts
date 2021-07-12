import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { InitialStateType } from '../store/reducers';

export async function fetchPage(
  state: InitialStateType,
  dispatch: (value: unknown) => void
) {
  const res = await state.rowService!.fetchPage(
    state.page,
    state.rowsPerPage,
    state.filters,
    state.sorts
  );
  if (res.error) {
    // TODO: handle fetch rows data error
  } else {
    const rows = res.data?.map((x, index) => {
      return { idx: index, ...x };
    });
    dispatch({
      type: 'SET_ROWS',
      payload: { rows: rows || [], totalRows: res.count },
    });
  }
}
export const refreshPageDebounced = AwesomeDebouncePromise(fetchPage, 500);
