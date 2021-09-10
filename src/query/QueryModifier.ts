import {
  Dictionary,
  Filter2,
  QueryPagination,
  QueryTable,
  Sort,
} from '../types';
import { countQuery, selectQuery } from './Query.utils';

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
      filters?: Filter2[];
      sorts?: Sort[];
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
    const { actionValue, filters, sorts } = this.options ?? {};
    switch (this.action) {
      case 'count': {
        return countQuery(this.table, { filters });
      }
      case 'select': {
        return selectQuery(this.table, {
          columns: actionValue as any,
          pagination: this.pagination,
          filters,
          sorts,
        });
      }
      case 'update': {
      }
      default: {
        return '';
      }
    }
  }
}
