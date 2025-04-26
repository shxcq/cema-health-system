import uuid
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

client_programs = db.Table('client_programs',
    db.Column('client_id', db.String(36), db.ForeignKey('client.id'), primary_key=True),
    db.Column('program_id', db.String(36), db.ForeignKey('program.id'), primary_key=True)
)

class Client(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.String(200))
    gender = db.Column(db.String(20))
    emergency_contact = db.Column(db.String(100))  # Increased length
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    programs = db.relationship('Program', secondary=client_programs, backref=db.backref('clients', lazy='dynamic'))

class Program(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    __table_args__ = (db.UniqueConstraint('name', name='uix_program_name'),)