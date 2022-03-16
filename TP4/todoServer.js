var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')


// Funções Auxiliares
// Retrieves student info from request body
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            callback(parse(body))
        })
    }
}

// Gera confirmação do post
function geraPostConfirm(){
    return `
    <html>
    <head>
        <title>Registo de uma Task</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header>
                <h1>Task inserida!</h1>
            </header>
        </div>

        <div class"w3-container">
            <p><a href="/">Aceda aqui à sua página.</a></p>
        </div>
    </body>
</html>
    `
}

///////////////////////////////////////////////////////////TP4
function geraPagina(data, d){
    dd = d.substring(8,10)
    mm = d.substring(5,7)
    yy = d.substring(0,4)
    html = `
    
    <html>
        <head>
            <title>TODO</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>Add Task</h2>
            </div>

            <form class="w3-container" action="/tasks/insert" method="POST">
            <div class ="w3-row-padding">
                <div class="w3-third">
                    <label class="w3-text-teal">Task</label>
                    <input class="w3-input w3-light-grey" type="text" name="Task">
                </div>
                <div class="w3-third">
                    <label class="w3-text-teal">Type</label>
                    <input class="w3-input w3-light-grey" type="text" name="Type">
                </div>
                <div class="w3-third">
                    <label class="w3-text-teal">Author</label>
                    <input class="w3-input w3-light-grey" type="text" name="Author">
                </div>
            </div>
            <div class ="w3-row-padding">
                <div class="w3-half">
                <label class="w3-text-teal">Created</label>
                <input class="w3-input w3-light-grey" type="date" name="DateCreated" value="${yy}-${mm}-${dd}">
                </div>
                <div class="w3-half">
                <label class="w3-text-teal">Due Date</label>
                <input class="w3-input w3-light-grey" type="date" name="DateDue" value="${yy}-${mm}-${dd}">
                </div>
            </div>
            <div class ="w3-row-padding w3-padding-16">
                <input class="w3-btn w3-blue-grey" type="submit" value="Submit"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Reset"/> 
            </div>
  
                
            </form>
            <div class="w3-cell-row">
            <div class="w3-container w3-cell">

                <div class="w3-container w3-center w3-teal">
                    <h2>TODO Tasks</h2>
                </div>
                <table class="w3-table w3-bordered w3-white">
                    <tr>
                        <th>Task</th>
                        <th>Type</th>
                        <th>Author</th>
                        <th>Created</th>
                        <th>Due Date</th>
                    </tr>
    `

    data.forEach(
        reg => {
            if(reg.Status == "TODO"){
                html += '<tr>'
                html += `<td>${reg.Task}</td>`
                html += `<td>${reg.Type}</td>`
                html += `<td>${reg.Author}</td>`
                html += `<td>${reg.DateCreated}</td>`
                html += `<td>${reg.DateDue}</td>`
                html += '</tr>'
            }  
        }
    )

    html += `   </table>
                </div>
    
                <div class="w3-container w3-cell">
                <div class="w3-container w3-center w3-teal">
                    <h2>Done Tasks</h2>
                </div>
            <table class="w3-table w3-bordered w3-white">
                <tr>
                    <th>Task</th>
                    <th>Type</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th>Due Date</th>
                </tr>
`

data.forEach(
    reg => {
        if(reg.Status == "Done"){
            html += '<tr>'
            html += `<td>${reg.Task}</td>`
            html += `<td>${reg.Type}</td>`
            html += `<td>${reg.Author}</td>`
            html += `<td>${reg.DateCreated}</td>`
            html += `<td>${reg.DateDue}</td>`
            html += '</tr>'
        } 
    }
)

html += `   </table>
                </div>
            </div> 
        </body>
    </html>
    `
    return html
}

// Criação do servidor

var todoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req,res)
    }else{
        // Tratamento do pedido
        switch(req.method){
            case "GET": 
                // GET /alunos --------------------------------------------------------------------
                if((req.url == "/")){
                    axios.get("http://localhost:3000/tasks")
                        .then(response => {
                            var respData = response.data
                            // Add code to render page with the student's list
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagina(respData,d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de alunos...")
                            res.end()
                        })


                }
                // GET /alunos/:id --------------------------------------------------------------------
                else if(/\/alunos\/(A|PG)[0-9]+$/.test(req.url)){
                    var idAluno = req.url.split("/")[2]
                    axios.get("http://localhost:3000/alunos?id=" + idAluno)
                        .then( response => {
                            let a = response.data
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagAluno(a[0],d))
                            res.end()
                        })
                }
                // GET /alunos/registo --------------------------------------------------------------------
                else if(req.url == "/alunos/registo"){
                    // Add code to render page with the student form
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraFormAluno(d))
                    res.end()
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url == '/tasks/insert'){
                    recuperaInfo(req, resultado => {
                        console.log("POST de aluno " + JSON.stringify(resultado))
                        resultado['Status'] = "TODO"
                        axios.post("http://localhost:3000/tasks", resultado)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm())
                            res.end()
                        })
                        .catch( erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Recebi um POST não suportado.</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

todoServer.listen(7777)
console.log('Servidor à  escuta na porta 7777...')