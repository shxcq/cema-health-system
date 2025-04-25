from flask_sqlalchemy import SQLAlchemy
from flask import Flask  # Added for type hint

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.String(10))
    programs = db.relationship('Program', secondary='client_programs')

class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

client_programs = db.Table('client_programs',
    db.Column('client_id', db.Integer, db.ForeignKey('client.id'), primary_key=True),
    db.Column('program_id', db.Integer, db.ForeignKey('program.id'), primary_key=True)
)

def init_db(app: Flask) -> None:  # Added type hint for app
    db.init_app(app)
    with app.app_context():  # type: ignore
        db.create_all()
        if not User.query.filter_by(username='doctor').first():
            default_user = User(username='doctor', password='password')
            db.session.add(default_user)
            db.session.commit()
