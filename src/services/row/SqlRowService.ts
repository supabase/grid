import { IRowService } from '.';
import { Filter, ServiceError, Sort, SupaRow, SupaTable } from '../../types';
import Query from '../../query';

export class SqlRowService implements IRowService {
  protected query = new Query();

  constructor(
    protected table: SupaTable,
    protected onSqlQuery: (
      query: string
    ) => Promise<{ data?: any; error?: any }>,
    protected onError: (error: any) => void
  ) {}

  async count(filters: Filter[], sorts: Sort[]) {
    // to remove
    console.log('count: ', filters, sorts);

    const query = this.query
      .from(this.table.name, this.table.schema ?? undefined)
      .count()
      .toSql();
    console.log('count query: ', query);
    const { data, error } = await this.onSqlQuery(query);
    if (error) {
      return { error };
    } else {
      if (data?.length == 1) {
        return { data: data[0].count };
      } else {
        return { error: { message: 'fetch rows count failed' } };
      }
    }
  }

  async create(row: SupaRow) {
    console.log('create: ', row);
    return { error: { message: 'Test' } };
  }

  delete(rows: SupaRow[]) {
    console.log('delete: ', rows);

    // const { primaryKeys, error } = this._getPrimaryKeys();
    // if (error) return { error };

    // let query = this.knex(this.table.name);
    // primaryKeys!.forEach((key) => {
    //   const primaryKeyValues = rows.map((x) => x[key]);
    //   query.whereIn(key, primaryKeyValues);
    // });
    // query.del();
    // console.log('delete query: ', query.toSQL());

    return { error: { message: 'Test' } };
  }

  async fetchPage(
    page: number,
    rowsPerPage: number,
    filters: Filter[],
    sorts: Sort[]
  ) {
    // to remove
    console.log('fetchPage', filters, sorts);

    const pageFromZero = page > 0 ? page - 1 : page;
    const from = pageFromZero * rowsPerPage;
    const to = (pageFromZero + 1) * rowsPerPage - 1;
    const query = this.query
      .from(this.table.name, this.table.schema ?? undefined)
      .select()
      .range(from, to)
      .toSql();
    console.log('select query: ', query);
    const { data, error } = await this.onSqlQuery(query);
    if (error) {
      return { error };
    } else {
      const rows = data?.map((x: any, index: number) => {
        return { idx: index, ...x } as SupaRow;
      });
      return { data: { rows, count: rows.length } };
    }
  }

  update(row: SupaRow) {
    console.log('update: ', row);
    return { error: { message: 'Test' } };
  }

  _getPrimaryKeys(): { primaryKeys?: string[]; error?: ServiceError } {
    const pkColumns = this.table.columns.filter((x) => x.isPrimaryKey);
    if (!pkColumns || pkColumns.length == 0) {
      return { error: { message: "Can't find primary key" } };
    }
    return { primaryKeys: pkColumns.map((x) => x.name) };
  }
}
