/******************************************************************
**                         General Section                       **
******************************************************************/

// Object returned by the factory when building a query
export interface PgQueryObject {
  query: string;
  values: (string | number | boolean | null)[];
}
