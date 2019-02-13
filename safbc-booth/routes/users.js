var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users', {
    title: 'South African Financial Blockhain Consortium',
    subtitle: 'Users so far...',
    data: 'no users yet'
  });
});

module.exports = router;