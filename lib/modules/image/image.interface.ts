
// Interface for the DB model
export interface ImageModel {
  id: string;
  url: string;
  height: number;
  width: number;
  filename: string;
  created_at: string;
  updated_at: string;
}

// Interface used to create an image
export interface ImageUpsert {
  id: string;
  url: string;
  width: number;
  height: number;
  filename: string;
}
