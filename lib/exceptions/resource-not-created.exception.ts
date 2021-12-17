import {HttpException} from './http.factory';

export class ResourceNotCreatedException extends HttpException {
  constructor() {
    super(400, 'Resource creation has failed');
  }
}
