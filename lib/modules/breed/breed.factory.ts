import {BreedOrder} from './breed.interface';
import {PgQueryObject} from '../../pg/pg.interface';
import {ValidFactory} from '../../valid/valid.factory';


export class BreedFactory {

  /******************************************************************
  **                           DB Request                          **
  ******************************************************************/

  // Return all breeds in DB
  public getAll(page: number, limit: number, order: string): PgQueryObject {
    let offset = 0;
    let db_limit = 40;
    if (limit && limit > 0 && limit < 100) {
      db_limit = limit;
    }
    if (page && page > 0) {
      offset = (page * db_limit) - db_limit;
    }
    order = BreedOrder.includes(order) ? order : 'name';
    const query = `SELECT id, name, display_name, created_at, updated_at
      FROM breed ORDER BY $1 LIMIT $2 OFFSET $3`;
    return {query, values: [order, db_limit, offset]};
  }

  // Return a specific breed
  public getByName(name: string): PgQueryObject {
    const query = `SELECT id, name, display_name, created_at, updated_at FROM breed
      WHERE name=$1`;
    return {query, values: [name.trim().toLowerCase().replace(/ /gi, '-')]};
  }

  /******************************************************************
  **                        Schema Validator                       **
  ******************************************************************/

  public schemaGetByName(): any {
    return {
      properties: {
        name: ValidFactory.getStringSchema(1),
      },
      required: ['name'],
      type: 'object'
    };
  }

}
