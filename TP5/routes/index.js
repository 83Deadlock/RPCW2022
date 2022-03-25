var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:3000/musicas')
  .then(response => {
    let a = response.data;
    res.render('musicas',{musicas:a});
  })
  .catch(function(erro){
    res.render('error',{error:erro})
  })
});

module.exports = router;