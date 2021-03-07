import * as React from 'react';
import PQueue from 'p-queue';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupaTable } from './types';

export type SupabaseGridContextType = {
  client: SupabaseClient;
  table: SupaTable | undefined;
};

export const SupabaseGridCtx = React.createContext<SupabaseGridContextType | null>(
  null
);

export const SupabaseGridQueue = new PQueue({ concurrency: 1 });
