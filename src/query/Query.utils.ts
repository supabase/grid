import { ident, literal } from '@scaleleap/pg-format';
import { Filter2, QueryPagination, QueryTable, Sort } from '../types';

export function countQuery(
  table: QueryTable,
  options?: {
    filters?: Filter2[];
  }
) {
  console.log('countQuery options: ', options);
  const { filters } = options ?? {};
  let query = 'select count(*)';
  query += ` from ${ident(table.schema)}.${ident(table.name)}`;
  if (filters) {
    query = applyFilters(query, filters);
  }
  return query + ';';
}

export function selectQuery(
  table: QueryTable,
  options?: {
    columns?: string[];
    filters?: Filter2[];
    pagination?: QueryPagination;
    sorts?: Sort[];
  }
) {
  let query = '';
  const { columns, filters, pagination, sorts } = options ?? {};
  query += `select ${
    columns?.map((x) => ident(x)).join(', ') ?? '*'
  } from ${ident(table.schema)}.${ident(table.name)}`;
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
