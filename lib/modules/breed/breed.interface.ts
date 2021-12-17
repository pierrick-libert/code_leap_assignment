import {ImageModel} from '../image/image.interface';

// Interface for the DB model
export interface BreedModel {
  id: string;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
  images: ImageModel[];
}

// Use to order by dynamically
export const BreedOrder = ['id', 'name', 'display_name', 'created_at', 'updated_at'];
