var http = require('http')
var fs = require('fs')

http.createServer(function(req,res){
    var myurl = req.url.substring()
    console.log("URL -> " + myurl)
    if(myurl == "/"){
        console.log("\t->Home page requested")
        fs.readFile("./html/index.html", function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'})
            if(err){
                res.write("<p>Erro na leitura do ficheiro</p>")
            } else {
                res.write(data)
            }
            res.end()
        })
    } else if(myurl == "/filmes"){
        console.log("\t->Movies page requested")
        fs.readFile("./html/filmes.html", function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'})
            if(err){
                res.write("<p>Erro na leitura do ficheiro</p>")
            } else {
                res.write(data)
            }
            res.end()
        })
    } else if(myurl == "/atores"){
        console.log("\t->Actors page requested")
        fs.readFile("./html/atores.html", function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'})
            if(err){
                res.write("<p>Erro na leitura do ficheiro</p>")
            } else {
                res.write(data)
            }
            res.end()
        })
    } else if(myurl.includes("/filmes")){
        var aux = myurl.substring(9)
        console.log("\t\t->Movie " + aux + " page requested")
        fs.readFile("./html/f" + aux + ".html", function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'})
            if(err){
                res.write("<p>Erro na leitura do ficheiro</p>")
            } else {
                res.write(data)
            }
            res.end()
        })
    } else if(myurl.includes("/atores")){
        var aux = myurl.substring(9)
        console.log("\t\t->Ator " + aux + " page requested")
        fs.readFile("./html/a" + aux + ".html", function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'})
            if(err){
                res.write("<p>Erro na leitura do ficheiro</p>")
            } else {
                res.write(data)
            }
            res.end()
        })
    } else {
        console.log("Bad page requested")
        fs.readFile("./html/f" + aux + ".html", function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'})
            if(err){
                res.write("<p>Erro na leitura do ficheiro</p>")
            } else {
                res.write(data)
            }
            res.end()
        })
    }
}).listen(7777)

console.log("Servidor à escuta na porta 7777")