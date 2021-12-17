import {HttpException} from './http.factory';

export class ItemNotFoundException extends HttpException {
  constructor(id: string, item: string) {
    super(404, `${item} referred as ${id} has not been found`);
  }
}
