from flask import request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from datetime import datetime
from models import db, Client, Program
import re
from sqlalchemy.exc import IntegrityError

# Initialize JWT (will be attached to the app in app.py)
jwt = JWTManager()

def register_routes(app):
    # Attach JWT to the app
    jwt.init_app(app)

    # Log all incoming requests for debugging
    @app.before_request
    def log_request():
        print(f"Request: {request.method} {request.path} {request.get_json(silent=True)}")

    # Handle CORS preflight requests for all routes
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response

    @app.route('/api/login', methods=['POST', 'OPTIONS'])
    def login():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        data = request.get_json()
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Username and password are required'}), 422
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
        if not data:
            return jsonify({'message': 'No data provided'}), 422
        required_fields = ['first_name', 'last_name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Missing required field: {field}'}), 422
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', data['email']):
            return jsonify({'message': 'Invalid email format'}), 422
        try:
            dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d') if data.get('date_of_birth') else None
        except ValueError:
            return jsonify({'message': 'Invalid date_of_birth format. Use YYYY-MM-DD'}), 422
        try:
            new_client = Client(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                phone=data.get('phone'),
                date_of_birth=dob,
                address=data.get('address'),
                gender=data.get('gender'),
                emergency_contact=data.get('emergency_contact')
            )
            db.session.add(new_client)
            db.session.commit()
            return jsonify({'id': new_client.id, 'message': 'Client registered successfully'}), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'message': 'Email already exists'}), 422

    @app.route('/api/clients', methods=['GET', 'OPTIONS'])
    @jwt_required()
    def get_all_clients():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        try:
            clients = Client.query.all()
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
        except Exception as e:
            return jsonify({'message': f'Failed to fetch clients: {str(e)}'}), 500

    @app.route('/api/clients/search', methods=['GET', 'OPTIONS'])
    @jwt_required()
    def search_clients():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        query = request.args.get('q', '')
        try:
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
        except Exception as e:
            return jsonify({'message': f'Search failed: {str(e)}'}), 500

    @app.route('/api/clients/<id>', methods=['GET', 'PUT', 'OPTIONS'])
    @jwt_required()
    def client(id):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        client = Client.query.get_or_404(id)
        if request.method == 'GET':
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
        elif request.method == 'PUT':
            data = request.get_json()
            if not data:
                return jsonify({'message': 'No data provided'}), 422
            required_fields = ['first_name', 'last_name', 'email']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'Missing required field: {field}'}), 422
            if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', data['email']):
                return jsonify({'message': 'Invalid email format'}), 422
            try:
                dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d') if data.get('date_of_birth') else None
            except ValueError:
                return jsonify({'message': 'Invalid date_of_birth format. Use YYYY-MM-DD'}), 422
            try:
                client.first_name = data['first_name']
                client.last_name = data['last_name']
                client.email = data['email']
                client.phone = data.get('phone')
                client.date_of_birth = dob
                client.address = data.get('address')
                client.gender = data.get('gender')
                client.emergency_contact = data.get('emergency_contact')
                db.session.commit()
                return jsonify({'message': 'Client updated successfully'}), 200
            except IntegrityError:
                db.session.rollback()
                return jsonify({'message': 'Email already exists'}), 422

    @app.route('/api/programs', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def create_program():
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        data = request.get_json()
        if not data or not data.get('name'):
            return jsonify({'message': 'Program name is required'}), 422
        if Program.query.filter_by(name=data['name']).first():
            return jsonify({'message': 'A program with this name already exists'}), 422
        try:
            new_program = Program(
                name=data['name'],
                description=data.get('description')
            )
            db.session.add(new_program)
            db.session.commit()
            return jsonify({'id': new_program.id, 'message': 'Program created successfully'}), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'message': 'Program creation failed due to database error'}), 422

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

    @app.route('/api/programs/<program_id>', methods=['PUT', 'OPTIONS'])
    @jwt_required()
    def update_program(program_id):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        program = Program.query.get_or_404(program_id)
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 422
        program.name = data.get('name', program.name)
        program.description = data.get('description', program.description)
        try:
            db.session.commit()
            return jsonify({'message': 'Program updated successfully'}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({'message': 'Program update failed due to database error'}), 422

    @app.route('/api/clients/<client_id>/programs', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def enroll_client(client_id):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        client = Client.query.get_or_404(client_id)
        data = request.get_json()
        if not data or not data.get('program_id'):
            return jsonify({'message': 'Program ID is required'}), 422
        program = Program.query.get_or_404(data['program_id'])
        if program in client.programs:
            return jsonify({'message': 'Client already enrolled in this program'}), 422
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