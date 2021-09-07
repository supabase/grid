import { IQueryAction, QueryAction } from './QueryAction';

interface IQuery {
  from: (table: string, schema?: string) => IQueryAction;
}

export class Query implements IQuery {
  from(table: string, schema?: string) {
    return new QueryAction({ name: table, schema: schema ?? 'public' });
  }
}
