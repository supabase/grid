import { ident, literal } from '@scaleleap/pg-format';
import { Dictionary, QueryPagination, QueryTable, Sort } from '../types';

export interface IQueryModifier {
  range: (from: number, to: number) => QueryModifier;
  toSql: () => string;
}

export class QueryModifier implements IQueryModifier {
  protected pagination?: QueryPagination;

  constructor(
    protected table: QueryTable,
    protected action: 'count' | 'delete' | 'insert' | 'select' | 'update',
    protected options?: {
      actionValue?: string[] | Dictionary<any> | Dictionary<any>[];
      filters?: { clause: 'match'; value: Dictionary<any> }[];
      orders?: Sort[];
    }
  ) {}

  /**
   * Limits the result to rows within the specified range, inclusive.
   *
   * @param from  The starting index from which to limit the result, inclusive.
   * @param to  The last index to which to limit the result, inclusive.
   */
  range(from: number, to: number) {
    this.pagination = { offset: from, limit: to - from + 1 };
    return this;
  }

  /**
   * Return SQL string for query chains
   */
  toSql() {
    const { actionValue } = this.options ?? {};
    switch (this.action) {
      case 'count': {
        return countQuery(this.table);
      }
      case 'select': {
        return selectQuery(this.table, {
          columns: actionValue as any,
          pagination: this.pagination,
        });
      }
      default: {
        return '';
      }
    }
  }
}

function countQuery(
  table: QueryTable,
  options?: {
    sorts?: Sort[];
  }
) {
  console.log('countQuery options: ', options);
  let query = 'select count(*)';
  query += ` from ${ident(table.schema)}.${ident(table.name)}`;
  return query;
}

function selectQuery(
  table: QueryTable,
  options?: {
    columns?: string[];
    pagination?: QueryPagination;
    sorts?: Sort[];
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
