import {PgFactory} from './lib/pg/pg.factory';
import {PgService} from './lib/pg/pg.service';
import {AppService} from './lib/app/app.service';
import {SentryFactory} from './lib/sentry/sentry.factory';
import {LoggerFactory} from './lib/logger/logger.factory';
import {LoggerService} from './lib/logger/logger.service';

// List all endpoints used by your applications
import {Breed} from './endpoints/breed';
import {Image} from './endpoints/image';

// Define if we're in a production env
const isProd = process.env.NODE_ENV === 'production';

// Init the sentry with proper information
new SentryFactory(isProd);
// Init the DB Pool
const pgService = new PgService(new PgFactory());
// Init the logger
const logger = new LoggerService(new LoggerFactory(isProd));

if (isProd === false) {
  logger.getLogger().debug('Logging initialized at debug level');
}

// Add all your endpoints there
const app = new AppService(
  [
    new Breed(pgService, logger),
    new Image(pgService, logger),
  ],
  logger,
  8080,
);

app.listen();
