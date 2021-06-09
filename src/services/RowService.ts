import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseGridQueue } from '../constants';
import { Filter, Sort, SupaRow, SupaTable } from '../types';

class RowService {
  constructor(
    protected table: SupaTable,
    protected client: SupabaseClient,
    protected onError: (error: any) => void
  ) {}

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
      .select('*', { count: 'estimated' })
      .range(from, to);

    // Filter first
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
      if (res.error) throw res.error;
    }).catch(error => {
      this.onError(error);
    });
  }

  update(row: SupaRow): { error?: string } {
    const { primaryKeys, error } = this._getPrimaryKeys();
    if (error) {
      return { error };
    }

    const { idx, ...value } = row;
    const matchValues: any = {};
    primaryKeys!.forEach(key => {
      matchValues[key] = row[key];
    });

    SupabaseGridQueue.add(async () => {
      const res = await this.client
        .from(this.table.name)
        .update(value)
        .match(matchValues);
      if (res.error) throw res.error;
    }).catch(error => {
      this.onError(error);
    });

    return {};
  }

  delete(rows: SupaRow[]): { error?: string } {
    const { primaryKeys, error } = this._getPrimaryKeys();
    if (error) return { error };

    SupabaseGridQueue.add(async () => {
      const request = this.client.from(this.table.name).delete();
      primaryKeys!.forEach(key => {
        const primaryKeyValues = rows.map(x => x[key]);
        request.in(key, primaryKeyValues);
      });

      const res = await request;
      if (res.error) throw res.error;
    }).catch(error => {
      this.onError(error);
    });

    return {};
  }

  _getPrimaryKeys(): { primaryKeys?: string[]; error?: string } {
    const pkColumns = this.table.columns.filter(x => x.isPrimaryKey);
    if (!pkColumns || pkColumns.length == 0) {
      return { error: "Can't find primary key" };
    }
    return { primaryKeys: pkColumns.map(x => x.name) };
  }
}
export default RowService;
