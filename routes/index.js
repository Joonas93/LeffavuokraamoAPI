var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { token: req.csrfToken() });
});

module.exports = router;
