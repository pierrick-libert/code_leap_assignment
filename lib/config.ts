export class Config {

  // PostgreSQL config
  public static readonly pgDB = process.env.PG_DB || 'code_leap_assignment';
  public static readonly pgUser = process.env.PG_USER || 'postgres';
  public static readonly pgPass = process.env.PG_PASS || 'toto42';
  public static readonly pgHost = process.env.PG_HOST || '127.0.0.1';
  public static readonly pgPort = parseInt(process.env.PG_PORT || '5432', 10) || 5432;

  // Generic config
  public static readonly nodeEnv = process.env.NODE_ENV || '';
  public static readonly secretKey = process.env.SECRET_KEY || 'cod3L3Apt3S@1';
  public static readonly apiUrl = process.env.API_URL || 'http://127.0.0.1:8080';

  // Sentry config
  public static readonly sentryDsn = process.env.SENTRY_DSN || '';
}
