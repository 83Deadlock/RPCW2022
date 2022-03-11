var http = require('http');
var url = require('url');
var axios = require('axios');

function getAluno(id){
    return axios.get('http://localhost:3000/alunos/' + id)
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error){
        console.log(error);
    });
}

function getAlunos(){
    return axios.get('http://localhost:3000/alunos')
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getCursos(){
    return axios.get('http://localhost:3000/cursos')
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getInstrumentos(){
    return axios.get('http://localhost:3000/instrumentos')
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function generateStudentPage(res, ident){
    var page = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Alunos - ${ident}</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(30, 117, 74);">
            <p class="w3-text-blue"><a href="http://localhost:4000/alunos">Voltar</a></p>
        `
        getAluno(ident)
            .then(aluno => {

                page += `<p class="w3-container w3-center w3-text-white" style="font-size: 18px;">Nome: ${aluno.nome}<br>
                         ID: ${aluno.id}<br>
                         Data de Nascimento: ${aluno.dataNasc}<br>
                         Curso: ${aluno.curso}<br>
                         Ano do Curso: ${aluno.anoCurso}<br>
                         Instrumento: ${aluno.instrumento}</p>`

            page += '</body>\n</html>'
            res.write(page)
            res.end()
        });
}

function generatePage(res,sel){
    if(sel == "Alunos"){
        var selectedKeys = ['Id', 'Nome', 'Curso', 'Instrumento']
    } else if (sel == "Cursos"){
        var selectedKeys = ['Id', 'Designação', 'Duração', 'Instrumento_ID', 'Instrumento']
    } else if (sel == "Instrumentos"){
        var selectedKeys = ['Id', 'Instrumento']
    }
    var page = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola - ${sel}</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(30, 117, 74);">
            <p class="w3-text-blue"><a href="http://localhost:4000/">Voltar</a></p>
            <h1 class="w3-center" style="color: white;">Tabela de ${sel}</h1>
            <table class="w3-table-all w3-centered w3-hoverable w3-margin-top">
    `
    // Table head
    page += `
    <thead>
        <tr class="w3-light-grey">
    `
    for (let i = 0; i < selectedKeys.length; i++){
        page += '<th>' + selectedKeys[i] + '</th>\n'
    }
    page += '</tr></thead>'


    if(sel == "Alunos"){
        getAlunos()
            .then(alunos => {
            // Table rows for each student
            alunos.forEach( a => {
                page += '<tr>'
                page += '<td>' + a.id + `</td><td><a href="http://localhost:4000/alunos/${a.id}">` + a.nome + '</a></td><td>' + a.curso + '</td><td>' + a.instrumento + '</td>'
                page += '</tr>\n'
            });
            // Final html
            page += '</table>\n</body>\n</html>'
            res.write(page)
            res.end()
        });    
    } else if (sel == "Cursos"){
        getCursos()
            .then(cursos => {
            // Table rows for each student
            cursos.forEach( c => {
                page += '<tr>'
                page += '<td>' + c.id + '</td><td>' + c.designacao + '</td><td>' + c.duracao + '</td><td>' + c.instrumento.id + '</td><td>' + c.instrumento.text + '</td>'
                page += '</tr>\n'
            });
            // Final html
            page += '</table>\n</body>\n</html>'
            res.write(page)
            res.end()
        });
    } else if (sel == "Instrumentos"){
        getInstrumentos()
            .then(instrumentos => {
            // Table rows for each student
            instrumentos.forEach( i => {
                page += '<tr>'
                page += '<td>' + i.id + '</td><td>' + i.text + '</td>'
                page += '</tr>\n'
            });
            // Final html
            page += '</table>\n</body>\n</html>'
            res.write(page)
            res.end()
        });
    }
    
}

function generateMainPage(){
    var page = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Main Page</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container w3-center w3-text-white" style="background-color: rgb(30, 117, 74); margin-top: 20%;">
            <h1><a href=\"http://localhost:4000/alunos\">Alunos</a></h1>
            <h1><a href=\"http://localhost:4000/cursos\">Cursos</a></h1>
            <h1><a href=\"http://localhost:4000/instrumentos\">Instrumentos</a></h1>
        </body>
    </html>
    `
    return page;
}

http.createServer(function(req,res){
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myurl = url.parse(req.url,true)

    // Main Page
    if (myurl.pathname == '/'){
        res.writeHead(200,{'Content-Type':'text/html'})
        res.write(generateMainPage())
        res.end()
    } else if(myurl.pathname == "/alunos"){
        res.writeHead(200,{'Content-Type':'text/html'})
        generatePage(res,"Alunos")
    } else if(myurl.pathname == "/cursos"){
        res.writeHead(200,{'Content-Type':'text/html'})
        generatePage(res,"Cursos")
    } else if(myurl.pathname == "/instrumentos"){
        res.writeHead(200,{'Content-Type':'text/html'})
        generatePage(res,"Instrumentos")
    } else if(myurl.pathname.includes("/alunos/")){
        res.writeHead(200,{'Content-Type': 'text/html'})
        generateStudentPage(res,myurl.pathname.split("/")[2])
    } else {
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end("<p> Rota não suportada:" + req.url + "</p>")
    }
}).listen(4000);

console.log("Servidor à escuta na porta 4000");