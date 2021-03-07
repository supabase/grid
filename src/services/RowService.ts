import { SupabaseClient } from '@supabase/supabase-js';
import { Dictionary } from '../types';

class RowService {
  constructor(protected client: SupabaseClient) {
    if (!client) throw new Error('Supabase client is required.');
  }

  fetchAll(tableName: string) {
    return this.client.from(tableName).select();
  }
  create() {}
  update(table: string, primaryKey: string, value: Dictionary<any>) {
    return this.client
      .from(table)
      .update(value)
      .match({ [primaryKey]: value[primaryKey] });
  }
  delete(table: string, primaryKey: string, rowIds: number[] | string[]) {
    return this.client
      .from(table)
      .delete()
      .in(primaryKey, rowIds);
  }
}
export default RowService;
