import {Pool} from 'pg';
import {Config} from '../config';

export class PgFactory {

  private pool: Pool;
  private defaultMaxConnection = 50;

  constructor(database: string = Config.pgDB) {
    // Setup the connection with PostgreSQL
    this.pool = new Pool({
      host: Config.pgHost,
      user: Config.pgUser,
      password: Config.pgPass,
      database: database,
      port: Config.pgPort,
      max: this.defaultMaxConnection
    });
  }

  // Return the PostgreSQL pool
  public getPool(): Pool {
    return this.pool;
  }

  // Close the all connections to PostgreSQL
  public close(): void {
    this.pool.end();
  }

}
