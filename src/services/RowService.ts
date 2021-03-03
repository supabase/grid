import { SupabaseClient } from '@supabase/supabase-js';

class RowService {
  constructor(protected client: SupabaseClient) {
    if (!client) throw new Error('Supabase client is required.');
  }

  fetchAll(tableName: string) {
    return this.client.from(tableName).select();
  }
  create() {}
  update() {}
  delete() {}
}
