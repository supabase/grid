import { Dictionary, QueryTable } from '../types';
import { IQueryFilter, QueryFilter } from './QueryFilter';

export interface IQueryAction {
  count: () => IQueryFilter;
  delete: () => IQueryFilter;
  insert: (values: Dictionary<any> | Dictionary<any>[]) => IQueryFilter;
  select: (columns?: string[]) => IQueryFilter;
  update: (value: Dictionary<any>) => IQueryFilter;
}

export class QueryAction implements IQueryAction {
  constructor(protected table: QueryTable) {}

  count() {
    return new QueryFilter(this.table, 'delete');
  }

  delete() {
    return new QueryFilter(this.table, 'delete');
  }

  insert(values: Dictionary<any> | Dictionary<any>[]) {
    return new QueryFilter(this.table, 'insert', values);
  }

  select(columns?: string[]) {
    return new QueryFilter(this.table, 'select', columns);
  }

  update(value: Dictionary<any>) {
    return new QueryFilter(this.table, 'update', value);
  }
}
