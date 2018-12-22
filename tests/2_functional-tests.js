/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);


// 10. All 6 functional tests required are complete and passing.
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'testBook'})
        .end(function(err,res){
          // console.log(res.body);
          assert.equal(res.body.title, 'testBook');
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: ''})
        .end(function(err,res){
          // console.log(res.body)
          assert.equal(res.body.message, 'no title provided');
          done();
        })
      });
      
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err,res){
          // console.log(res.body);
          assert.isArray(res.body);
          done();
        })
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5c1e1d1b98de606a91e50280')
        .end(function(err,res){
          // console.log('CHAI: ',res.body);
          assert.equal(res.body.message,'id/book not found');
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/5c1e1d1b98de606a91e50281')
        .end(function(err,res){
          // console.log('CHAI: ',res.body);
          assert.equal(res.body[0]._id,'5c1e1d1b98de606a91e50281');
          done();
        })
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/5c1e1d1b98de606a91e50281')
        .send(
          { comment: 'comment added by test' } 
        )
        .end(function(err,res){
          console.log('CHAI: ',res.body);
          assert.equal(res.body[0].comments[res.body[0].comments.length-1],'comment added by test');
          done();
        })
      });
      
    });

  });

});
