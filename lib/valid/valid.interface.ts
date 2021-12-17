/******************************************************************
**                       Generic Defintion                       **
******************************************************************/

// Object return by the service
export interface ValidObj {
  success: boolean;
  message: string;
}

/******************************************************************
**                       Schema Defintion                        **
******************************************************************/

// String basic schema
export interface StringSchema {
  type: string;
  minLength: number;
  format?: string;
  pattern?: string;
}

// Number basic schema
export interface NumberSchema {
  type: string;
  minimum: number;
}

// Boolean basic schema
export interface BooleanSchema {
  type: string;
}
