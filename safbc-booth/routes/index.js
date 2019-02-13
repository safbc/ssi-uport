var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'South African Financial Blockhain Consortium',
    subtitle: 'Self-Sovereign Identiy Demo'
  })
});

module.exports = router;