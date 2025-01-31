const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Dog = require('../models/dog');
const path = require('path');
const fs = require("fs");

let mongoServer;

// Your existing function that processes files
async function processFiles() {
  // Your file processing logic here

  // Ensure cleanup after processing
  try {
    // Assume 'rawImage' is the path to your temporary folder
    await cleanUpFolder('rawImage');
  } catch (error) {
    console.error('Error during cleanup after file processing:', error);
  }
}

// Function to clean up the folder
async function cleanUpFolder(folderPath) {
  try {
    // Read the directory contents
    const files = await fs.readdir(folderPath);

    // Delete each file in the directory
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await fs.unlink(filePath); // Delete the file
      console.log(`File deleted: ${filePath}`);
    }

    // Optionally, remove the directory itself (if needed)
    // await fs.rmdir(folderPath);
    console.log('Temporary folder cleaned successfully');
  } catch (error) {
    console.error('Error cleaning up the temporary folder:', error);
  }
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
  if (mongoose.connection.readyState === 1) {
    console.log('Database is connected');
  } else {
    console.error('Database is not connected');
  }
});


afterAll(async () => {
  await Dog.deleteMany();
  await mongoose.disconnect();
  await mongoServer.stop();
  // processFiles();
});

afterEach(async () => {
  await Dog.deleteMany();
});

describe('Dog Pics API', () => {
  it('should upload a dog pic', async () => {
    const res = await supertest(app)
      .post('/api/v1/dogs/new')
      .attach('dogPic', path.join(__dirname, 'test.jpg'));
    expect(res.statusCode).toEqual(201);
    expect(res.body.data?.[0]).toHaveProperty('filename');
  });

  it('should fetch all dog pics', async () => {
    const dog = new Dog({ filename: 'test.jpg',url: '/public/test.jpg' });
    await dog.save();
    const res = await supertest(app).get('/api/v1/dogs/list');
    expect(res.statusCode).toEqual(200);
    expect(res.body.list.length).toBe(1);
  });

  it('should fetch a particular dog pic by ID', async () => {
    const uploadImg = await supertest(app)
      .post('/api/v1/dogs/new')
      .attach('dogPic', path.join(__dirname, 'test.jpg'));
    const dogId = uploadImg.body.data?.[0]._id.toString();
    const res = await supertest(app).get(`/api/v1/dogs/info/${dogId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/image\/jpeg/);
  });

  it('should update a dog pic', async () => {
    const uploadImg = await supertest(app)
      .post('/api/v1/dogs/new')
      .attach('dogPic', path.join(__dirname, 'test.jpg'));
    const dogId = uploadImg.body.data?.[0]._id.toString();
    const res = await supertest(app)
      .put(`/api/v1/dogs/update/${dogId}`)
      .attach('dogPic', path.join(__dirname, 'new-test.jpg'));
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('filename');
  });

  it('should delete a dog pic', async () => {
    const uploadImg = await supertest(app)
      .post('/api/v1/dogs/new')
      .attach('dogPic', path.join(__dirname, 'test.jpg'));
    const dogId = uploadImg.body.data?.[0]._id.toString();
    const res = await supertest(app).delete(`/api/v1/dogs/remove/${dogId}`);
    expect(res.statusCode).toEqual(204);
  });
});
