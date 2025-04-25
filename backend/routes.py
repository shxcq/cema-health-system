from flask import request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from datetime import datetime
from models import db, Client, Program

# Initialize JWT (will be attached to the app in app.py)
jwt = JWTManager()

def register_routes(app):
    # Attach JWT to the app
    jwt.init_app(app)

    @app.route('/api/login', methods=['POST', 'OPTIONS'])
    def login():
        if request.method == 'OPTIONS':
            return jsonify({}), 200  # Handle CORS preflight request
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if username == 'doctor' and password == 'password':
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/api/clients', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def register_client():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        data = request.get_json()
        new_client = Client(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data.get('phone'),
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d') if data.get('date_of_birth') else None,
            address=data.get('address'),
            gender=data.get('gender'),
            emergency_contact=data.get('emergency_contact')
        )
        db.session.add(new_client)
        db.session.commit()
        return jsonify({'id': new_client.id, 'message': 'Client registered successfully'}), 201

    @app.route('/api/clients/search', methods=['GET', 'OPTIONS'])
    @jwt_required()
    def search_clients():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        query = request.args.get('q', '')
        clients = Client.query.filter(
            (Client.first_name.ilike(f'%{query}%')) |
            (Client.last_name.ilike(f'%{query}%')) |
            (Client.email.ilike(f'%{query}%'))
        ).all()
        return jsonify([{
            'id': client.id,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'phone': client.phone,
            'date_of_birth': client.date_of_birth.isoformat() if client.date_of_birth else None,
            'address': getattr(client, 'address', None),
            'gender': getattr(client, 'gender', None),
            'emergency_contact': getattr(client, 'emergency_contact', None),
            'created_at': client.created_at.isoformat(),
            'programs': [{'id': p.id, 'name': p.name} for p in client.programs]
        } for client in clients]), 200

    @app.route('/api/clients/<id>', methods=['GET', 'OPTIONS'])
    @jwt_required()
    def get_client(id):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        client = Client.query.get_or_404(id)
        return jsonify({
            'id': client.id,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'phone': client.phone,
            'date_of_birth': client.date_of_birth.isoformat() if client.date_of_birth else None,
            'address': getattr(client, 'address', None),
            'gender': getattr(client, 'gender', None),
            'emergency_contact': getattr(client, 'emergency_contact', None),
            'created_at': client.created_at.isoformat(),
            'programs': [{'id': p.id, 'name': p.name} for p in client.programs]
        }), 200

    @app.route('/api/programs', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def create_program():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        data = request.get_json()
        if Program.query.filter_by(name=data['name']).first():
            return jsonify({'message': 'A program with this name already exists'}), 400
        new_program = Program(
            name=data['name'],
            description=data.get('description')
        )
        db.session.add(new_program)
        db.session.commit()
        return jsonify({'id': new_program.id, 'message': 'Program created successfully'}), 201

    @app.route('/api/programs', methods=['GET', 'OPTIONS'])
    @jwt_required()
    def get_programs():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        programs = Program.query.all()
        return jsonify([{
            'id': program.id,
            'name': program.name,
            'description': program.description,
            'created_at': program.created_at.isoformat() if program.created_at else None
        } for program in programs]), 200

    @app.route('/api/clients/<client_id>/programs', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def enroll_client(client_id):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        client = Client.query.get_or_404(client_id)
        data = request.get_json()
        program = Program.query.get_or_404(data['program_id'])
        client.programs.append(program)
        db.session.commit()
        return jsonify({'message': 'Client enrolled successfully'}), 200

    @app.route('/api/clients/<client_id>/programs/<program_id>', methods=['DELETE', 'OPTIONS'])
    @jwt_required()
    def unenroll_client(client_id, program_id):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        client = Client.query.get_or_404(client_id)
        program = Program.query.get_or_404(program_id)
        if program in client.programs:
            client.programs.remove(program)
            db.session.commit()
            return jsonify({'message': 'Client unenrolled successfully'}), 200
        return jsonify({'message': 'Client is not enrolled in this program'}), 400