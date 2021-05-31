import { SupaColumn, SupaRow } from '../types';

const clientOS =
  navigator.appVersion.indexOf('Win') !== -1
    ? 'windows'
    : navigator.appVersion.indexOf('Mac') !== -1
    ? 'macos'
    : 'unknown';
export const METAKEY = clientOS === 'windows' ? 'Control' : 'Command';

export function getStorageKey(prefix: string, ref: string) {
  return `${prefix}_${ref}`;
}

export function deepClone(obj: unknown) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    throw e;
  }
}

export function exportRowsToCsv(
  columns: SupaColumn[],
  rows: SupaRow[],
  separator: string = ','
) {
  const keys = columns.map(x => x.name) || [];
  const csv =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell =
              cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');
  return csv;
}
