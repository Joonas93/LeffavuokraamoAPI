
/*
Schema is used in SELECT queries
 */
const Joi = require('joi');

var year = new Date();
year = year.getFullYear()
const selectSchema = {
    name: Joi.string().max(100),
    length: Joi.number().integer().min(10).max(600),
    imdbUrl: Joi.string().max(100),
    genre: Joi.string().max(50),
    releaseYear: Joi.number().integer().min(1900).max(year),
    amountInStock: Joi.number().integer().min(0),
    plot: Joi.string().max(400),
    id: Joi.number().integer().min(0)
};

module.exports = selectSchema;