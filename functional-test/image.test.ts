import {expect} from 'chai';
import * as supertest from 'supertest';

// This agent refers to PORT where program is runninng.
const server = supertest.agent('http://localhost:8080');

// Here are all the endpoints we're going to call
const imageApi = '/api/images';

// Value to save for later
let image_id = '';

function startServerFirst(err: any, done: any) {
  console.log('IMPORTANT: You need to start the server before proceeding to the functional tests' +
    ' and to execute the script init-functional-test.sh');
  return done(err);
}

describe('Image Success Functional Test', function() {
  // Set a higher timeout than 2s since we connect to Zoho
  this.timeout(30000);

  it('GET Random images', function(done) {
    server
      .get(`${imageApi}/random`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(40);
          // Save the data for later
          image_id = res.body[0].id;
          done();
        }
    });
  });

  it('GET Random images nb=10', function(done) {
    server
      .get(`${imageApi}/random?nb=10`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(10);
          done();
        }
    });
  });

  it('GET image by id', function(done) {
    server
      .get(`${imageApi}/${image_id}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.equal(image_id);
          done();
        }
    });
  });

  it('POST Create image', function(done) {
    server
      .post(`${imageApi}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', 'functional-test/assets/guinness.jpg')
      .expect(201)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.be.a('string');
          // Save the data for later
          image_id = res.body.id;
          done();
        }
    });
  });

  it('DELETE The image we just created', function(done) {
    server
      .delete(`${imageApi}/${image_id}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('object');
          done();
        }
    });
  });

});
