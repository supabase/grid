import PQueue from 'p-queue';

export const SupabaseGridQueue = new PQueue({ concurrency: 1 });

export const COLUMN_MIN_WIDTH = 100;

export const STORAGE_KEY_PREFIX = 'supabase_grid';

export const REFRESH_PAGE_IMMEDIATELY = -1;

export const SELECT_COLUMN_KEY = 'supabase-grid-select-row';
export const ADD_COLUMN_KEY = 'supabase-grid-add-column';
