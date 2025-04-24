from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db, init_db
from routes import login, get_programs, create_program, search_clients, register_client, enroll_client, get_client
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})
init_db(app)
app.route('/api/login', methods=['POST', 'OPTIONS'])(login)
app.route('/api/programs', methods=['GET', 'OPTIONS'])(get_programs)
app.route('/api/programs', methods=['POST', 'OPTIONS'])(create_program)
app.route('/api/clients/search', methods=['GET', 'OPTIONS'])(search_clients)
app.route('/api/clients', methods=['POST', 'OPTIONS'])(register_client)
app.route('/api/clients/<int:client_id>/programs', methods=['POST', 'OPTIONS'])(enroll_client)
app.route('/api/clients/<int:client_id>', methods=['GET', 'OPTIONS'])(get_client)

if __name__ == '__main__':
    app.run(debug=True, port=5001)