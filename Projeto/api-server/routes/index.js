var express = require('express');
var router = express.Router();
var File = require('../controllers/metadata')


/* GET home page. */
router.get('/recursos', function(req, res) {
  if(req.query['tipo'] != undefined)
  {
    File.listTipo(req.query['tipo'])
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(501).jsonp({erro: e}))
  }

  else if(req.query['q'] != undefined)
  {
    File.listPalavra(req.query['q'])
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(502).jsonp({erro: e}))
  }

  else if(req.query['user'] != undefined)
  {
    File.listFavoritos(req.query['user'])
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(503).jsonp({erro: e}))
  }

  else
  {
  File.list()
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(504).jsonp({erro: e}))
  }
});


router.get('/noticias', function(req, res){
  if(req.level == "admin"){
  File.listaNoticia()
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(505).jsonp({erro: e}))
  } else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.get('/noticiasUser', function(req, res){
  File.listaNoticiaUsers()
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(506).jsonp({erro: e}))
});

router.get('/recursos/:filename', function(req, res){
  File.lookUpFile(req.params.filename)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(507).jsonp({erro: e}))
});

router.delete('/recursos/remove/:filename', function(req, res){
  if(req.level != "consumer"){
  File.lookUpFile(req.params.filename)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(508).jsonp({erro: e}))
  
  File.deleteFile(req.params.filename)
  .then(() => res.status(200))
  .catch(e => res.status(509).jsonp({erro: e}))
} else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.post('/recursos', function(req, res){
  if(req.level != "consumer"){
  File.insert(req.body)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(510).jsonp({erro: e}))
  } else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.put('/recursos', function(req, res){
    if(req.level != "consumer"){
    File.updateFile(req.query.filename, req.query.tipo)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(511).jsonp({erro: e}))
    } else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.post('/recursos/addLike/:filename', function(req, res){
    console.log(req.params.filename)
    File.addLike(req.params.filename, req.body.liked)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(512).jsonp({erro: e}))
});

router.post('/recursos/removeLike/:filename', function(req, res){
  File.removeLike(req.params.filename, req.body.disliked)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(513).jsonp({erro: e}))
});

router.post('/noticias', function(req, res){
  File.insertNoticia(req.body)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(514).jsonp({erro: e}))
});


router.delete('/noticias/remove/:id', function(req, res){
  if(req.level == "admin"){
  File.deleteNoticia(req.params.id)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(515).jsonp({erro: e}))
  } else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.get('/noticias/deleteAll', function(req, res){
  if(req.level == "admin"){
  File.deleteAll()
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(516).jsonp({erro: e}))
  } else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.get('/noticias/editV/:id', function(req, res){
  if(req.level == "admin"){
  File.editaNoticiaV(req.params.id)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(517).jsonp({erro: e}))
  } else {res.status(520).jsonp({erro: "Sem permissões"})}
});

router.get('/noticias/editI/:id', function(req, res){
  if(req.level == "admin"){
  File.editaNoticiaI(req.params.id)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(518).jsonp({erro: e}))
  } else {res.status(520).jsonp({erro: "Sem permissões"})}
});


router.get('/comentarios/:filename', function(req, res){
  File.listaComentario(req.params.filename)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(519).jsonp({erro: e}))
});

router.post('/comentarios', function(req, res){
  File.insertComentario(req.body)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(521).jsonp({erro: e}))
});

router.delete('/comentarios/:id', function(req, res){
  File.deleteComentario(req.params.id)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(522).jsonp({erro: e}))
});

router.put('/comentarios/:id', function(req, res){
  File.updateComentario(req.params.id, req.query.desc)
      .then(data => res.status(200).jsonp(data))
      .catch(e => res.status(523).jsonp({erro: e}))
});

module.exports = router;
