import { Filter, Sort, SupaRow } from '../../types';

export interface IRowService {
  fetchPage: (
    page: number,
    rowsPerPage: number,
    filters: Filter[],
    sorts: Sort[]
  ) => { data: SupaRow[]; error?: { message: string } };
  create: (row: SupaRow) => { data: SupaRow; error?: { message: string } };
  update: (row: SupaRow) => { data: SupaRow; error?: { message: string } };
  delete: (row: SupaRow) => { data: SupaRow; error?: { message: string } };
}
