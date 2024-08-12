# Dog Pics API

## Overview

This is a RESTful API for uploading and managing dog pictures.

## Endpoints

### Upload a Dog Pic

- **URL:** `/dogs`
- **Method:** `POST`
- **Body:**
  - `dogPic` (form-data, file): The dog picture to upload.
- **Response:**
  - `201 Created` with the created dog object.

### Delete a Dog Pic

- **URL:** `/dogs/:id`
- **Method:** `DELETE`
- **Response:**
  - `204 No Content` if the dog pic is successfully deleted.
  - `404 Not Found` if the dog pic is not found.

### Update a Dog Pic

- **URL:** `/dogs/:id`
- **Method:** `PUT`
- **Body:**
  - `dogPic` (form-data, file): The new dog picture to replace the old one.
- **Response:**
  - `200 OK` with the updated dog object.
  - `404 Not Found` if the dog pic is not found.

### Fetch a Dog Pic by ID

- **URL:** `/dogs/:id`
- **Method:** `GET`
- **Response:**
  - The image file if the dog pic is found.
  - `404 Not Found` if the dog pic is not found.

### Fetch a List of Uploaded Dog Pics

- **URL:** `/dogs`
- **Method:** `GET`
- **Response:**
  - `200 OK` with an array of all uploaded dog pics.

## Running the API

1. Clone the repository.
2. Install the dependencies: `npm install`
3. Create a `.env` file with your MongoDB URI and server port.
4. Start the server: `npm start`

## Running the Tests

1. Run the tests: `npm test`
