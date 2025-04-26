from flask import Flask, redirect, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flasgger import Swagger
from models import db
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'

# Initialize CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Initialize JWT
jwt = JWTManager(app)

# Initialize Swagger
swagger = Swagger(app)

# Initialize the database
db.init_app(app)

# Create the database tables
with app.app_context():
    db.create_all()

# Redirect HTTP to HTTPS in production
@app.before_request
def redirect_to_https():
    if os.getenv('FLASK_ENV') == 'production' and not request.is_secure:
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)

# Import and register routes after app initialization to avoid circular imports
from routes import register_routes
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
