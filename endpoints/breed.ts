import {Params} from '../lib/enum';
import {PgService} from '../lib/pg/pg.service';
import {AppService} from '../lib/app/app.service';
import {Endpoint} from '../lib/app/app.interface';
import {ValidService} from '../lib/valid/valid.service';
import {LoggerService} from '../lib/logger/logger.service';
import {HttpException} from '../lib/exceptions/http.factory';
import {BreedModel} from '../lib/modules/breed/breed.interface';
import {BreedFactory} from '../lib/modules/breed/breed.factory';
import {Request, Response, Router, NextFunction} from 'express';
import {ResponseFactory} from '../lib/response/response.factory';
import {BadRequestException} from '../lib/exceptions/bad-request.exception';
import {ItemNotFoundException} from '../lib/exceptions/item-not-found.factory';


export class Breed implements Endpoint {

  public pgService: PgService;
  public logger: LoggerService;
  public factory: BreedFactory;
  public router: Router = Router();
  public validService: ValidService;
  public basePath = `${AppService.basePath}/breeds`;

  constructor(pgService: PgService, logger: LoggerService) {
    this.pgService = pgService;
    this.logger = logger;
    this.factory = new BreedFactory();
    this.validService = new ValidService();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // Get method
    this.router.get(this.basePath,
      (rq: Request, rs: Response, n: NextFunction) => this.getAll(rq, rs, n));
    this.router.get(`${this.basePath}/:name`,
      (rq: Request, rs: Response, n: NextFunction) => this.getByName(rq, rs, n));
  }

  /******************************************************************
  **                          GET Section                          **
  ******************************************************************/

  /*
  ** Method: GET
  ** Description: Get all breeds available in DB
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let data: BreedModel[] = [];
    try {
      const page = parseInt(req.query.page as string || '0', 10);
      const limit = parseInt(req.query.limit as string || '0', 10);
      const order = req.query.order as string || 'name';
      const res_db = await this.pgService.query(this.factory.getAll(page, limit, order));
      data = res_db.rows;
    } catch (error) {
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, data, res);
  }

  /*
  ** Method: GET
  ** Description: Return the resource requested or an error
  **
  ** Path Parameters: Name formatted in 'kebab-case'
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      'Get By Name', [Params.Path], this.factory.schemaGetByName(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }

    let data: BreedModel = {} as BreedModel;
    try {
      const res_db = await this.pgService.query(this.factory.getByName(req.params.name));
      if (res_db.rows.length === 0) {
        return next(new ItemNotFoundException(req.params.name, 'Breed'));
      }
      data = res_db.rows[0];
    } catch (error) {
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, data, res);
  }

}
