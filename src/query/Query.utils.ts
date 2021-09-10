import { ident, literal } from '@scaleleap/pg-format';
import {
  Dictionary,
  Filter2,
  QueryPagination,
  QueryTable,
  Sort,
} from '../types';

export function countQuery(
  table: QueryTable,
  options?: {
    filters?: Filter2[];
  }
) {
  let query = `select count(*) from ${queryTable(table)}`;
  const { filters } = options ?? {};
  if (filters) {
    query = applyFilters(query, filters);
  }
  return query + ';';
}

export function selectQuery(
  table: QueryTable,
  columns?: string[],
  options?: {
    filters?: Filter2[];
    pagination?: QueryPagination;
    sorts?: Sort[];
  }
) {
  let query = '';
  const queryColumn = columns?.map((x) => ident(x)).join(', ') ?? '*';
  query += `select ${queryColumn} from ${queryTable(table)}`;

  const { filters, pagination, sorts } = options ?? {};
  if (filters) {
    query = applyFilters(query, filters);
  }
  if (sorts) {
    query = applySorts(query, sorts);
  }
  if (pagination) {
    const { limit, offset } = pagination ?? {};
    query += ` limit ${literal(limit)} offset ${literal(offset)}`;
  }
  return query + ';';
}

export function updateQuery(
  table: QueryTable,
  value: Dictionary<any>,
  options?: {
    filters?: Filter2[];
    returning?: boolean;
  }
) {
  const queryValue = Object.entries(value)
    .map(([column, value]) => `${ident(column)} = ${literal(value)}`)
    .join(', ');
  let query = `update ${queryTable(table)} set ${queryValue}`;
  const { filters, returning } = options ?? {};
  if (filters) {
    query = applyFilters(query, filters);
  }
  if (returning) {
    query += 'returning *';
  }
  return query + ';';
}

function queryTable(table: QueryTable) {
  return `${ident(table.schema)}.${ident(table.name)}`;
}

function applySorts(query: string, sorts: Sort[]) {
  if (sorts.length == 0) return query;
  query += ` order by ${sorts
    .map((x) => {
      const order = x.ascending ? 'asc' : 'desc';
      const nullOrder = x.nullsFirst ? 'nulls first' : 'nulls last';
      return `${ident(x.columnName)} ${order} ${nullOrder}`;
    })
    .join(', ')}`;
  return query;
}

function applyFilters(query: string, filters: Filter2[]) {
  if (filters.length == 0) return query;
  query += ` where ${filters
    .map((x) => {
      if (Array.isArray(x.value)) {
        return `${ident(x.column)} ${x.operator} (${literal(x.value)})`;
      } else {
        return `${ident(x.column)} ${x.operator} ${literal(x.value)}`;
      }
    })
    .join(' and ')}`;
  return query;
}
