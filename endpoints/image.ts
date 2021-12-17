import crypto from 'crypto';
import {resolve} from 'path';
import {Params} from '../lib/enum';
import {Config} from '../lib/config';
import probe from 'probe-image-size';
import {PgService} from '../lib/pg/pg.service';
import {createReadStream, unlinkSync} from 'fs';
import {UploadedFile} from 'express-fileupload';
import {AppService} from '../lib/app/app.service';
import {Endpoint} from '../lib/app/app.interface';
import {ValidService} from '../lib/valid/valid.service';
import {ValidFactory} from '../lib/valid/valid.factory';
import {LoggerService} from '../lib/logger/logger.service';
import {HttpException} from '../lib/exceptions/http.factory';
import {ImageFactory} from '../lib/modules/image/image.factory';
import {Request, Response, Router, NextFunction} from 'express';
import {ResponseFactory} from '../lib/response/response.factory';
import {BadRequestException} from '../lib/exceptions/bad-request.exception';
import {ImageModel, ImageUpsert} from '../lib/modules/image/image.interface';
import {ItemNotFoundException} from '../lib/exceptions/item-not-found.factory';
import {ResourceNotCreatedException} from '../lib/exceptions/resource-not-created.exception';

export class Image implements Endpoint {

  public pgService: PgService;
  public logger: LoggerService;
  public factory: ImageFactory;
  public router: Router = Router();
  public validService: ValidService;
  public basePath = `${AppService.basePath}/images`;


  constructor(pgService: PgService, logger: LoggerService) {
    this.pgService = pgService;
    this.logger = logger;
    this.factory = new ImageFactory();
    this.validService = new ValidService();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    // Get method
    this.router.get(`${this.basePath}/random`, (rq: Request, rs: Response, n: NextFunction) => this.getRandom(rq, rs, n));
    this.router.get(`${this.basePath}/:id`, (rq: Request, rs: Response, n: NextFunction) => this.getById(rq, rs, n));
    this.router.get(`${this.basePath}/display/:image`,
      (rq: Request, rs: Response, n: NextFunction) => this.displayImage(rq, rs, n));
    // Post method
    this.router.post(this.basePath, (rq: Request, rs: Response, n: NextFunction) => this.create(rq, rs, n));
    // Delete method
    this.router.delete(`${this.basePath}/:id`, (rq: Request, rs: Response, n: NextFunction) => this.delete(rq, rs, n));
  }

  /******************************************************************
  **                          GET Section                          **
  ******************************************************************/

  /*
  ** Method: GET
  ** Description: Return the resource requested or an error
  **
  ** Path Parameters: ID from the table `image`
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      'Get By Id', [Params.Path], ValidFactory.getIdSchema(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }

    let data: ImageModel = {} as ImageModel;
    try {
      const res_db = await this.pgService.query(this.factory.getById(req.params.id));
      if (res_db.rows.length === 0) {
        return next(new ItemNotFoundException(req.params.id, 'Image'));
      }
      data = res_db.rows[0];
    } catch (error) {
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, data, res);
  }

  /*
  ** Method: GET
  ** Description: Get a number of images randomly
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async getRandom(req: Request, res: Response, next: NextFunction): Promise<void> {
    let data: ImageModel[] = [];
    try {
      const nb = parseInt(req.query.nb as string || '0', 10);
      const res_db = await this.pgService.query(this.factory.getRandom(nb));
      data = res_db.rows;
    } catch (error) {
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, data, res);
  }

  /*
  ** Method: GET
  ** Description: Get a number of images randomly
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: none
  */
  public async displayImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.sendFile(resolve(__dirname, `../../assets/breeds/${req.params.image}`));
  }

  /******************************************************************
  **                          POST Section                         **
  ******************************************************************/

  /*
  ** Method: POST
  ** Description: Create a resource
  **
  ** Path Parameters: None
  ** Query Parameters: None
  ** Body Parameters: {"url": "...", "breed_id": ""}
  */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      'Image Creation', [Params.Body, Params.File], this.factory.schemaCreate(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new BadRequestException('File is mandatory'));
    }

    const data: ImageUpsert = {} as ImageUpsert;
    try {
      const file = req.files.file as UploadedFile;
      // First we create the image in DB
      const image_info = await probe(createReadStream(file.tempFilePath));
      data['id'] = crypto.randomBytes(10).toString('hex');
      data['height'] = image_info.height;
      data['width'] = image_info.width;
      data['filename'] = `${data['id']}.${image_info.type}`;
      data['url'] = `${Config.apiUrl}/api/images/display/${data['filename']}`;
      await file.mv(`assets/breeds/${data['filename']}`);
      const res_db = await this.pgService.query(this.factory.upsert(data));
      if (res_db.rows.length === 0) {
        return next(new ResourceNotCreatedException());
      }
      // After, if needed, we link it to a breed
      if (req.body.breed_id) {
        await this.pgService.query(this.factory.linkImageToBreed(data['id'], req.body.breed_id));
      }
    } catch (error) {
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(201,
      {message: 'Image successfully created', id: data['id']}, res);
  }

  /******************************************************************
  **                         DELETE Section                        **
  ******************************************************************/

  /*
  ** Method: DELETE
  ** Description: Delete a resource
  **
  ** Path Parameters: ID from the table `image`
  ** Query Parameters: None
  ** Body Parameters: None
  */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    // First check if the value is correct
    const valid = this.validService.checkParamsValidity(
      'Delete By Id', [Params.Path], ValidFactory.getIdSchema(), req);
    if (valid.success === false) {
      return next(new BadRequestException(valid.message));
    }

    try {
      const db_res = await this.pgService.query(this.factory.getById(req.params.id));
      if (db_res.rows.length > 0) {
        if (db_res.rows[0].filename) {
          unlinkSync(`assets/breeds/${db_res.rows[0].filename}`);
        }
        await this.pgService.query(this.factory.delete(req.params.id));
      }
    } catch (error) {
      return next(new HttpException(500, error.message));
    }
    ResponseFactory.make(200, {message: 'Image successfully deleted'}, res);
  }

}
