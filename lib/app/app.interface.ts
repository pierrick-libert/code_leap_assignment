import {Router} from 'express';

// Interface to be implemented by every endpoint
export interface Endpoint {
  // Generic properties
  router: Router;
  // Generic methods
  initializeRoutes(): void;
}
