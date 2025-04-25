from flask import jsonify, request
from flask_jwt_extended import jwt_required, create_access_token  # type: ignore
from models import db, User, Client, Program  # Removed unused client_programs
from sqlalchemy import or_

def login():
    """Handle user login and return a JWT token."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

def get_programs():
    """Retrieve a list of all programs."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    programs = Program.query.all()
    return jsonify([{
        'id': program.id,
        'name': program.name,
        'description': program.description
    } for program in programs]), 200

def create_program():
    """Create a new program."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    data = request.get_json()
    program = Program(
        name=data.get('name'),
        description=data.get('description', '')
    )
    db.session.add(program)
    db.session.commit()
    return jsonify({'message': 'Program created'}), 201

def search_clients():
    """Search for clients by name or email."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    query = request.args.get('q', '')
    clients = Client.query.filter(
        or_(
            Client.first_name.ilike(f'%{query}%'),
            Client.last_name.ilike(f'%{query}%'),
            Client.email.ilike(f'%{query}%')
        )
    ).all()
    return jsonify([{
        'id': client.id,
        'first_name': client.first_name,
        'last_name': client.last_name,
        'email': client.email,
        'phone': client.phone,
        'date_of_birth': client.date_of_birth
    } for client in clients]), 200

def register_client():
    """Register a new client."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    data = request.get_json()
    client = Client(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        phone=data.get('phone', ''),
        date_of_birth=data.get('date_of_birth', '')
    )
    db.session.add(client)
    db.session.commit()
    return jsonify({'message': 'Client registered'}), 201

@jwt_required()
def enroll_client(client_id: int) -> tuple:  # Add type hints
    """Enroll a client in a program."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    data = request.get_json()
    program_id = data.get('program_id')
    client = Client.query.get_or_404(client_id)
    program = Program.query.get_or_404(program_id)
    client.programs.append(program)
    db.session.commit()
    return jsonify({'message': 'Client enrolled in program'}), 200

@jwt_required()
def get_client(client_id: int) -> tuple:  # Add type hints
    """Retrieve details of a specific client."""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    client = Client.query.get_or_404(client_id)
    return jsonify({
        'id': client.id,
        'first_name': client.first_name,
        'last_name': client.last_name,
        'email': client.email,
        'phone': client.phone,
        'date_of_birth': client.date_of_birth,
        'programs': [{
            'id': program.id,
            'name': program.name,
            'description': program.description
        } for program in client.programs]
    }), 200
