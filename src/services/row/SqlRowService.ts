// import { IRowService } from '.';
// import { Filter, ServiceError, Sort, SupaRow, SupaTable } from '../../types';
// import Knex from 'knex';

// export class SqlRowService implements IRowService {
//   knex?: any;

//   constructor(
//     protected table: SupaTable,
//     protected onError: (error: any) => void
//   ) {
//     this.knex = Knex({ client: 'pg' });
//   }

//   async fetchPage(
//     page: number,
//     rowsPerPage: number,
//     filters: Filter[],
//     sorts: Sort[]
//   ) {
//     console.log('12323123123213');
//     let query = this.knex(this.table.name).select('*');
//     console.log('select query: ', query.toSQL());
//     console.log(page, rowsPerPage, filters, sorts);
//     return { error: { message: 'Test' } };
//   }

//   async create(row: SupaRow) {
//     console.log('create: ', row);
//     return { error: { message: 'Test' } };
//   }

//   update(row: SupaRow) {
//     console.log('update: ', row);
//     return { error: { message: 'Test' } };
//   }

//   delete(rows: SupaRow[]) {
//     console.log('delete: ', rows);

//     const { primaryKeys, error } = this._getPrimaryKeys();
//     if (error) return { error };

//     let query = this.knex(this.table.name);
//     primaryKeys!.forEach((key) => {
//       const primaryKeyValues = rows.map((x) => x[key]);
//       query.whereIn(key, primaryKeyValues);
//     });
//     query.del();
//     console.log('delete query: ', query.toSQL());

//     return { error: { message: 'Test' } };
//   }

//   _getPrimaryKeys(): { primaryKeys?: string[]; error?: ServiceError } {
//     const pkColumns = this.table.columns.filter((x) => x.isPrimaryKey);
//     if (!pkColumns || pkColumns.length == 0) {
//       return { error: { message: "Can't find primary key" } };
//     }
//     return { primaryKeys: pkColumns.map((x) => x.name) };
//   }
// }
