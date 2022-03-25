var express = require('express');
var router = express.Router();
var axios = require('axios')
var bodyParser = require('body-parser')

function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

/* GET musics listing. */
router.get('/', function(req, res, next) {
    axios.get("http://localhost:3000/musicas")
    .then( response => {
        let a = response.data
        res.render('musicas',{musicas:a});
    })
    .catch(function(erro){
        res.render('error',{error:erro});
    })
});

router.get('/insert',function(req,res,next){
    res.render('forms')
});

router.post('/',function(req,res,next){
    console.log("POST de musica " + JSON.stringify(req.body))
    axios.post("http://localhost:3000/musicas", req.body)
    axios.get("http://localhost:3000/musicas")
    .then(response => {
        let a = response.data
        res.render('musicas',{musicas:a})
    })
    .catch(function(erro){
        res.render('error' , {error : erro})
        })
});

router.get('/:id',function(req,res,next){
    var idMusica = req.params.id
    console.log(idMusica)
    axios.get("http://localhost:3000/musicas/" + idMusica)
    .then( response => {
        let a = response.data
        res.render('musica',{musica:a});
    })
    .catch(function(erro){
        res.render('error',{error:erro});
    })
});

router.get('/prov/:prov',function(req,res,next){
    var idProv = req.params.prov
    console.log(idProv)
    axios.get("http://localhost:3000/musicas?prov=" + idProv)
    .then( response => {
        let a = response.data
        res.render('provincia',{provincia:a});
    })
    .catch(function(erro){
        res.render('error',{error:erro});
    })
});

module.exports = router;