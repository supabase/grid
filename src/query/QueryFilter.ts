import { ident, literal } from '@scaleleap/pg-format';
import { Dictionary, QueryPagination, QueryTable } from '../types';

export interface IQueryFilter {
  match: (criteria: Dictionary<any>) => IQueryFilter;
  toSql: (pagination?: QueryPagination) => string;
}

export class QueryFilter implements IQueryFilter {
  protected filters: { clause: 'match'; value: Dictionary<any> }[] = [];

  constructor(
    protected table: QueryTable,
    protected action: 'count' | 'delete' | 'insert' | 'select' | 'update',
    protected actionValue?: string[] | Dictionary<any> | Dictionary<any>[]
  ) {}

  match(criteria: Dictionary<any>) {
    this.filters.push({ clause: 'match', value: criteria });
    return this;
  }

  toSql(pagination?: QueryPagination) {
    switch (this.action) {
      case 'select': {
        return selectQuery(this.table, {
          columns: this.actionValue as string[],
          pagination,
        });
      }
      default: {
        return '';
      }
    }
  }
}

function selectQuery(
  table: QueryTable,
  options?: {
    columns?: string[];
    pagination?: QueryPagination;
  }
) {
  let query = '';
  const { columns, pagination } = options ?? {};
  query += `select ${
    columns?.map((x) => ident(x)).join(',') ?? '*'
  } from ${ident(table.schema)}.${ident(table.name)}`;
  if (pagination) {
    const { limit, offset } = pagination ?? {};
    query += ` limit ${literal(limit)} offset ${literal(offset)}`;
  }
  return query;
}
