import json as js

# Reading and parsing dataset into a JSON object
with open("cinemaATP.json",encoding='utf-8') as file:
    data = js.load(file)

movies_nr = {}

atores_nr = {}

atores = {}

# Generates the main page
def generateHomePage():
    main_page_path = "./html/index.html"
    main_page = open(main_page_path,"w")
    main_page.write("<!DOCTYPE html>\n")

    main_page.write("<html lang=\"pt\">\n")

    main_page.write("\t<head>\n")

    main_page.write("\t\t<title>Main Page</title>\n")
    main_page.write("\t\t<meta charset=\"UTF-8\">")
    main_page.write("\t\t<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">")

    main_page.write("\t</head>\n")

    main_page.write("\t<body>\n")

    main_page.write("\t\t<h1><a href=\"http://localhost:7777/filmes\">Filmes</a></h1>")
    main_page.write("\t\t<h1><a href=\"http://localhost:7777/atores\">Atores</a></h1>")

    main_page.write("\t</body>\n")

    main_page.write("</html>\n")

# Generates the movies page
def generateMoviesPage(data):
    main_page_path = "./html/filmes.html"
    main_page = open(main_page_path,"w")
    main_page.write("<!DOCTYPE html>\n")

    main_page.write("<html lang=\"pt\">\n")

    main_page.write("\t<head>\n")

    main_page.write("\t\t<title>Filmes</title>\n")
    main_page.write("\t\t<meta charset=\"UTF-8\">")
    main_page.write("\t\t<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">")

    main_page.write("\t</head>\n")

    main_page.write("\t<body>\n")

    main_page.write("\t\t<div class=\"w3-bar w3-center\">\n")
    main_page.write("\t\t\t<h1>Filmes</h1>\n")
    main_page.write("\t\t</div>\n")

    main_page.write("\t\t<div class=\"w3-container w3-margin-left w3-text-blue\">\n")
    main_page.write("\t\t\t<p><a href=\"http://localhost:7777\"><u>Voltar</u></a><p>\n")
    main_page.write("\t\t</div>")

    main_page.write("\t\t<div class=\"w3-container w3-margin-left\">\n")
    main_page.write("\t\t\t<ol>\n")

    i = 1
    for ele in data:
        numero = str(i)
        #movies_nr[ele['title']] = i
        main_page.write("\t\t\t<li><a href=\"http://localhost:7777/filmes/f" + numero + "\">" + ele['title'] + " - " + str(ele['year']) + "</a></li>")
        i += 1

    main_page.write("\t\t\t<\ol>\n")

    main_page.write("\t</body>\n")

    main_page.write("</html>\n")

# Generates a page to each movie
def generateHTMLMovie(elem):
    nr = str(movies_nr.get(elem['title']))
    file_name = "./html/f" + nr + ".html"
    f = open(file_name,"w")
    f.write("<!DOCTYPE html>\n")

    f.write("<html lang=\"pt\">\n")

    f.write("\t<head>\n")

    f.write("\t\t<title>Filmes - " + elem['title'] + "</title>\n")
    f.write("\t\t<meta charset=\"UTF-8\">")
    f.write("\t\t<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">")

    f.write("\t</head>\n")

    f.write("\t<body>\n")

    f.write("\t\t<div class=\"w3-bar w3-center\">\n")
    f.write("\t\t\t<h1>" + elem['title'] + "</h1>\n")
    f.write("\t\t</div>")

    f.write("\t\t<div class=\"w3-container w3-margin-left\">\n")
    f.write("\t\t\t<h3>Ano de Lançamento: " + str(elem['year']) + "</h3>\n")
    f.write("\t\t\t<h4>Elenco:</h4>\n")
    f.write("\t\t\t<ul>\n")
    for c in elem['cast']:
        f.write("\t\t\t\t<li><a href=\"http://localhost:7777/atores/a" + str(atores_nr.get(c)) + "\">" + str(c) + "</a></li>\n")
    f.write("\t\t\t</ul>\n")
    f.write("\t\t\t<h4>Género:</h4>\n")
    f.write("\t\t\t<ul>\n")
    for g in elem['genres']:
        f.write("\t\t\t\t<li>" + g + "</li>\n")
    f.write("\t\t\t</ul>\n")
    f.write("\n\n</div>")

    f.write("\t\t<div class=\"w3-container w3-margin-left w3-text-blue\">\n")
    f.write("\t\t\t<p><a href=\"http://localhost:7777/filmes\"><u>Voltar</u></a><p>\n")
    f.write("\t\t</div>")

    f.write("\t</body>\n")

    f.write("</html>\n")

# Generates the actor page
def generateActorsPage(atores):
    main_page_path = "./html/atores.html"
    main_page = open(main_page_path,"w")
    main_page.write("<!DOCTYPE html>\n")

    main_page.write("<html lang=\"pt\">\n")

    main_page.write("\t<head>\n")

    main_page.write("\t\t<title>Atores</title>\n")
    main_page.write("\t\t<meta charset=\"UTF-8\">")
    main_page.write("\t\t<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">")

    main_page.write("\t</head>\n")

    main_page.write("\t<body>\n")

    main_page.write("\t\t<div class=\"w3-bar w3-center\">\n")
    main_page.write("\t\t\t<h1>Atores</h1>\n")
    main_page.write("\t\t</div>\n")

    main_page.write("\t\t<div class=\"w3-container w3-margin-left w3-text-blue\">\n")
    main_page.write("\t\t\t<p><a href=\"http://localhost:7777\"><u>Voltar</u></a><p>\n")
    main_page.write("\t\t</div>")
    
    main_page.write("\t\t<div class=\"w3-container w3-margin-left\">\n")
    main_page.write("\t\t\t<ol>\n")

    for key in atores.keys():
        numero = str(atores_nr.get(key))
        main_page.write("\t\t\t<li><a href=\"http://localhost:7777/atores/a" + numero + "\">" + key + "</a></li>")
        generateActorPage(atores,key)
        

    main_page.write("\t\t\t<\ol>\n")

    main_page.write("\t</body>\n")

    main_page.write("</html>\n")

# Generates a page for each actor
def generateActorPage(atores,key):
    nr = str(atores_nr.get(key))
    file_name = "./html/a" + nr + ".html"
    f = open(file_name,"w")
    f.write("<!DOCTYPE html>\n")

    f.write("<html lang=\"pt\">\n")

    f.write("\t<head>\n")

    f.write("\t\t<title>Atores - " + key + "</title>\n")
    f.write("\t\t<meta charset=\"UTF-8\">")
    f.write("\t\t<link rel=\"stylesheet\" href=\"https://www.w3schools.com/w3css/4/w3.css\">")

    f.write("\t</head>\n")
    f.write("\t<body>\n")

    f.write("\t\t<div class=\"w3-bar w3-center\">\n")
    f.write("\t\t\t<h1>" + key + "</h1>\n")
    f.write("\t\t</div>\n")
    f.write("\t\t<div class=\"w3-container w3-margin-left\">\n")
    f.write("\t\t\t<ol>\n")

    for movie in atores.get(key):
        f.write("\t\t\t<li><a href=\"http://localhost:7777/filmes/f" + str(movies_nr.get(movie)) + "\">" + movie + "</a></li>")

    f.write("\t\t\t</ol>\n")

    f.write("\t\t<div class=\"w3-container w3-margin-left w3-text-blue\">\n")
    f.write("\t\t\t<p><a href=\"http://localhost:7777/atores\"><u>Voltar</u></a><p>\n")
    f.write("\t\t</div>")

    f.write("\t</body>\n")

    f.write("</html>\n")

# Function to add an actor to dict
def add_to_dict(actor,movie):
    if actor in atores:
        atores[actor].append(movie)
    else:
        atores[actor] = [movie]

def valid_name(name):
    return name[0].isupper() or name[0].isnumeric()

movies = []

i = 1
for elem in data:
    movies.append(elem['title']) 
    for a in elem['cast']:
        #print(a)
        if(valid_name(a)):
            add_to_dict(a, elem['title'])
    i += 1

movies.sort()

n = 1
for m in movies:
    movies_nr[m] = n
    n += 1

atores = dict(sorted(atores.items(), key = lambda x : x[0].lower()))

n = 1
for a in atores.keys():
    atores_nr[a] = n
    n += 1

# Generating Main Page
generateHomePage()

# Generating Movies Page
generateMoviesPage(data)

# Generating Actors Page
generateActorsPage(atores)

for elem in data:
    generateHTMLMovie(elem)  