import { ident, literal } from '@scaleleap/pg-format';
import {
  Dictionary,
  Filter,
  QueryPagination,
  QueryTable,
  Sort,
} from '../types';

export function countQuery(
  table: QueryTable,
  options?: {
    filters?: Filter[];
  }
) {
  let query = `select count(*) from ${queryTable(table)}`;
  const { filters } = options ?? {};
  if (filters) {
    query = applyFilters(query, filters);
  }
  return query + ';';
}

export function deleteQuery(
  table: QueryTable,
  filters?: Filter[],
  options?: {
    returning?: boolean;
  }
) {
  if (!filters || filters.length == 0) {
    throw { message: 'no filters for this delete query' };
  }
  let query = `delete from ${queryTable(table)}`;
  const { returning } = options ?? {};
  if (filters) {
    query = applyFilters(query, filters);
  }
  if (returning) {
    query += 'returning *';
  }
  return query + ';';
}

export function selectQuery(
  table: QueryTable,
  columns?: string[],
  options?: {
    filters?: Filter[];
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
    filters?: Filter[];
    returning?: boolean;
  }
) {
  const { filters, returning } = options ?? {};
  if (!filters || filters.length == 0) {
    throw { message: 'no filters for this update query' };
  }
  const queryValue = Object.entries(value)
    .map(([column, value]) => `${ident(column)} = ${formatLiteral(value)}`)
    .join(', ');
  let query = `update ${queryTable(table)} set ${queryValue}`;
  if (filters) {
    query = applyFilters(query, filters);
  }
  if (returning) {
    query += 'returning *';
  }
  return query + ';';
}

export function queryTable(table: QueryTable) {
  return `${ident(table.schema)}.${ident(table.name)}`;
}

export function formatLiteral(value: any) {
  if (Array.isArray(value)) {
    value = JSON.stringify(value);
    value = value.replace('[', '{');
    value = value.replace(']', '}');
  } else if (value?.constructor == Object || Array.isArray(value)) {
    value = JSON.stringify(value);
  }
  return literal(value);
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

function applyFilters(query: string, filters: Filter[]) {
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
