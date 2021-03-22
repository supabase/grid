import { SupaColumn, SupaTable } from '../dist';

const colId: SupaColumn = {
  position: 1,
  name: 'id',
  defaultValue: null,
  dataType: 'bigint',
  format: 'int8',
  isIdentity: true,
  isGeneratable: true,
  isNullable: false,
  isUpdatable: true,
  enum: [],
};
const colName: SupaColumn = {
  position: 2,
  name: 'name',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enum: [],
  comment: 'Full country name.',
};
const colIso2: SupaColumn = {
  position: 3,
  name: 'iso2',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: false,
  isUpdatable: true,
  enum: [],
  comment: 'ISO 3166-1 alpha-2 code.',
};
const colIso3: SupaColumn = {
  position: 4,
  name: 'iso3',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enum: [],
  comment: 'ISO 3166-1 alpha-3 code.',
};
const colLocalName: SupaColumn = {
  position: 5,
  name: 'local_name',
  defaultValue: null,
  dataType: 'text',
  format: 'text',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enum: [],
  comment: 'Local variation of the name.',
};
const colContinent: SupaColumn = {
  position: 6,
  name: 'continent',
  defaultValue: null,
  dataType: 'USER-DEFINED',
  format: 'continents',
  isIdentity: false,
  isGeneratable: false,
  isNullable: true,
  isUpdatable: true,
  enum: [
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'Oceania',
    'North America',
    'South America',
  ],
};
const countries: SupaTable = {
  name: 'countries',
  comment: 'Full list of countries.',
  schema: 'public',
  totalRows: 249,
  columns: [colId, colName, colIso2, colIso3, colLocalName, colContinent],
};
export default countries;
