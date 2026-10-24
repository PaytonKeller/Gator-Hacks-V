from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.db import init_db

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
JWTManager(app)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)