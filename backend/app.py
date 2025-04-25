from flask import Flask
from flask_cors import CORS  # Import CORS
from models import db
from routes import register_routes  # We'll update routes.py to export a function

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'

# Initialize CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize the database
db.init_app(app)

# Create the database tables
with app.app_context():
    db.create_all()

# Register routes
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True, port=5001)