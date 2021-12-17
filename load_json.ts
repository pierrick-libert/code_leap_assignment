import {v4 as uuidv4} from 'uuid';
import breedsJson from './breeds.json';
import {PgFactory} from './lib/pg/pg.factory';
import {PgService} from './lib/pg/pg.service';

(async() => {
	// Prepare variables to insert data from the json
	const breeds: any = [];
	const images: any = [];
	const breeds_images: any = [];
	let breed_query = 'INSERT INTO breed (id, name, display_name, created_at, updated_at) VALUES ';
	let image_query = 'INSERT INTO image (id, url, height, width, created_at, updated_at) VALUES ';
	let bi_query = 'INSERT INTO breed_image (breed_id, image_id) VALUES ';
	// Go through the array json
	breedsJson.forEach((elem: any) => {
		// Breeds insertion
		let breed_name = '';
		if (elem.name) {
			breed_name = elem.name.trim().toLowerCase().replace(/ /gi, '-');
			breed_query = `${breed_query} ($${breeds.length + 1}, $${breeds.length + 2},
				$${breeds.length + 3}, NOW(), NOW()),`;
			breeds.push(...[uuidv4(), breed_name, elem.name]);
		}

		// Images insertion
		const image = elem.image;
		if (image && image.id) {
			image_query = `${image_query} ($${images.length + 1}, $${images.length + 2},
				$${images.length + 3}, $${images.length + 4}, NOW(), NOW()),`;
			images.push(...[elem.image.id, elem.image.url, elem.image.height, elem.image.width]);
		}

		// Breed Image link insertion
		if (elem.name && image && image.id) {
			bi_query = `${bi_query} 
				((SELECT id FROM breed WHERE name=$${breeds_images.length + 1}), $${breeds_images.length + 2}),`;
			breeds_images.push(...[breed_name, elem.image.id]);
		}
	});

	// Bulk create/update the DB with the data retrieved
	try {
		const pgService = new PgService(new PgFactory());
		if (breeds.length > 0) {
			breed_query = `
				${breed_query.slice(0, -1)} ON CONFLICT (name) DO UPDATE SET display_name=EXCLUDED.display_name,
					updated_at=EXCLUDED.updated_at`;
			await pgService.query({'query': breed_query, 'values': breeds});
		}
		if (breeds.length > 0) {
			image_query = `
				${image_query.slice(0, -1)} ON CONFLICT (id) DO UPDATE SET url=EXCLUDED.url,
					height=EXCLUDED.height, width=EXCLUDED.width, updated_at=EXCLUDED.updated_at`;
			await pgService.query({'query': image_query, 'values': images});
		}
		if (breeds_images.length > 0) {
			bi_query = `${bi_query.slice(0, -1)} ON CONFLICT (breed_id, image_id) DO NOTHING`;
			await pgService.query({'query': bi_query, 'values': breeds_images});
		}
	} catch (error) {
		console.info(`An error occurred whole processing your data: ${error}`);
		process.exit(1);
	}

	console.info(`Your data have been properly inserted
		Breed: ${breeds.length / 3}
		Image: ${images.length / 4}
	`);

})();