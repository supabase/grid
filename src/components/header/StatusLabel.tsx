import * as React from 'react';
import { SupabaseGridQueue } from '../../constants';
import { Typography } from '@supabase/ui';

type StatusLabelProps = {};

const StatusLabel: React.FC<StatusLabelProps> = ({}) => {
  const [msg, setMsg] = React.useState<string | undefined>(undefined);
  let timer = React.useRef<number | null>(null);

  SupabaseGridQueue.on('active', () => {
    if (timer && timer.current) clearTimeout(timer.current!);
    setMsg('Saving...');
  });
  SupabaseGridQueue.on('idle', () => {
    setMsg('All changes saved');
    timer.current = window.setTimeout(() => setMsg(undefined), 2000);
  });

  return (
    <div className="sb-grid-status-label">
      {msg && <Typography.Text>{msg}</Typography.Text>}
      {!msg && (
        <div className="sb-grid-status-label__no-msg">
          <div></div>
        </div>
      )}
    </div>
  );
};
export default StatusLabel;
