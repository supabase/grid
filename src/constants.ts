import PQueue from 'p-queue';

export const SupabaseGridQueue = new PQueue({ concurrency: 1 });

export const STORAGE_KEY_PREFIX = 'supabase_grid';

export const REFRESH_PAGE_IMMEDIATELY = -1;
