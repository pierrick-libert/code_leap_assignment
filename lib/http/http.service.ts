import * as axios from 'axios';
import * as querystring from 'querystring';

export class HttpService {

  private instance: axios.AxiosInstance;

  constructor() {
    this.instance = axios.default.create({
      validateStatus: function (status: number) {
        return status < 500;
      }
    });
  }

  public post(url: string, data: any, config?: any): Promise<any> {
    if (!config) {
      return this.instance.post(url, querystring.stringify(data));
    }
    return this.instance.post(url, data, config);
  }

  public put(url: string, data: any, config?: any): Promise<any> {
    if (!config) {
      return this.instance.put(url, querystring.stringify(data));
    }
    return this.instance.put(url, data, config);
  }

  public get(url: string, data: any, config?: any): Promise<any> {
    if (!config) {
      return this.instance.get(url + '?' + querystring.stringify(data));
    }
    return this.instance.get(url + '?' + querystring.stringify(data), config);
  }

  public getByPath(url: string, config?: any): Promise<any> {
    if (!config) {
      return this.instance.get(url);
    }
    return this.instance.get(url, config);
  }

  public delete(url: string, config?: any): Promise<any> {
    if (!config) {
      return this.instance.delete(url);
    }
    return this.instance.delete(url, config);
  }

}
