var express = require('express');
var router = express.Router();


const csurf = require('../node_modules/csurf');
const csrfMiddleware = csurf({
    cookie: true
});
router.use(csrfMiddleware);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { token: req.csrfToken() });
});

module.exports = router;
