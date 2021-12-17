import {ImageUpsert} from './image.interface';
import {PgQueryObject} from '../../pg/pg.interface';
import {ValidFactory} from '../../valid/valid.factory';

export class ImageFactory {

  /******************************************************************
  **                           DB Request                          **
  ******************************************************************/

  // Return a random number of images
  public getRandom(nb: number): PgQueryObject {
    const query = `SELECT id, url, filename, height, width, created_at, updated_at
      FROM image ORDER BY random() LIMIT $1`;
    return {query, values: [nb > 0 ? nb : 40]};
  }

  // Return a specific image from its ID
  public getById(id: string): PgQueryObject {
    const query = `SELECT id, url, filename, height, width, created_at, updated_at FROM image
      WHERE id=$1`;
    return {query, values: [id]};
  }

  // Upsert an image
  public upsert(data: ImageUpsert): PgQueryObject {
    const query = `INSERT INTO image (id, url, height, width, filename, created_at, updated_at) VALUES
      ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET url=EXCLUDED.url,
        height=EXCLUDED.height, width=EXCLUDED.width, updated_at=EXCLUDED.updated_at,
        filename=EXCLUDED.filename
      RETURNING id`;

    return {query, values: [data.id, data.url, data.height, data.width, data.filename]};
  }

  // Link a breed to an image
  public linkImageToBreed(id: string, breed_id: string): PgQueryObject {
    const query = `INSERT INTO breed_image (image_id, breed_id) VALUES ($1, $2)
      ON CONFLICT (breed_id, image_id) DO NOTHING`;

    return {query, values: [id, breed_id]};
  }

  // Delete an image
  public delete(id: string): PgQueryObject {
    return {query: 'DELETE FROM image WHERE id=$1', values: [id]};
  }

  /******************************************************************
  **                        Schema Validator                       **
  ******************************************************************/

  public schemaCreate(): any {
    return {
      properties: {
        file: {
          type: 'object'
        },
        breed_id: ValidFactory.getUuidSchema(),
      },
      required: ['file'],
      type: 'object'
    };
  }

}
