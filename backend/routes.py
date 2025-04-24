from flask import request, jsonify
from flask_jwt_extended import jwt_required, create_access_token
from models import db, User, Client, Program, client_programs
from sqlalchemy import or_
from typing import Tuple, Dict, Any

def login() -> Tuple[Dict[str, Any], int]:
    """Handle user login and return JWT token."""
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@jwt_required()
def get_programs() -> Tuple[Dict[str, Any], int]:
    """Retrieve all programs."""
    if request.method == 'OPTIONS':
        return '', 200
    programs = Program.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'description': p.description} for p in programs]), 200

@jwt_required()
def create_program() -> Tuple[Dict[str, Any], int]:
    """Create a new program."""
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    if not all(key in data for key in ['name']):
        return jsonify({'error': 'Missing required fields'}), 400
    program = Program(name=data.get('name'), description=data.get('description', ''))
    db.session.add(program)
    db.session.commit()
    return jsonify({'message': 'Program created'}), 201

@jwt_required()
def search_clients() -> Tuple[Dict[str, Any], int]:
    """Search clients by name or email."""
    if request.method == 'OPTIONS':
        return '', 200
    query = request.args.get('q', '')
    clients = Client.query.filter(
        or_(
            Client.first_name.ilike(f'%{query}%'),
            Client.last_name.ilike(f'%{query}%'),
            Client.email.ilike(f'%{query}%')
        )
    ).all()
    return jsonify([
        {
            'id': c.id,
            'first_name': c.first_name,
            'last_name': c.last_name,
            'email': c.email,
            'phone': c.phone,
            'date_of_birth': c.date_of_birth,
            'programs': [{'id': p.id, 'name': p.name} for p in c.programs]
        } for c in clients
    ]), 200

@jwt_required()
def register_client() -> Tuple[Dict[str, Any], int]:
    """Register a new client."""
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    if not all(key in data for key in ['first_name', 'last_name', 'email']):
        return jsonify({'error': 'Missing required fields'}), 400
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
def enroll_client(client_id: int) -> Tuple[Dict[str, Any], int]:
    """Enroll a client in a program."""
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    program_id = data.get('program_id')
    if not program_id:
        return jsonify({'error': 'Missing program_id'}), 400
    client = Client.query.get_or_404(client_id)
    program = Program.query.get_or_404(program_id)
    client.programs.append(program)
    db.session.commit()
    return jsonify({'message': 'Client enrolled'}), 201

@jwt_required()
def get_client(client_id: int) -> Tuple[Dict[str, Any], int]:
    """Retrieve a client's profile."""
    if request.method == 'OPTIONS':
        return '', 200
    client = Client.query.get_or_404(client_id)
    return jsonify({
        'id': client.id,
        'first_name': client.first_name,
        'last_name': client.last_name,
        'email': client.email,
        'phone': client.phone,
        'date_of_birth': client.date_of_birth,
        'programs': [{'id': p.id, 'name': p.name} for p in client.programs]
    }), 200