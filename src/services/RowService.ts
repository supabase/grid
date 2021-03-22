import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseGridQueue } from '../constants';
import { Filter, Sort, SupaRow, SupaTable } from '../types';

class RowService {
  constructor(protected table: SupaTable, protected client: SupabaseClient) {}

  fetchAll() {
    return this.client.from(this.table.name).select();
  }

  fetchPage(
    page: number,
    rowsPerPage: number,
    filters: Filter[],
    sorts: Sort[]
  ) {
    const pageFromZero = page > 0 ? page - 1 : page;
    const from = pageFromZero * rowsPerPage;
    const to = (pageFromZero + 1) * rowsPerPage - 1;
    let request = this.client
      .from(this.table.name)
      .select('*', { count: 'exact' })
      .range(from, to);

    // Filter first
    // TODO: need to support filter.clause
    for (let idx in filters) {
      const filter = filters[idx];
      if (filter.filterText == '') continue;
      const column = this.table.columns.find(x => x.name === filter.columnName);
      if (!column) continue;

      const columnName = column.name;
      switch (filter.condition) {
        case 'is':
          const filterText = filter.filterText.toLowerCase();
          if (filterText == 'null') request = request.is(columnName, null);
          else if (filterText == 'true') request = request.is(columnName, true);
          else if (filterText == 'false')
            request = request.is(columnName, false);
          break;
        case 'in':
          const filterValues = filter.filterText.split(',').map(x => x.trim());
          request = request.in(columnName, filterValues);
          break;
        default:
          request = request.filter(
            columnName,
            // @ts-ignore
            filter.condition.toLowerCase(),
            filter.filterText
          );
          break;
      }
    }
    // Then sort
    for (let idx in sorts) {
      const sort = sorts[idx];
      const column = this.table.columns.find(x => x.name === sort.columnName);
      if (!column) continue;

      const columnName = column.name;
      const sortAsc = sort.order.toLowerCase() === 'asc';
      request = request.order(columnName, { ascending: sortAsc });
    }

    return request;
  }

  create(row: SupaRow) {
    const { idx, ...value } = row;
    SupabaseGridQueue.add(async () => {
      const res = await this.client.from(this.table.name).insert(value);
      console.log('insert row', res);
      // TODO: how to handle error
      // if (res.error)
    });
  }

  update(row: SupaRow): { error?: string } {
    const { primaryKey, error } = this._getPrimaryKey();
    if (error) return { error };

    const { idx, ...value } = row;
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
  delete(rows: SupaRow[]): { error?: string } {
    const { primaryKey, error } = this._getPrimaryKey();
    if (error || !primaryKey) return { error };

    const primaryKeyValues = rows.map(x => x[primaryKey]);
    SupabaseGridQueue.add(async () => {
      const res = await this.client
        .from(this.table.name)
        .delete()
        .in(primaryKey!, primaryKeyValues);
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
