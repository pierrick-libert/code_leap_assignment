# Cat API - Typescript Exercise

## Introduction
Everybody loves cats. To satisfy the large demand for beautiful images of cats we need to be able to deliver pictures of them at a moments notice, whenever someone wishes to receive them. The preferred method of doing this of course is via the internet. The key goal of this exercise is to structurize and build an API where people are able to upload and receive cute images of cats.

## Requirements
The API should fulfill the following requirements:
- Runs on NodeJS
- Written in Typescript
- Uses a Database to categorize cat images by breed
- Offers the possibility to upload cat images for a specific breed
- Retreive a specific number of random cat images for a specific breed
- Retreive a specific number of random cat images out of all breeds

# Tasks
Please document your thoughtprocess and answers in a seperate document.

## Task 1 - Structuring
Setup a new Typescript Project that uses any packages of your choice from the [npmjs]([https://www.npmjs.com/) repository to be able to react to http/s-requests and setup the Classes, Types and Models to be able to save Information on cat breeds and the respective images that can be uploaded for a specific breed.

## Task 2 - Reading
Load the attached Dataset `.json` file into your Database to use as an initial frame.

## Task 3 - Api Requests
Implement the following API-Requests

### Get Breeds
```
GET /api/breeds
```
Retreives a list of breeds from the Database
> Extra Credit: \
Add functionality to be able to order the results by a specific parameter

### Get specific Breed
```
GET /api/breeds/{breed_name}
```
Retrieves information on a specific breed, which is defined in place of `{breed_name}` using the `kebab-case` convention.

### Upload Image
```
POST /api/images
```
Uploads an image. Add functionality to attach the Image to a specific Breed.

### Delete Image
```
DELETE /api/images/{image_id}
```
Deletes an Image

### Get Image
```
GET /api/images/{image_id}
```
Returns an Image with a URL to view it.

### Get Random Images
```
GET /api/images/random
```
Retrieves a random list of images with their respective urls. Supports query parameter to specify amount of Images (max 20) and breed.

## Task 4 - Extra Credit
Implement something you consider this API should support.