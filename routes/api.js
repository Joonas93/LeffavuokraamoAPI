var express = require('express');
var router = express.Router();
const Joi = require('joi');
var connection = require("../connection.js");
const schema = require("../schemas/schema.js");
const updateSchema = require("../schemas/updateSchema.js");
const selectSchema = require("../schemas/selectSchema.js");

//use parameters to filter result
router.get('/search', function(req, res, next) {
        console.log("m")
        if(isEmpty(req.query)){return res.status(400).send("no parameters found")}

        const result = Joi.validate(req.query, selectSchema)
        if (result.error) {
            return  res.status(400).send(result.error)
        }

    let filters = "";

    let keys = Object.keys(req.query)
    let values = Object.values(req.query)
    let index = 0

    for(;index<keys.length;index++){
        filters += keys[index]+'='+'\''+values[index]+'\'';
        if(index!=keys.length-1){
            filters += ' AND '

        }
    }
    let sql = "SELECT * FROM movies WHERE "+filters;


        connection.query(sql,function(error,result,field){
            if(error) res.status(400).json({error:error}) ;
            else {res.status(200).json({movies:result})}

        })
});

// Get all movies
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM movies', function(error,result,field){
        if(error) res.status(400).json({error:error});
        else {res.status(200).json({movies:result})}

    })
});

//Update single movie in database.
router.put('/updateMovie', function(req,res){
    const apikey = req.get('x-api-key');
    if(apikey==null) { return res.status(401).send('No apikey detected in header')}
    checkIfAdmin(apikey,function(isAdmin){

        if(!isAdmin) {return res.status(401).send('Access is denied')}
        else {
            const result = Joi.validate(req.body, updateSchema);
            if (result.error) {
                return  res.status(400).send(result.error)
            }
            sql = 'UPDATE movies SET ? WHERE id = '+req.body.id;
            connection.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                connection.query(sql, req.body, function (error, results, fields) {

                    if (error) {
                        return connection.rollback(function () {
                            res.status(400).json({error:error})
                        });
                    }
                    res.status(200).json({movies:results})
                })
            })
            connection.commit(function (err) {
                if (err) {
                    return connection.rollback(function () {
                        throw err;
                    });
                }
            });

        }
    })
})

// Add movie to database
router.post('/addMovie', function(req,res){
    const apikey = req.get('x-api-key');
    if(apikey==null) { return res.status(401).send('No apikey detected in header')}
    checkIfAdmin(apikey,function(isAdmin){

        if(!isAdmin) {return res.status(401).send('Access is denied')}
        else {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return  res.status(400).send(result.error)
            }
            checkIfMovieIsInDatabase(req.body, function(isFound){

                if(isFound){return res.status(304).send('Elokuva löytyy jo tietokannasta')}

            sql = 'INSERT INTO movies SET ?';
            connection.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                connection.query(sql, req.body, function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function () {
                            res.status(400).json({error:error})
                        });
                        res.status(200).json({movies:results});
                    }
                })
            })
            connection.commit(function (err) {
                if (err) {
                    return connection.rollback(function () {
                        throw err;
                    });
                }
            });
            })}
        })
})

//Delete movie using id
router.delete('/deleteMovie/:id', function(req, res) {

    const apikey = req.get('x-api-key');
    if(apikey==null) { return res.status(401).send('No apikey detected in header')}

    checkIfAdmin(apikey,function(isAdmin){

      if(!isAdmin) {return res.status(401).send('Access is denied')}
      else {

          const result = Joi.validate(req.params.id, schema.id);
          if (result.error) {
            return  res.status(400).send(result.error)
          }
          sql = 'DELETE FROM movies WHERE ID = ?';
          connection.beginTransaction(function (err) {
              if (err) {
                  throw err;
              }
              connection.query(sql, req.params.id, function (error, results, fields) {
                  if (error) {
                      return connection.rollback(function () {
                          throw error;
                      });
                      res.status(200).json({movies:results});
                  }
              })
          })
          connection.commit(function (err) {
              if (err) {
                  return connection.rollback(function () {
                      throw err;
                  });
              }
          });
      }
    })
})

function checkIfAdmin(apikey,callback){
    console.log("admin")
    let sql1 = 'SELECT * FROM api_keys WHERE apiKey = \"'+apikey+'\" AND isAdmin = 1';
    connection.query(sql1, function (err,result,fields) {
        if (result.length==0){return callback(false)}
        return callback(true);
    })
}
function checkIfMovieIsInDatabase(movie, callback){
    console.log("movie")
    let sql1 = 'SELECT * FROM movies WHERE name =\"'+movie.name+'\" AND releaseYear =' + movie.releaseYear;
    connection.query(sql1, function (err,result,fields) {
        if(err) throw err;

        if (result.length==0){return callback(false)}
        return callback(true);
    })
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = router;