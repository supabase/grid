import * as React from 'react';
import { SupabaseGridQueue } from '../../constants';

type StatusLabelProps = {};

const StatusLabel: React.FC<StatusLabelProps> = ({}) => {
  const [msg, setMsg] = React.useState<string | undefined>(undefined);
  let timer = React.useRef<NodeJS.Timeout | null>(null);

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
    timer.current = setTimeout(() => setMsg(undefined), 2000);
    console.log(
      `Queue is idle.  Size: ${SupabaseGridQueue.size}  Pending: ${SupabaseGridQueue.pending}`
    );
  });

  return (
    <div className="fixed right-2 text-white text-sm">
      {msg && (
        <div className="flex justify-center">
          <label className="">{msg}</label>
        </div>
      )}
      {!msg && (
        <div className="flex w-5 h-5">
          <div className="m-auto w-2 h-2 rounded-full bg-green-500" />
        </div>
      )}
    </div>
  );
};
export default StatusLabel;
