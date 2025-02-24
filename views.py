from main import app 
from flask import redirect, render_template, request
import psycopg2 as psy

SPORTS = [
    "Natação",
    "Basquete",
    "Futebol",
    "Xadrez",
    "PowerLift",
    "JiuJitsu",
    "Vôlei"
]
# Decorator
# Isso define para onde o usuário será direcionado ao estar em determinado endereço da página, sendo o @ tendo a função de atribuir a funcionalidade ao que vem abaixo
@app.route("/")
def homepage():
    return render_template("index.html", sports = SPORTS)


# Conexão com  o Banco de Dados
conexao = psy.connect(dbname="cs50", host="localhost",
                      user="postgres", password="c051005M.", port="5432")
cur = conexao.cursor()


@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name")
    if not name:
        return render_template("error.html", message="Missing name")
    sport = request.form.get("sport")
    if not sport:
        return render_template("error.html", message="Missing sport")
    if sport not in SPORTS:
        return render_template("error.html", message="Invalid sport")
    cur.execute("INSERT INTO relacao (nome, esporte) VALUES (%s, %s)", (name, sport))
    cur.execute("SELECT * FROM relacao;")
    conexao.commit()
    return redirect("/registrants")

@app.route("/registrants")
def registrants():
    #Linhas em tabelas são como dicionários, no qual cada coluna tem um par de valor

    colnames = [desc[0] for desc in cur.description]  #fornece os nomes das colunas com .description
    registrantes = [dict(zip(colnames, row)) for row in cur.fetchall()] #O uso de zip combina os nomes das colunas com os valores, transformando cada linha em um dicionário.
                                               #Nome no template | Nome da Variavel
    # Fechar conexão
    cur.close()
    conexao.close()

    return render_template("registrants.html", relacao=registrantes)
