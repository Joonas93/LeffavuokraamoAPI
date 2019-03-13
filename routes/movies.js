var express = require('express');
var router = express.Router();
const Joi = require('joi');
var connection = require("../connection.js");
var sql =''

const schema = require('../schemas/schema.js')





// Post new movie to database. Used in webform.
router.post('/', function(req, res) {
    console.log(req.body)

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        throw result.error
    }
    else {

        sql = 'INSERT INTO movies SET ?';
        connection.beginTransaction(function (err) {
            if (err) {
                throw err;
            }
            delete req.body._csrf // remove token before inputting object to database
            connection.query(sql, req.body, function (error, results, fields) {
                if (error) {
                    return connection.rollback(function () {
                        throw error;
                    });
                }
            })

        })
        connection.commit(function (err) {
            if (err) {
                return connection.rollback(function () {
                    throw err;
                });
            }
            ;
        });
        res.render('index')
    }
    ;
})

// Get all movies
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM movies', function(error,result,field){
        if(error) res.status(400).json({error:error});
        else {res.status(200).send(result)}

    })
});
module.exports = router;
