import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseGridQueue } from '../constants';
import { Dictionary, SupaTable } from '../types';

class RowService {
  constructor(protected table: SupaTable, protected client: SupabaseClient) {
    if (!table) throw new Error('Table definition is required.');
    if (!client) throw new Error('Supabase client is required.');
  }

  fetchAll() {
    return this.client.from(this.table.name).select();
  }
  create() {}
  update(value: Dictionary<any>): { error?: string } {
    const { primaryKey, error } = this._getPrimaryKey();
    if (error) return { error };

    SupabaseGridQueue.add(async () => {
      const res = await this.client
        .from(this.table.name)
        .update(value)
        .match({ [primaryKey!]: value[primaryKey!] });
      console.log('update row', res);
      // TODO: how to handle error
      // if (res.error)
    });

    return {};
  }
  delete(rowIds: number[] | string[]): { error?: string } {
    const { primaryKey, error } = this._getPrimaryKey();
    if (error) return { error };

    SupabaseGridQueue.add(async () => {
      const res = await this.client
        .from(this.table.name)
        .delete()
        .in(primaryKey!, rowIds);
      console.log('delete row', res);
      // TODO: how to handle error
      // if (res.error)
    });

    return {};
  }

  _getPrimaryKey(): { primaryKey?: string; error?: string } {
    // find primary key
    const primaryKeys = this.table.columns.filter(x => x.isIdentity);
    if (!primaryKeys || primaryKeys.length == 0)
      return { error: "Can't find primary key" };
    else if (primaryKeys.length > 1)
      return { error: 'Not support multi primary keys' };
    return { primaryKey: primaryKeys[0].name };
  }
}
export default RowService;
