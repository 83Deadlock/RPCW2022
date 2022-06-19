var express = require('express');
var router = express.Router();
var axios = require('axios')
var multer = require('multer')
var fs = require('fs');
const StreamZip = require('node-stream-zip');
var upload = multer({dest: 'uploadsProv'});
const JSZip = require('jszip');

var logins = []
var registos = []

/* GET home page. */

router.get('/homepage',function(req, res) {
  res.render('index');
});

router.get('/', verificaAutenticacao ,function(req, res) {
  axios.get('http://localhost:3001/api/noticiasUser' + "?token=" + req.cookies.token)
  .then(dados => {  
   if(req.level == 'producer') res.render('mainpage', {username: req.username, news: dados.data})
   if(req.level == 'consumer') res.render('mainpageConsumer', {username: req.username , news: dados.data})
   if(req.level == 'admin') res.render('mainpageAdmin' , {username: req.username , news: dados.data})
  })
  .catch(error => res.render('error', {error: error}))
});

router.get('/feed', verificaAutenticacao ,function(req, res, next) {
  axios.get("http://localhost:3001/api/recursos?token=" + req.cookies.token)
       .then(data => {

        for(user of logins){
        req.body.username = user
        req.body.action = "O utilizador " + user + " efetuou login "
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 0
    
        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
             .then()
             .catch(e => res.render('error', {error: e}))
        }

        for(user of registos){
          req.body.username = user
          req.body.action = "O utilizador " + user + " registou-se "
          req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
          req.body.visible = 0
      
          axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
               .then()
               .catch(e => res.render('error', {error: e}))
          }

        logins = []
        registos = []


        axios.get('http://localhost:3001/api/noticiasUser' + "?token=" + req.cookies.token)
             .then(dados => {
              if(req.level == 'producer') res.render('mainpage', {username: req.username, news: dados.data})
              if(req.level == 'consumer') res.render('mainpageConsumer', {username: req.username , news: dados.data})
              if(req.level == 'admin') res.render('mainpageAdmin' , {username: req.username , news: dados.data})
             })
             .catch(error => res.render('error', {error: error}))
       })
       .catch(error => res.render('error', {error: error}))
});

router.get('/login', function(req, res) {
  res.render('login-form')
});

router.get('/registo', function(req,res) {
  res.render('register-form')
})

router.get('/admin/registo', function(req,res) {
  if(req.level != "admin") res.redirect('/')
  else res.render('register-form-admin')
})

router.get('/logout', function(req, res) {
  res.cookie("token", undefined)
  res.clearCookie("token")
  res.redirect('/')
})


router.get('/favoritos', verificaAutenticacao, function(req, res) {
        axios.get('http://localhost:3001/api/recursos?user=' +  req.username + "&token=" + req.cookies.token)
             .then(data => {
                  if (data.data.length > 0) res.render('favoritos', {files: data.data, empty: false})
                  else res.render('favoritos', {files: data.data, empty: true})
  })
  .catch(error => res.render('error', {error: error}))
})


router.get('/deleteComment/:id', verificaAutenticacao, function(req, res) {
  axios.delete('http://localhost:3001/api/comentarios/' + req.params.id  + "?token=" + req.cookies.token)
       .then(() => res.redirect('/comments/' + req.query.filename))
       .catch(e => res.render('error', {error: e}))
})


router.get('/editComment/:id', verificaAutenticacao, function(req, res) {
      res.render('edit-comment-form', {id: req.params.id})
})

router.get('/comments/:filename', verificaAutenticacao ,function(req, res) {
  console.log(req.params.filename)
  axios.get('http://localhost:3001/api/comentarios/' + req.params.filename + "?token=" + req.cookies.token) 
       .then(data => {
        
            if(data.data.length > 0) res.render('comments' , {comentarios: data.data, recurso: req.params.filename, 
            empty:false, level: req.level, username: req.username})
            else res.render('comments' , {comentarios: data.data, recurso: req.params.filename, empty:true})
       })
       .catch(e => res.render('error', {error: e}))
})

router.get('/makeComment/:filename', verificaAutenticacao ,function(req, res) {
      res.render('comment-form', {recurso: req.params.filename})
})

