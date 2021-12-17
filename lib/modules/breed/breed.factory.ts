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
    const query = `${this.getBreed()} GROUP BY b.id ORDER BY $1 LIMIT $2 OFFSET $3`;
    return {query, values: [order, db_limit, offset]};
  }

  // Return a specific breed
  public getByName(name: string): PgQueryObject {
    const query = `${this.getBreed()} WHERE name=$1 GROUP BY b.id`;
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

  /******************************************************************
  **                             Utils                             **
  ******************************************************************/
  // Request used in all breeds GET
  private getBreed(): string {
    return `SELECT
        b.id, b.name, b.display_name, b.created_at, b.updated_at,
        json_agg(i) as images
      FROM breed b
        LEFT JOIN breed_image bi ON bi.breed_id=b.id
        LEFT JOIN image i ON i.id=bi.image_id`;
  }

}
