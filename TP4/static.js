/*
    Module Static - to serve static resources in public folder
    Exports: 
        Bool recursoEstatico(request) - tells if someone is asking a static resource
        Data sirvoRecursoEstatico(req, res) - returns the resource
*/

var fs = require('fs')

function recursoEstatico(request){
    return /\/w3.css$/.test(request.url) || 
                /\/favicon.png$/.test(request.url) ||
                /\/student.png$/.test(request.url)
}

exports.recursoEstatico = recursoEstatico

function sirvoRecursoEstatico(req, res){
    var partes = req.url.split('/')
    var file = partes[partes.length -1 ]
    fs.readFile('res/' + file, (erro, dados)=>{
        if(erro){
            console.log('Erro: ficheiro nÃ£o encontrado ' + erro)
            res.statusCode = 404
            res.end()
        }
        else{
            if(file == 'favicon.ico')
                res.setHeader('Content-Type', 'image/x-icon')
            res.end(dados)
        }
    })
}

exports.sirvoRecursoEstatico = sirvoRecursoEstatico