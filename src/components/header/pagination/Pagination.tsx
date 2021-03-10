import * as React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {
  Button,
  Input,
  Typography,
  IconArrowRight,
  IconArrowLeft,
} from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../../store';

const updatePage = (payload: number, dispatch: (value: unknown) => void) => {
  console.log('updatePage updatePage updatePage');
  dispatch({
    type: 'UPDATE_PAGE',
    payload: payload,
  });
};
const updatePageDebounced = AwesomeDebouncePromise(updatePage, 550);

type PaginationProps = {};

const Pagination: React.FC<PaginationProps> = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(state.page);
  const maxPages = Math.ceil(state.totalRows / state.rowsPerPage);
  const totalPages = state.totalRows > 0 ? maxPages : 1;

  function onPreviousPage() {
    if (state.page > 1) {
      const previousPage = state.page - 1;
      setPage(previousPage);
      dispatch({ type: 'UPDATE_PAGE', payload: previousPage });
    }
  }

  function onNextPage() {
    if (state.page < maxPages) {
      const nextPage = state.page + 1;
      setPage(nextPage);
      dispatch({ type: 'UPDATE_PAGE', payload: nextPage });
    }
  }

  function onPageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const pageNum = Number(value);
    setPage(pageNum);
    updatePageDebounced(pageNum, dispatch);
  }

  return (
    <div className="flex items-center ml-8">
      <Button
        icon={<IconArrowLeft />}
        type="secondary"
        disabled={state.page <= 1}
        onClick={onPreviousPage}
      />
      <Typography.Text className="mx-2">Page</Typography.Text>
      <div className="w-16">
        <Input
          value={page}
          onChange={onPageChange}
          className="block"
          size="tiny"
          style={{ width: '4rem' }}
          type="number"
        />
      </div>
      <Typography.Text className="mx-2">{`of ${totalPages}`}</Typography.Text>
      <Button
        icon={<IconArrowRight />}
        type="secondary"
        disabled={state.page >= maxPages}
        onClick={onNextPage}
      />
    </div>
  );
};
export default Pagination;
