function showFicheiro(f) {
    var html = "<ul class=\"w3-ul w3-hoverable\">"
    for(file of f.filesZip){
        html += '<li>' + file + '</li>' 
    }

    html += "</ul>"

    var ficheiro = $(html)
    $("#display").empty()
    $("#display").append(ficheiro)
    $("#display").modal()
}


function showLikes(f) {
    var html 
    if(f.liked_by.length == 0) html = "<h3>Sem likes</h3>"
    else
    {
    html = "<ul class=\"w3-ul w3-hoverable\">"
    for(file of f.liked_by){
        html += '<li>' + file + '</li>' 
    }

    html += "</ul>"
    }
    var ficheiro = $(html)
    $("#display").empty()
    $("#display").append(ficheiro)
    $("#display").modal()
}

function showNews(news) {
    var html
    if(news.length == 0) html = "<h3>Sem novas notícias</h3>"
    else
    {
    html = "<table class=\"w3-table-all w3-hoverable w3-large\">"
    html += "<tr><th>Username</th>"
    html += "<th>Acontecimento</th>"
    html += "<th>Data</th></tr>"
    for(n of news){
        if (n.visible == 1){
            html += '<tr><td>' + n.username + '</td>'
            html += '<td>' + n.action + '</td>'
            html += '<td>' + n.date + '</td></tr>'
        } 
    }
    html += '</table>'
    }

    var ficheiro = $(html)
    $("#display").empty()
    $("#display").append(ficheiro)
    $("#display").modal()
}