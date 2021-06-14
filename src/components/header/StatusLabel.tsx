import * as React from 'react';
import { SupabaseGridQueue } from '../../constants';
import { Typography } from '@supabase/ui';

type StatusLabelProps = {};

const StatusLabel: React.FC<StatusLabelProps> = ({}) => {
  const [msg, setMsg] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let isMounted = true;
    let timer = window.setTimeout(() => setMsg(undefined), 2000);

    SupabaseGridQueue.on('active', () => {
      if (timer) clearTimeout(timer);

      if (isMounted) setMsg('Saving...');
    });
    SupabaseGridQueue.on('idle', () => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => setMsg(undefined), 2000);

      if (isMounted) setMsg('All changes saved');
    });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="text-white text-sm">
      {msg && <Typography.Text>{msg}</Typography.Text>}
      {!msg && (
        <div className="flex w-5 h-5">
          <div className="m-auto w-2 h-2 rounded-full bg-green-500" />
        </div>
      )}
    </div>
  );
};
export default StatusLabel;
