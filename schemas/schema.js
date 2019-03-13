
/*
Database schema
 */

const Joi = require('joi');
var year = new Date();
year = year.getFullYear()

const schema = {
    name: Joi.string().max(100).required(),
    length: Joi.number().integer().min(10).max(600).required(),
    imdbUrl: Joi.string().max(100),
    genre: Joi.string().max(50),
    releaseYear: Joi.number().integer().min(1900).max(year).required(),
    amountInStock: Joi.number().integer().min(0).required(),
    plot: Joi.string().max(400),
    _csrf: Joi.string()

}

module.exports = schema;