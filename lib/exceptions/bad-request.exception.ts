import {HttpException} from './http.factory';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
