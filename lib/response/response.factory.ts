import {Response} from 'express';

export class ResponseFactory {

  public static message = 'The request has been successfully executed';

  public static make(status: number, body: any, response: Response): void {
    response.status(status).send(body);
  }

}
