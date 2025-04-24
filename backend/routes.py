from flask import request, jsonify
from flask_jwt_extended import jwt_required, create_access_token
from models import db, User, Client, Program, client_programs
from sqlalchemy import or_

# Login route
def login():
    """Handle user login and generate JWT access token.
    
    Returns:
        JSON response with access token on success, or error message on failure.
    """
    if request.method == 'OPTIONS':
        return '', 200  # Handle CORS preflight request
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

# Get all programs
@jwt_required()
def get_programs():
    """Retrieve a list of all programs.
    
    Returns:
        JSON list of programs with id, name, and description.
    """
    if request.method == 'OPTIONS':
        return '', 200
    programs = Program.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'description': p.description} for p in programs]), 200

# Create a program
@jwt_required()
def create_program():
    """Create a new program.
    
    Expects JSON body with name and optional description.
    Returns:
        Success message on creation.
    """
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    program = Program(name=data.get('name'), description=data.get('description', ''))
    db.session.add(program)
    db.session.commit()
    return jsonify({'message': 'Program created'}), 201

# Search clients
@jwt_required()
def search_clients():
    """Search clients by name or email.
    
    Expects query parameter 'q'.
    Returns:
        JSON list of matching clients with details and enrolled programs.
    """
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

# Register a client
@jwt_required()
def register_client():
    """Register a new client.
    
    Expects JSON body with first_name, last_name, email, and optional phone, date_of_birth.
    Returns:
        Success message on registration.
    """
    if request.method == 'OPTIONS':
        return '', 200
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

# Enroll client in a program
@jwt_required()
def enroll_client(client_id):
    """Enroll a client in a program.
    
    Expects JSON body with program_id.
    Returns:
        Success message on enrollment.
    """
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    program_id = data.get('program_id')
    client = Client.query.get_or_404(client_id)
    program = Program.query.get_or_404(program_id)
    client.programs.append(program)
    db.session.commit()
    return jsonify({'message': 'Client enrolled'}), 201

# Get client profile
@jwt_required()
def get_client(client_id):
    """Retrieve a client's profile.
    
    Returns:
        JSON object with client details and enrolled programs.
    """
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