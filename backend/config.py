import bcrypt

# Configuration settings for the Flask application
class Config:
    # SQLite database URI
    SQLALCHEMY_DATABASE_URI = 'sqlite:///health_system.db'
    # Disable SQLAlchemy modification tracking
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Secret key for JWT authentication
    SECRET_KEY = 'your-secure-secret-key-12345'  # Replace with a secure key in production
    # JWT configuration
    JWT_SECRET_KEY = 'your-jwt-secret-key-67890'  # Replace with a secure key
    # Default doctor credentials
    DOCTOR_USERNAME = "doctor"
    # Hash the password "password" (you can change this later)
    DOCTOR_PASSWORD_HASH = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')