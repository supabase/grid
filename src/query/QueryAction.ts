import { Dictionary, QueryTable } from '../types';
import { IQueryFilter, QueryFilter } from './QueryFilter';

export interface IQueryAction {
  count: () => IQueryFilter;
  delete: (options?: { returning: boolean }) => IQueryFilter;
  insert: (
    values: Dictionary<any> | Dictionary<any>[],
    options?: { returning: boolean }
  ) => IQueryFilter;
  select: (columns?: string[]) => IQueryFilter;
  update: (
    value: Dictionary<any>,
    options?: { returning: boolean }
  ) => IQueryFilter;
}

export class QueryAction implements IQueryAction {
  constructor(protected table: QueryTable) {}

  count() {
    return new QueryFilter(this.table, 'count');
  }

  delete(options?: { returning: boolean }) {
    return new QueryFilter(this.table, 'delete', undefined, options);
  }

  insert(
    values: Dictionary<any> | Dictionary<any>[],
    options?: { returning: boolean }
  ) {
    return new QueryFilter(this.table, 'insert', values, options);
  }

  /**
   * @param columns the query columns, by default set to '*'.
   */
  select(columns?: string[]) {
    return new QueryFilter(this.table, 'select', columns);
  }

  update(value: Dictionary<any>, options?: { returning: boolean }) {
    return new QueryFilter(this.table, 'update', value, options);
  }
}
