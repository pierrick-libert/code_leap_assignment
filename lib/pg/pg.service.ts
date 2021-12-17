import {Pool} from 'pg';
import {PgFactory} from './pg.factory';
import * as PgInterface from './pg.interface';

export class PgService {

  private pool: Pool;

  constructor(pgFactory: PgFactory) {
    this.pool = pgFactory.getPool();
  }

  // Return the PostgreSQL client
  public getPool(): Pool {
    return this.pool;
  }

  // Query according to the object built by pg-factory
  public query(obj: PgInterface.PgQueryObject): Promise<any> {
    return this.pool.query(obj.query, obj.values);
  }

}
