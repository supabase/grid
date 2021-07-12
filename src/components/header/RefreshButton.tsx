import * as React from 'react';
import { Button, IconRefreshCw } from '@supabase/ui';
import { useDispatch, useTrackedState } from '../../store';
import { fetchPage } from '../../utils';

type RefreshButtonProps = {};

const RefreshButton: React.FC<RefreshButtonProps> = ({}) => {
  const [loading, setLoading] = React.useState(false);
  const state = useTrackedState();
  const dispatch = useDispatch();

  async function onClick() {
    setLoading(true);
    await fetchPage(state, dispatch);
    setLoading(false);
  }

  return (
    <Button
      type="text"
      icon={<IconRefreshCw />}
      onClick={onClick}
      loading={loading}
      style={{ paddingLeft: 4, paddingRight: 4 }}
    >
      Refresh
    </Button>
  );
};
export default RefreshButton;
