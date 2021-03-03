import { GridColumn } from '@glideapps/glide-data-grid';
import { SupaTable } from '../types';

export function getGridColumns(
  table: SupaTable,
  options?: { defaultWidth?: number }
): GridColumn[] {
  const result = table.columns.map(x => {
    return {
      title: x.name,
      style: (x.isIdentity ? 'highlight' : 'normal') as 'normal' | 'highlight',
      width: options?.defaultWidth || 100,
    };
  });
  return result;
}
