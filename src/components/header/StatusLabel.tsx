import * as React from 'react';
import { SupabaseGridQueue } from '../../constants';

type StatusLabelProps = {};

const StatusLabel: React.FC<StatusLabelProps> = ({}) => {
  const [msg, setMsg] = React.useState<string | undefined>(undefined);
  let timer = React.useRef<number | null>(null);

  SupabaseGridQueue.on('add', () => {
    console.log(
      `Task is added.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });

  SupabaseGridQueue.on('active', () => {
    if (timer && timer.current) clearTimeout(timer.current!);
    setMsg('Saving...');
    console.log(
      `Queue is active.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });
  SupabaseGridQueue.on('idle', () => {
    setMsg('All changes saved');
    timer.current = window.setTimeout(() => setMsg(undefined), 2000);
    console.log(
      `Queue is idle.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });

  return (
    <div className="grid-text-white grid-text-sm">
      {msg && <span className="">{msg}</span>}
      {!msg && (
        <div className="grid-flex grid-w-5 grid-h-5">
          <div className="grid-m-auto grid-w-2 grid-h-2 grid-rounded-full grid-bg-green-500" />
        </div>
      )}
    </div>
  );
};
export default StatusLabel;
