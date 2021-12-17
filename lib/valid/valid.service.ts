'use strict';

import Ajv, {ValidateFunction, ErrorObject} from 'ajv';
import {Params} from '../enum';
import {Request} from 'express';
import {ValidObj} from './valid.interface';

export class ValidService {

  private schemaValidator: Ajv;

  constructor() {
    this.schemaValidator = new Ajv();
  }

  public validate(input: any, schema: any): {valid: boolean; message: string} {

    const schemaValidator: ValidateFunction = this.schemaValidator.compile(schema);
    schemaValidator(input);

    const hasErrors: boolean = schemaValidator.errors ?
      schemaValidator.errors.length > 0 :
      false;

    if (hasErrors) {
      const errors: string[] = schemaValidator && schemaValidator.errors ?
        schemaValidator.errors.map(this.extractErrors) :
        [];

      return {valid: false, message: errors.join(', ')};
    }

    return {valid: true, message: ''};
  }

  // Generic function to get params
  // Endpoint: string = the name of the endpoint which called this function for log purpose
  // params: string[] = the params we will checked in the object request so it can be 'params', 'query' or 'body'
  // schema: any = the json object to validate the params, usually coming from the factory of the endpoint
  // req: Request = request object from express
  public checkParamsValidity(endpoint: string, params: Params[], schema: any, req: Request): ValidObj {
    let data: any = {};
    params.forEach((param: string) => {
      // Get all params into a common object
      data = Object.assign(data, req[param]);
      // In order to do not pollute the logs with the file buffer data, we display it separately so, automatically it
      // shrinks the buffer
      if (param === Params.File) {
        console.log(`[${endpoint}] ${param} Parameters -> `);
        console.log(data.picture);
      } else {
        console.log(`[${endpoint}] ${param} Parameters -> ${JSON.stringify(data)}`);
      }
    });
    // Dynamic check
    const validObj = this.validate(data, schema);
    if (validObj.valid === false) {
      console.log(`[${endpoint}] -> ${JSON.stringify(validObj)}`);
      return {success: validObj.valid, message: validObj.message};
    }
    return {success: validObj.valid, message: ''};
  }

  private extractErrors(error: ErrorObject): string {

    let message = '';

    if (error.instancePath !== '') {
      message =  error.instancePath + ' ' + error.message;
    } else if (error.message) {
      message = error.message.replace(/^\w/, c => c.toUpperCase());
    }

    return message;
  }

}
