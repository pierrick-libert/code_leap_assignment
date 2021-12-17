import {expect} from 'chai';
import * as supertest from 'supertest';

// This agent refers to PORT where program is runninng.
const server = supertest.agent('http://localhost:8080');

// Here are all the endpoints we're going to call
const breedApi = '/api/breeds';

// Value to save for later
let breed_name = '';

function startServerFirst(err: any, done: any) {
  console.log('IMPORTANT: You need to start the server before proceeding to the functional tests' +
    ' and to execute the script init-functional-test.sh');
  return done(err);
}

describe('Breed Success Functional Test', function() {
  // Set a higher timeout than 2s since we connect to Zoho
  this.timeout(30000);

  it('GET all breeds', function(done) {
    server
      .get(breedApi)
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
          breed_name = res.body[0].name;
          done();
        }
      });
  });

  it('GET breeds with page=1', function(done) {
    server
      .get(`${breedApi}?page=1`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(40);
          done();
        }
      });
  });

  it('GET breeds with page=1 & limit=20', function(done) {
    server
      .get(`${breedApi}?page=1&limit=20`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(20);
          done();
        }
      });
  });

  it('GET breeds with page=1 & limit=20 & order=id', function(done) {
    server
      .get(`${breedApi}?page=1&limit=20&order=id`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(20);
          done();
        }
      });
  });

  it('GET no breeds with page=100 & limit=100', function(done) {
    server
      .get(`${breedApi}?page=100&limit=100`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(0);
          done();
        }
      });
  });

  it(`GET specific breed ${breed_name}`, function(done) {
    server
      .get(`${breedApi}/${breed_name}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body).to.be.a('object');
          expect(res.body.name).to.equal(breed_name);
          done();
        }
      });
  });

});


describe('Breed Error Functional Test', function() {

  it('GET non-existent breed', function(done) {
    server
      .get(`${breedApi}/totohaha`)
      .expect('Content-type', /json/)
      .expect(404)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          done();
        }
      });
  });
});
