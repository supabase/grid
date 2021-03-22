import { SupabaseClient } from '@supabase/supabase-js';

class TableService {
  constructor(protected client: SupabaseClient) {}

  fetchInfo(name: string, schema?: string) {
    return this.client.rpc('load_table_info', {
      filter_schema: schema || 'public',
      filter_name: name,
    });
  }
  fetchColumnsInfo(name: string, schema?: string) {
    return this.client.rpc('load_table_columns', {
      filter_schema: schema || 'public',
      filter_name: name,
    });
  }
  create() {}
  get() {}
  update() {}
  delete() {}
}
export default TableService;
