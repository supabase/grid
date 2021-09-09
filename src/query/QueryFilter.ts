import { Dictionary, QueryTable, Sort } from '../types';
import { IQueryModifier, QueryModifier } from './QueryModifier';

export interface IQueryFilter {
  match: (criteria: Dictionary<any>) => IQueryFilter;
  order: (
    column: string,
    ascending?: boolean,
    nullsFirst?: boolean
  ) => IQueryFilter;
}

export class QueryFilter implements IQueryFilter, IQueryModifier {
  protected filters: { clause: 'match'; value: Dictionary<any> }[] = [];
  protected sorts: Sort[] = [];

  constructor(
    protected table: QueryTable,
    protected action: 'count' | 'delete' | 'insert' | 'select' | 'update',
    protected actionValue?: string[] | Dictionary<any> | Dictionary<any>[]
  ) {}

  order(column: string, ascending = true, nullsFirst = false) {
    this.sorts.push({
      columnName: column,
      ascending,
      nullsFirst,
    });
    return this;
  }

  match(criteria: Dictionary<any>) {
    this.filters.push({ clause: 'match', value: criteria });
    return this;
  }

  range(from: number, to: number) {
    return this._getQueryModifier().range(from, to);
  }

  toSql() {
    return this._getQueryModifier().toSql();
  }

  _getQueryModifier() {
    return new QueryModifier(this.table, this.action, {
      actionValue: this.actionValue,
      filters: this.filters,
      sorts: this.sorts,
    });
  }
}
