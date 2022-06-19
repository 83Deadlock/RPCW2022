var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')

var User = require('../controllers/user')

router.get('/', function(req, res){
  User.listar()
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(501).jsonp({error: e}))
})

router.get('/:username', function(req, res){
  User.lookUp(req.params.username)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(502).jsonp({error: e}))
})

router.post('/registo', function(req, res){
  User.consultar(req.body.username)
      .then(dados => {
        if(dados == null){
          User.inserir(req.body)
              .then(dados => res.status(201).jsonp({dados: dados}))
              .catch(e => res.status(503).jsonp({error: e}))
        }
        else
        {
          res.status(200).jsonp({repetido: "O username já existe!"})
        }
      })
      .catch(e =>{
        res.status(504).jsonp({error: e})
      })
})
  
router.post('/login', passport.authenticate('local'), function(req, res){
  jwt.sign({ username: req.user.username, level: req.user.level}, 
    "RPCW2022",
    {expiresIn: "1d"},
    function(e, token) {
      if(e) res.status(505).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
});
})


router.delete('/remove/:username', function(req, res){
      User.remover(req.params.username)
          .then(dados => res.status(200).jsonp({dados: dados}))
          .catch(e => res.status(506).jsonp({erro: e}))
})

router.put('/editar', function(req, res){

  if(req.query.uname != undefined){
  User.alterarUsername(req.query.username, req.query.uname)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(507).jsonp({erro: e}))
  }

  if(req.query.name != undefined){
    User.alterarName(req.query.username, req.query.name)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(508).jsonp({erro: e}))
    }
  
})

module.exports = router;