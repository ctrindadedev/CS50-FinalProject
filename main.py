import psycopg2
from flask import Flask
import pyodbc
app = Flask(__name__) #Forma padrão de criar um aplicativo no Flask, "Flask, turn this file in a web apliccation"
# importando todas as rotas
from views import *

#Rodando nosso site
if __name__ == "__main__":
    app.run()
