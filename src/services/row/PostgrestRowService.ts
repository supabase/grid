import { SupabaseClient } from '@supabase/supabase-js';
import { IRowService } from '.';
import { SupabaseGridQueue } from '../../constants';
import { Filter, ServiceError, Sort, SupaRow, SupaTable } from '../../types';

export class PostgrestRowService implements IRowService {
  constructor(
    protected table: SupaTable,
    protected client: SupabaseClient,
    protected onError: (error: any) => void
  ) {}

  async fetchPage(
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

    const { count, data, error } = await request;
    if (!data || error) {
      return {
        error: { message: error?.message ?? 'rows data is undefined' },
      };
    } else {
      const rows = data?.map((x, index) => {
        return { idx: index, ...x } as SupaRow;
      });
      return { data: { rows, count: count ?? undefined } };
    }
  }

  async create(row: SupaRow) {
    const { idx, ...value } = row;
    const { data: newRow, error } = await this.client
      .from(this.table.name)
      .insert(value);
    if (!newRow || error) {
      return {
        error: { message: error?.message ?? 'new row data is undefined' },
      };
    } else {
      const temp = { idx, ...newRow } as SupaRow;
      return { data: temp };
    }
  }

  update(row: SupaRow) {
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

  delete(rows: SupaRow[]) {
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

  _getPrimaryKeys(): { primaryKeys?: string[]; error?: ServiceError } {
    const pkColumns = this.table.columns.filter(x => x.isPrimaryKey);
    if (!pkColumns || pkColumns.length == 0) {
      return { error: { message: "Can't find primary key" } };
    }
    return { primaryKeys: pkColumns.map(x => x.name) };
  }
}
