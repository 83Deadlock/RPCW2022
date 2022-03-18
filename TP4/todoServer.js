const http = require('http')
const axios = require('axios')
const fs = require('fs')
const static = require('./static.js')
const {parse} = require('querystring')

// Retrieves student info from request body
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

function generatePage(tarefas, d){
    var done_tasks = []
    var todo_tasks = []
    tarefas.forEach(
        t => {
            if(t.status == 'realizar'){
                todo_tasks.push(t)
            }else{
                done_tasks.push(t)
            }
        }
    )
    // console.log(todo_tasks)
    let htmlPage = `
    <html>
        <head>
            <title>ToDo List</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <link rel="stylesheet" href="font.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal w3-padding-16">
                TODO LIST
            </div>

            <form class="w3-container w3-padding-16" action="/tarefas/insert" method="POST">
                <div class="w3-row-padding">
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Task</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="tarefa">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Type</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="tipo">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Deadline</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="date" name="deadline">
                    </div>
                </div>
                <div class="w3-row-padding">
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Author</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" name="target">
                    </div>
                </div>
                <div class="w3-row-padding w3-padding-16">
                    <input class="w3-btn w3-blue-grey" type="submit" value="Submit"/>
                    <input class="w3-btn w3-blue-grey" type="reset" value="Reset"/> 
                </div>
            </form>
`
    htmlPage += `
            <div class="w3-row w3-teal">
                <div class="w3-col l6 6 w3-center">
                    TODO Tasks`

    keys = ['Task','Type','Created','Deadline','Author']

    htmlPage += '<table class="w3-table-all w3-centered w3-light-grey">\n<thead>\n<tr>'
    for(let i=0; i<keys.length;i++){
        htmlPage += `<th>${keys[i]}</th>`
    }
    htmlPage += '</tr></thead>'

    todo_tasks.forEach(t => {
                htmlPage += `
                    <tr>
                        <td>${t.tarefa}</td>
                        <td>${t.tipo}</td>
                        <td>${t.data_criada}</td>
                        <td>${t.deadline}</td>
                        <td>${t.target}</td>
                        <td>
                            <form action="/tarefas/${t.id}/check" method="POST">
                                <input class="w3-circle w3-round-large w3-light-green" type="submit" value="Done"/>
                            </form>
                        </td>
                        <td>
                            <form action="/tarefas/${t.id}/edit" method="POST">
                                <input class="w3-circle w3-round-large w3-light-green" type="submit" value="Edit"/>
                            </form>
                        </td>
                    </tr>
                `
            })  
    htmlPage += `
                </table>
                </div>
`

    htmlPage += `
                <div class="w3-col l6 6 w3-center">
                    Done Tasks
`   
    htmlPage += '<table class="w3-table-all w3-centered w3-light-grey">\n<thead>\n<tr>'
    for(let i=0; i<keys.length;i++){
        htmlPage += `<th>${keys [i]}</th>`
    }
    htmlPage += '</tr></thead>'

    done_tasks.forEach(t => {
        htmlPage += `
                    <tr>
                        <td>${t.tarefa}</td>
                        <td>${t.tipo}</td>
                        <td>${t.data_criada}</td>
                        <td>${t.deadline}</td>
                        <td>${t.target}</td>
                        <td>
                        <form action="/tarefas/${t.id}/delete" method="POST">
                            <input class="w3-circle w3-round-large w3-red" type="submit" value="Delete"/>
                        </form>
                    </td>
                    </tr>
                `
            })
    
    htmlPage += `
        </div></table>
    `

    htmlPage += `
        </body>
    </html>
    `
    return htmlPage
}

function generateEditPage(tarefas,tarefa,d){
    var done_tasks = []
    var todo_tasks = []
    tarefas.forEach(
        t => {
            if(t.status == 'realizar'){
                todo_tasks.push(t)
            }else{
                done_tasks.push(t)
            }
        }
    )
    // console.log(todo_tasks)
    let htmlPage = `
    <html>
        <head>
            <title>ToDo List</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <link rel="stylesheet" href="font.css"/>
        </head>
        <body>
        <div class="w3-container w3-teal w3-padding-16">
        TODO LIST
    </div>

            <form class="w3-container w3-padding-16" action="/tarefas/${tarefa.id}/edit/confirm" method="POST">
                <div class="w3-row-padding">
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Task</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" value="${tarefa.tarefa}" name="tarefa">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Type</b></label>
                        <input class="w3-input w3-border w3-light-grey" value=${tarefa.tipo} type="text" name="tipo">
                    </div>    
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Deadline</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="date" value="${tarefa.deadline}" name="deadline">
                    </div>
                </div>
                <div class="w3-row-padding">
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Author</b></label>
                        <input class="w3-input w3-border w3-light-grey" type="text" value="${tarefa.target}" name="target">
                    </div>
                </div>
                <div class="w3-row-padding">
                    <input class="w3-btn w3-blue-grey" type="submit" value="Submit"/>
                    <input class="w3-btn w3-blue-grey" type="reset" value="Reset"/> 
                </div>
            </form>
`
    htmlPage += `
            <div class="w3-row w3-teal">
                <div class="w3-col l6 6 w3-center">
                    TODO Tasks`

    keys = ['Task','Type','Created','Deadline','Author']

    htmlPage += '<table class="w3-table-all w3-centered w3-light-grey">\n<thead>\n<tr>'
    for(let i=0; i<keys.length;i++){
        htmlPage += `<th>${keys[i]}</th>`
    }
    htmlPage += '</tr></thead>'

    todo_tasks.forEach(t => {
                htmlPage += `
                    <tr>
                        <td>${t.tarefa}</td>
                        <td>${t.tipo}</td>
                        <td>${t.data_criada}</td>
                        <td>${t.deadline}</td>
                        <td>${t.target}</td>
                        <td>
                            <form action="/tarefas/${t.id}/check" method="POST">
                                <input class="w3-circle w3-round-large w3-light-green" type="submit" value="Done"/>
                            </form>
                        </td>
                        <td>
                            <form action="/tarefas/${t.id}/edit" method="POST">
                                <input class="w3-circle w3-round-large w3-light-green" type="submit" value="Edit"/>
                            </form>
                        </td>
                    </tr>
                `
            })  
    htmlPage += `
                </table>
                </div>
`

    htmlPage += `
                <div class="w3-col l6 6 w3-center">
                    DONE Tasks
`   
    htmlPage += '<table class="w3-table-all w3-centered w3-light-grey">\n<thead>\n<tr>'
    for(let i=0; i<keys.length;i++){
        htmlPage += `<th>${keys [i]}</th>`
    }
    htmlPage += '</tr></thead>'

    done_tasks.forEach(t => {
        htmlPage += `
                    <tr>
                        <td>${t.tarefa}</td>
                        <td>${t.tipo}</td>
                        <td>${t.data_criada}</td>
                        <td>${t.deadline}</td>
                        <td>${t.target}</td>
                        <td>
                        <form action="/tarefas/${t.id}/delete" method="POST">
                            <input class="w3-circle w3-round-large w3-red" type="submit" value="Delete"/>
                        </form>
                    </td>
                    </tr>
                `
            })
    
    htmlPage += `
        </div></table>
    `

    htmlPage += `
        </body>
    </html>
    `
    return htmlPage
    
}


var todolistServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var today = new Date();
    var d = today.toISOString().substring(0,16)
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(req.method + " " + req.url + " " + d)

    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req,res)
    }else{
        // Tratamento do pedido
        switch(req.method){
            case "GET": 
                // GET /alunos --------------------------------------------------------------------
                if((req.url == "/" || req.url == "/tarefas")){
                    axios.get("http://localhost:3000/tasks")
                        .then(response => {
                            var tarefas = response.data
                            // console.log(tarefas)
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(generatePage(tarefas,d))
                            res.end()
                        })
                        .catch(function(erro){
                            // console.log(erro)
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas...")
                            res.end()
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                var parts = req.url.split('/')
                // console.log(parts)
                if(parts[2] == 'insert'){
                    recuperaInfo(req, resultado => {
                        console.log("POST de tarefa " + JSON.stringify(resultado))
                        resultado['status'] = 'realizar'
                        resultado['data_criada'] = date
                        axios.post("http://localhost:3000/tasks", resultado)
                        axios.get("http://localhost:3000/tasks")
                            .then(response => {
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    // console.log(response.data)
                                    res.write(generatePage(response.data, d))
                                    res.end()                                                
                            })
                            .catch(function(erro){
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write("<p>Não foi possível obter a lista de tarefas...")
                                    res.end()
                                })
                        })
                }
                else if (parts[3]){
                    switch(parts[3]){
                        case "edit":
                            if(parts[4] == 'confirm'){
                                console.log('EDIT confirmed')
                                recuperaInfo(req, resultado => {
                                    console.log("EDIT de tarefa " + JSON.stringify(resultado))
                                    resultado['id'] = parts[2]
                                    resultado['status'] = "realizar"
                                    resultado['data_criada'] = date
                                    axios.delete("http://localhost:3000/tasks/"+parts[2])
                                    axios.post("http://localhost:3000/tasks",resultado)
                                    axios.get("http://localhost:3000/tasks")
                                        .then(response => {
                                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                                // console.log(response.data)
                                                res.write(generatePage(response.data, d))
                                                res.end()                                                
                                        })
                                        .catch(function(erro){
                                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                                res.write("<p>Não foi possível obter a lista de tarefas...")
                                                res.end()
                                            })
                                })
                            }
                            else{
                                console.log('EDIT requested')
                                var idTarefa = parts[2]
                                axios.get("http://localhost:3000/tasks")
                                    .then(resp =>{
                                        axios.get("http://localhost:3000/tasks/"+idTarefa)
                                        .then(tarefa => {
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            // console.log(response.data)
                                            res.write(generateEditPage(resp.data,tarefa.data))
                                            res.end()
                                        })
                                })
                            }
                            break
                        case "check":
                            console.log('TASK DONE requested')
                            var idTarefa = parts[2]
                            axios.get("http://localhost:3000/tasks/"+idTarefa)
                                .then(tarefa => {
                                    data = tarefa.data
                                    data['status'] = "realizada"
                                    axios.delete("http://localhost:3000/tasks/"+idTarefa)
                                    axios.post("http://localhost:3000/tasks",data)
                                    axios.get("http://localhost:3000/tasks")
                                        .then(resp => {
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            // console.log(response.data)
                                            res.write(generatePage(resp.data))
                                            res.end()
                                        })
                                })
                            break
                        case "delete":
                            console.log('DELETE TASK requested')
                            var idTarefa = parts[2]
                            axios.delete("http://localhost:3000/tasks/"+idTarefa)
                            axios.get("http://localhost:3000/tasks")
                                .then(resp => {
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(generatePage(resp.data))
                                    res.end()
                            })
                            break
                    }
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    console.log("URL recebido: " + req.url)
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

todolistServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')