/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
  
    // 4. I can get /api/books to retrieve an array of all books containing title, _id, & commentcount.
    .get(function (req, res){
    
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        db.collection('personalLibrary').find({}).toArray(function(err,catArr){
          
          // count number of comments: 
          catArr.forEach(function(bkObj){
            bkObj.commentcount = bkObj.comments.length;
            delete bkObj.comments;
          })
          
          // console.log('GET after to array: ',catArr);
          res.json(catArr);
        })
      }) 
    })
    
    // 3. I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      console.log("Input book title --- ",title);
      
      if ( title != '' ) {
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err,db){

        if (err) {console.error(err)}
        else {
          
          // check if submitted book already exists in library, 
          db.collection('personalLibrary').find({title: title}).toArray( function(err,ret){
            
            // if book with same title found, then return that: 
            if (ret.length === 1) {
              res.json(ret[0]);
            } 
            // if no book with same title is found, then add this and return json:
            else if (ret.length === 0) {
              db.collection('personalLibrary').insertOne({title: title, comments: []},function(err,retDoc){
              res.json(retDoc.ops[0])
              })
            }
            
          })
          
        }

      })
      }
      else { res.json({message: 'no title provided'}) }
          
    })
    
    // 9. I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err,db){
        
        db.collection('personalLibrary').deleteMany({},function(err,retObj){
          if (retObj.result.n != 0) {
            res.json({message:'complete delete successful'});
          } else if (retObj.result.n == 0) {
            res.json({message: 'nothing to delete'})
          }
        })
        
      })
    
    });

  app.route('/api/books/:id')
  
    // 5. I can get /api/books/{_id} to retrieve a single object of a book containing title, _id, & an array of comments (empty array if no comments present).   
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log(bookid);
    
      MongoClient.connect( MONGODB_CONNECTION_STRING, function(err,db) {
        
        db.collection('personalLibrary').find({_id: ObjectId(bookid)}).toArray(function(err,bookDoc){
          if (bookDoc.length === 1) {
            res.json(bookDoc);
          } else if (bookDoc.length === 0) {
            console.log('id/book not found')
            res.json({message: 'id/book not found'});
          }
        });
        
      })
      
    })
    
    // 6. I can post a comment to /api/books/{_id} to add a comment to a book and returned will be the books object similar to get /api/books/{_id}.
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      
      console.log(bookid, comment);
      if (comment !== "" ) {
        MongoClient.connect(MONGODB_CONNECTION_STRING,function(err,db){
          db.collection('personalLibrary').update(
            {_id: ObjectId(bookid) },
            {
              $push: { comments: comment  }
            },
            function(err,cbObj){
              if (cbObj.result.n != 0) {
                
                db.collection('personalLibrary').find({_id: ObjectId(bookid)}).toArray(function(err,bookDoc){
                  res.json(bookDoc);
                });
                
              }
            })
        });
      }
      
    })
    
    // 7. I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.  
    // 8. If I try to request a book that doesn't exist I will get a 'no book exists' message.
    .delete(function(req, res){
      var bookid = req.params.id;
    
      //if successful response will be 'delete successful'
      console.log(bookid);
    
      MongoClient.connect( MONGODB_CONNECTION_STRING ,function(err,db){
        
        db.collection('personalLibrary').deleteOne({_id:ObjectId(bookid)},function(err,retObj){
          if (retObj.result.n != 0) {
            res.json({message:'delete successful'});
          } else if (retObj.result.n == 0) {
            res.json({message: 'no book existst'})
          }
        });
        
        
        
      });
      
        
    
    });
  
};
