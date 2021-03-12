import PQueue from 'p-queue';

export const SupabaseGridQueue = new PQueue({ concurrency: 1 });

export const STORAGE_KEY = 'supabase_grid_state';

export const REFRESH_PAGE_IMMEDIATELY = -1;
