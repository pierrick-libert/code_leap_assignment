import {HttpException} from './http.factory';

export class LoginRequiredException extends HttpException {
  constructor() {
    super(401, 'You must be logged in to request this endpoint');
  }
}
