import {Logger} from 'winston';
import {LoggerFactory} from './logger.factory';

export class LoggerService {

  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger();
  }

  // Return the PostgreSQL client
  public getLogger(): Logger {
    return this.logger;
  }

}
