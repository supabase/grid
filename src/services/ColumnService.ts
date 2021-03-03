import { SupabaseClient } from '@supabase/supabase-js';

class ColumnService {
  constructor(protected client: SupabaseClient) {
    if (!client) throw new Error('Supabase client is required.');
  }

  fetchAll() {}
  create() {}
  get() {}
  update() {}
  delete() {}
}