router.get('/addLike/:filename', verificaAutenticacao ,function(req, res) {
  req.body.liked = req.username
  axios.post('http://localhost:3001/api/recursos/addLike/' + req.params.filename + "?token=" + req.cookies.token, req.body)
       .then(data => {

          req.body.username = req.body.liked
          req.body.action = "O utilizador " + req.body.liked + " gostou do recurso " + req.params.filename + " publicado por " + data.data.owner_submission
          req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
          req.body.visible = 1

          axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
               .then()
               .catch(e => res.render('error', {error: e}))

        res.redirect('/tipo/'+ req.query.tipo)
        
       })
       .catch(e => res.render('error', {error: e}))
})

router.get('/removeLike/:filename', verificaAutenticacao, function(req, res) {
  req.body.disliked = req.username
  axios.post('http://localhost:3001/api/recursos/removeLike/' + req.params.filename + "?token=" + req.cookies.token, req.body)
       .then(data = res.redirect('/tipo/'+ req.query.tipo))
       .catch(e => res.render('error', {error: e}))
})

router.get('/tipo/:tipo', verificaAutenticacao ,function(req, res, next) {
  if(req.params.tipo == "Tese" || req.params.tipo == "Slide" || req.params.tipo == "Ficha" || req.params.tipo == "Exame"){
    axios.get("http://localhost:3001/api/recursos?tipo=" + req.params.tipo + "&token=" + req.cookies.token)
       .then(data => {

        req.body.username = req.username
        req.body.action = "O utilizador " + req.username + " consultou os recursos do tipo " + req.params.tipo
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 0
    
        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
             .then()
             .catch(e => res.render('error', {error: e}))

        if(data.data.length > 0){
          res.render('tipo', {files: data.data, empty: false, tipo: req.params.tipo, level: req.level, username: req.username})
        }
        else res.render('tipo', {empty: true, tipo: req.params.tipo})

       })
       .catch(error => res.render('error', {error: error}))
      }
  else 
  {
    res.redirect('/')
  }
});


router.get('/admin/users', function (req, res) {
  if(req.level != 'admin') res.redirect('/feed')
  else {
    axios.get('http://localhost:3003/users')
         .then(data => {
          if (data.data.dados.length > 0) res.render('usersAdmin', {users: data.data.dados, empty: false})
          else res.render('usersAdmin', {users: data.data.dados, empty: true})
         })
         .catch(error => res.render('error', {error: error}))
  }
})

router.get('/admin/stats', function (req, res) {
  if(req.level != 'admin') res.redirect('/feed')
  else {
    axios.get('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token)
         .then(data => {
          if (data.data.length > 0) res.render('newsAdmin', {news: data.data, empty: false})
          else res.render('newsAdmin', {news: data.data, empty: true})
         })
         .catch(error => res.render('error', {error: error}))
  }
})

router.get('/admin/recursos', function (req, res) {
  if(req.level != 'admin') res.redirect('/feed')
  else {
    axios.get('http://localhost:3001/api/recursos' + "?token=" + req.cookies.token)
         .then(data => {
          if (data.data.length > 0) res.render('recursosAdmin', {files: data.data, empty: false})
          else res.render('recursosAdmin', {files: data.data, empty: true})
         })
         .catch(error => res.render('error', {error: error}))
  }
})

router.get('/admin/deleteAll', function (req, res) {
  if(req.level != 'admin') res.redirect('/feed')
  else {
    axios.get('http://localhost:3001/api/noticias/deleteAll' + "?token=" + req.cookies.token)
         .then(data => {
              res.redirect('/admin/stats')
         })
         .catch(error => res.render('error', {error: error}))
  }
})


function checkInfo(info, res){
    var files = []
    var path = __dirname + '/../uploads/' + info.type + '/' + info.filename

    fs.readFile(path, function(e, data){
      if(e) res.render('error', {error: e})
      JSZip.loadAsync(data)
           .then(function(zip) {
            Object.keys(zip.files).forEach(function (filename){

              if(filename != 'RRD-SIP.json'){
                var objeto = {}
                objeto[filename] = zip.files[filename].async("nodebuffer")
                files.push(objeto) 
              }
            })

            const jszip = new JSZip()

            try{
              for(const file of files){
                jszip.file(Object.keys(file)[0], Object.values(file)[0])
              }

              var newInfo = {}
              newInfo.date_creation = info.date_creation
              newInfo.producer = info.producer
              newInfo.title = info.title
              newInfo.type = info.type

              console.log(newInfo)

              jszip.file("RRD-SIP.json", JSON.stringify(newInfo))
              jszip.generateNodeStream({type: "nodebuffer", streamFiles: true})
                   .pipe(fs.createWriteStream(path))
                   .on("finish", function(){
                    res.download( __dirname + '/../uploads/' + info.type + '/' + info.filename)
                  })
            } catch(e) {
              res.render('error', {error: e})
            }
           })
    })
}


router.get('/download/:filename', verificaAutenticacao ,function(req,res) {
  axios.get('http://localhost:3001/api/recursos/' + req.params.filename + "?token=" + req.cookies.token)
    .then(data =>
      {
        checkInfo(data.data, res)
        req.body.username = req.username
        req.body.action = "O utilizador " + req.username + " fez download do ficheiro " + req.params.filename
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 0

        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
             .then()
             .catch(e => res.render('error', {error: e}))


      }) 
    .catch(e => res.render('error', {error: e}))
});

router.get('/admin/downloadLogs', function (req, res) {
  if(req.level != 'admin') res.redirect('/feed')
  else {
    axios.get('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token)
         .then(data => {
          var info = JSON.stringify(data.data, null, 4)
          try {
            fs.writeFileSync(__dirname + '/../uploads/Logs/logs.json', info);
            if (data.data.length > 0) res.render('newsAdmin', {news: data.data, empty: false, sucesso: true})
            else res.render('newsAdmin', {news: data.data, empty: true, sucesso: true})
             } catch (error) {
            console.error(err);
            }
            
         })
         .catch(error => res.render('error', {error: error}))
  }
})



function verificaDuplicado(req, res, next){
  erros = []
  axios.get('http://localhost:3001/api/recursos/' + req.file.originalname + "?token=" + req.cookies.token)
       .then(data => {
        if(data.data != null){
          erros.push("Título já existente! Por favor, altere o título do ficheiro ZIP")
          res.render('erroUpload', {erro: erros})
          let oldPath =  __dirname + '/../' + req.file.path
          try
          {
            fs.unlinkSync(oldPath)
          } catch(e){
            console.log(e)
          }
        }
        else next()
       })
       .catch(error => res.render('error', {error: error}))
}

router.post('/insert', upload.single('myFile'), verificaDuplicado , function(req, res, next){

  valid = true
  manisfestoBagIT = {exist: true, valid: true}
  metadados = {exist: true, valid: true, tipo: true}

  ficheirosZip = []
  allFiles = []
  objeto = {} 

  erros = []

  if(req.file.mimetype == 'application/zip' || req.file.mimetype == "application/x-zip-compressed"){
    var zip = new StreamZip({
      file:req.file.path,
      storeEntries: true
    })  

  zip.on('ready', () => {
    for (const entry of Object.values(zip.entries())){
      allFiles.push(entry.name)
      if(entry.name != "manifest.txt" && entry.name != "RRD-SIP.json"){
        ficheirosZip.push(entry.name)
        var extension = entry.name.split(".")[1]
        if(extension != 'xml' && extension != 'pdf'){
          valid = false
          erros.push("Os ficheiros só podem ter o tipo PDF ou XML")
        }
      }
    }

    if(allFiles.includes("manifest.txt")){
      manifest = zip.entryDataSync("manifest.txt").toString('utf8')
      files = manifest.split('|')
      for(file of ficheirosZip){
        if(!files.includes(file)){
          valid = false
          manisfestoBagIT.valid = false
        }
      }
    } else
    {
      valid = false
      manisfestoBagIT.exist = false
    }

    if(allFiles.includes("RRD-SIP.json")){
      jsonfile = zip.entryDataSync("RRD-SIP.json").toString('utf8')
      metainfo = JSON.parse(jsonfile)

      if(!(metainfo.hasOwnProperty('date_creation') && metainfo.hasOwnProperty('producer') && metainfo.hasOwnProperty('title') && metainfo.hasOwnProperty('type'))){
        valid = false
        metadados.valid = false
      }

      if(metainfo.type != 'Tese' && metainfo.type != 'Ficha' && metainfo.type != 'Exame' && metainfo.type != 'Slide'){
        valid = false
        metadados.tipo = false
      }

    } else
    {
      valid = false
      metadados.exist = false
    }
    if(valid)
    {
      metadados = zip.entryDataSync("RRD-SIP.json").toString('utf-8');
      objeto = JSON.parse(metadados)
      req.body.date_creation = objeto.date_creation
      req.body.date_submission = new Date().toISOString().slice(0, 19).split('T').join(' ')
      req.body.producer = objeto.producer
      req.body.owner_submission = req.username
      req.body.title = objeto.title
      req.body.type = objeto.type
      req.body.filesZip = ficheirosZip
      zip.close()
      next()
    }
    else
    {
      if(!manisfestoBagIT.exist) erros.push("Não existe o ficheiro manifesto.txt")
      if(!manisfestoBagIT.valid) erros.push("O ficheiro manifesto.txt não se encontra válido")
      if(!metadados.exist) erros.push("Não existe o ficheiro RRD-SIP.json")
      if(!metadados.valid) erros.push("O ficheiro RRD-SIP.json não se encontra válido")
      if(!metadados.tipo){
        erros.push("O tipo do recurso não é suportado pela plataforma.")
        erros.push("Apenas serão suportadas Teses, Fichas, Exames e Slides")
      }

      res.render('erroUpload', {erro: erros})

      let oldPath =  __dirname + '/../' + req.file.path
      try
      {
        fs.unlinkSync(oldPath)
      } catch(e){
        console.log(e)
      }
    }
});

} else {
  erros.push("Não é um ficheiro ZIP")
  next()
}
}, function(req, res){

    if(erros.length == 0){

    let oldPath =  __dirname + '/../' + req.file.path
    let newPath = __dirname + '/../uploads/' + req.body.type + '/' + req.file.originalname

    req.body.filename = req.file.originalname

    fs.rename(oldPath,newPath, erro =>{
    if(erro) res.render('error',{error:erro})
    else
    {
      axios.post('http://localhost:3001/api/recursos' + "?token=" + req.cookies.token, req.body)
      .then(data => {

        req.body.username = req.username
        req.body.action = "O utilizador " + req.username + " inseriu o ficheiro " + req.file.originalname + " do tipo " + req.body.type
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 1

        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
             .then()
             .catch(e => res.render('error', {error: e}))

        axios.get('http://localhost:3001/api/noticiasUser' + "?token=" + req.cookies.token)
             .then(dados => {
              if(req.level == 'producer') res.render('mainpage', {username: req.username, news: dados.data, sucesso: "Sucesso no upload"})
              if(req.level == 'admin') res.render('mainpageAdmin' , {username: req.username , news: dados.data, sucesso: "Sucesso no upload"})
             })
             .catch(error => res.render('error', {error: error}))
      })
      .catch(error => res.render('error', {error: error}))
    }
  })
} else
{
  let oldPath =  __dirname + '/../' + req.file.path
  try
  {
    fs.unlinkSync(oldPath)
  } catch(e){
    console.log(e)
  }
  res.render('erroUpload', {erro: erros})
}
});

router.post('/delete/:filename', verificaAutenticacao ,function(req, res) {
  axios.delete('http://localhost:3001/api/recursos/remove/' + req.params.filename + "?token=" + req.cookies.token)
  .then(data => {
    path =  __dirname + '/../uploads/' + data.data.type + '/' + data.data.filename
    fs.unlink(path, erro => {
      if(erro) res.render('error', {error:erro})
    })


    req.body.username = req.username
    req.body.action = "O utilizador " + req.username + " eliminou o ficheiro " + req.params.filename + " do tipo " + data.data.type
    req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
    req.body.visible = 1

    axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
         .then()
         .catch(e => res.render('error', {error: e}))



    res.redirect('/tipo/' + data.data.type)
  })
  .catch(erro => {res.render('error',{error:erro})})
});

router.post('/admin/delete/:filename', verificaAutenticacao  ,function(req, res) {
  axios.delete('http://localhost:3001/api/recursos/remove/' + req.params.filename + "?token=" + req.cookies.token)
  .then(data => {
    path =  __dirname + '/../uploads/' + data.data.type + '/' + data.data.filename
    fs.unlink(path, erro => {
      if(erro) res.render('error', {error:erro})
    })

    req.body.username = req.username
    req.body.action = "O admin " + req.username + " eliminou o ficheiro " + req.params.filename + " do tipo " + data.data.type + " na página de admnistração"
    req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
    req.body.visible = 0

    axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
         .then()
         .catch(e => res.render('error', {error: e}))

    res.redirect('/admin/recursos')
  })
  .catch(erro => {res.render('error',{error:erro})})
});

router.post('/admin/user/delete/:username', verificaAutenticacao  ,function(req, res) {
  axios.delete('http://localhost:3003/users/remove/' + req.params.username)
       .then(data =>  {
        

        req.body.username = req.username
        req.body.action = "O admin " + req.username + " eliminou o utilizador " + req.params.username
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 0
    
        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
             .then()
             .catch(e => res.render('error', {error: e}))
        
        res.redirect('/admin/users')
      })
       .catch(erro => {res.render('error',{error:erro})})
});


router.post('/admin/news/delete/:id', verificaAutenticacao  ,function(req, res) {
  axios.delete('http://localhost:3001/api/noticias/remove/' + req.params.id + "?token=" + req.cookies.token)
       .then(data =>  {
        res.redirect('/admin/stats')
      })
       .catch(erro => {res.render('error',{error:erro})})
});

router.post('/admin/news/visibleV/:id', verificaAutenticacao  ,function(req, res) {
  axios.get('http://localhost:3001/api/noticias/editV/' + req.params.id + "?token=" + req.cookies.token)
       .then(data =>  {
        res.redirect('/admin/stats')
      })
       .catch(erro => {res.render('error',{error:erro})})
});

router.post('/admin/news/visibleI/:id', verificaAutenticacao  ,function(req, res) {
  axios.get('http://localhost:3001/api/noticias/editI/' + req.params.id + "?token=" + req.cookies.token)
       .then(data =>  {
        res.redirect('/admin/stats')
      })
       .catch(erro => {res.render('error',{error:erro})})
});


router.post('/search', verificaAutenticacao  ,function(req, res){
  axios.get('http://localhost:3001/api/recursos?q=' + req.body.word + "&token=" + req.cookies.token)
  .then(data => {

    req.body.username = req.username
    req.body.action = "O utilizador " + req.username + " procurou ficheiros com a palavra  " + req.body.word
    req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
    req.body.visible = 0

    axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
         .then()
         .catch(e => res.render('error', {error: e}))

    if(data.data.length > 0){
      res.render('search', {files: data.data, empty: false, word: req.body.word})
    }
    else res.render('search', {empty: true, word: req.body.word})

   })
   .catch(error => res.render('error', {error: error}))
})

router.post('/login',function(req, res) {
  axios.post('http://localhost:3003/users/login', req.body)
    .then(dados =>{
      res.cookie('token', dados.data.token, {
        expires: new Date(Date.now() + '1h'),
        secure: false,
        httpOnly: true
      });
      logins.push(req.body.username)
      res.redirect('/feed')
    })
    .catch(e => {
      if (e.message === "Request failed with status code 401"){
        res.render('login-form', {error : e.message})
      }
      else res.redirect('/login')
    }
    )
});

router.post('/registo',function(req, res) {
    if(req.body.level == undefined)
    {
      res.render('register-form', {level: "level"})
    }
    else
    {
      axios.post('http://localhost:3003/users/registo', req.body)
      .then(data =>{
        if(data.data.repetido){
          res.render('register-form', {error: data.data.repetido})
        }
        else
        { 
          registos.push(req.body.username)
          res.redirect('/login')
        }
      })
      .catch(e => res.render('error', {error: e}))
    }
});

router.post('/admin/registo', verificaAutenticacao ,function(req, res) {
  if(req.body.level == undefined)
  {
    res.render('register-form-admin', {level: "level"})
  }
  else
  {
    axios.post('http://localhost:3003/users/registo', req.body)
    .then(data =>{
      if(data.data.repetido){
        res.render('register-form-admin', {error: data.data.repetido})
      }
      else
      {
        var newUser = req.body.username
        req.body.username = req.username
        req.body.action = "O admin " + req.username + " registou o novo utilizador " + newUser
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 0
    
        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
             .then()
             .catch(e => res.render('error', {error: e}))

        res.redirect('/admin/users')
      }
    })
    .catch(e => res.render('error', {error: e}))
  }
});

router.post('/editar/completo', verificaAutenticacao ,function(req, res) {
  axios.put('http://localhost:3001/api/recursos?filename=' + req.query.filename + "&tipo=" + req.body.tipo + "&token=" + req.cookies.token)
       .then(dados => 
        {

        req.body.username = req.username
        req.body.action = "O utilizador " + req.username + " atualizou o ficheiro " + req.query.filename + " para o tipo " + req.body.tipo
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 1
      
        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
               .then()
               .catch(e => res.render('error', {error: e}))

        res.render('editaRecurso', {recurso: dados.data, sucesso: true})

        let oldPath = __dirname + '/../uploads/' + req.query.tipo + '/' + req.query.filename
        let newPath = __dirname + '/../uploads/' + req.body.tipo + '/' + req.query.filename

        console.log(oldPath)
        console.log(newPath)

       fs.renameSync(oldPath,newPath)
       }
       )
      .catch(e => res.render('error', {error: e}))
});

router.post('/editar/user/completo', verificaAutenticacao, verificaUsername ,function(req, res) {
  axios.put('http://localhost:3003/users/editar?username=' + req.query.username +"&uname=" + req.body.uname)
       .then(dados => 
        {
          res.render('editaUser', {user: dados.data, sucesso: true})
        }
       )
      .catch(e => res.render('error', {error: e}))
});

router.post('/editar/user/name/completo', verificaAutenticacao ,function(req, res) {
  axios.put('http://localhost:3003/users/editar?username=' + req.query.username +"&name=" + req.body.name)
       .then(dados => 
        {
          res.render('editaUser', {user: dados.data, sucesso: true})
        }
       )
      .catch(e => res.render('error', {error: e}))
});

router.post('/editar/:filename', verificaAutenticacao ,function(req, res) {
  axios.get('http://localhost:3001/api/recursos/' + req.params.filename + "?token=" + req.cookies.token)
       .then(dados => res.render('editaRecurso', {recurso: dados.data}))
       .catch(e => res.render('error', {error: e}))
})

router.post('/editar/user/:username', verificaAutenticacao ,function(req, res) {
  axios.get('http://localhost:3003/users/' + req.params.username)
       .then(dados => res.render('editaUser', {user: dados.data.dados[0]}))
       .catch(e => res.render('error', {error: e}))
})


router.post('/newComentario/:filename', verificaAutenticacao ,function(req, res) {
  req.body.username = req.username
  req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
  req.body.filename = req.params.filename
  axios.post('http://localhost:3001/api/comentarios' + "?token=" + req.cookies.token, req.body)
       .then(dados =>{

        req.body.username = req.username
        req.body.action = "O utilizador " + req.username + " comentou o recurso " + req.params.filename
        req.body.date = new Date().toISOString().slice(0, 19).split('T').join(' ')
        req.body.visible = 1
      
        axios.post('http://localhost:3001/api/noticias' + "?token=" + req.cookies.token, req.body)
               .then()
               .catch(e => res.render('error', {error: e}))


        res.redirect('/comments/' + req.params.filename)
       })
       .catch(e => res.render('error', {error: e}))
})


router.post('/editComment/:id', verificaAutenticacao ,function(req, res){
    axios.put('http://localhost:3001/api/comentarios/' + req.params.id + "?token=" + req.cookies.token + "&desc=" + req.body.descricao)
         .then(dados => res.redirect('/comments/' + dados.data.filename))
         .catch(e => res.render('error', {error: e}))
})


function verificaAutenticacao(req,res,next){
  if(!req.cookies.token){
    res.redirect('/homepage')
  } else{
    next();}
}

function verificaUsername(req, res, next){
  axios.get('http://localhost:3003/users/' + req.body.uname)
       .then(dados => {
        if(dados.data.dados[0] == undefined) next()
        else 
        {
          axios.get('http://localhost:3003/users/' + req.query.username)
          .then(dados => res.render('editaUser', {user: dados.data.dados[0], error: true}))
          .catch(e => res.render('error', {error: e}))
        }
       })
       .catch(e => res.render('error', {error: e}))
}

module.exports = router;
