# Unit tests for the health information system
import pytest
from app import app, db
from models import User, HealthProgram, Client
from werkzeug.security import generate_password_hash

# Fixture to set up test client and in-memory database
@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-jwt-secret'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # Create test user
            user = User(
                username='testdoctor',
                password_hash=generate_password_hash('testpass'),
                role='doctor'
            )
            db.session.add(user)
            db.session.commit()
        yield client
        with app.app_context():
            db.drop_all()

# Helper function to get JWT token
def get_jwt_token(client):
    response = client.post('/api/login', json={
        'username': 'testdoctor',
        'password': 'testpass'
    })
    return response.json['access_token']

# Test login endpoint
def test_login(client):
    response = client.post('/api/login', json={
        'username': 'testdoctor',
        'password': 'testpass'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

# Test create program endpoint
def test_create_program(client):
    token = get_jwt_token(client)
    response = client.post('/api/programs', json={
        'name': 'TB',
        'description': 'Tuberculosis Program'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201
    assert response.json['message'] == 'Program created'
    with app.app_context():
        assert HealthProgram.query.filter_by(name='TB').first() is not None

# Test register client endpoint
def test_register_client(client):
    token = get_jwt_token(client)
    response = client.post('/api/clients', json={
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'phone': '+1234567890',
        'date_of_birth': '1990-01-01'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201
    assert response.json['message'] == 'Client registered'
    with app.app_context():
        assert Client.query.filter_by(email='john.doe@example.com').first() is not None

# Test enroll client endpoint
def test_enroll_client(client):
    token = get_jwt_token(client)
    client.post('/api/programs', json={'name': 'HIV'}, headers={'Authorization': f'Bearer {token}'})
    client.post('/api/clients', json={
        'first_name': 'Jane',
        'last_name': 'Smith',
        'email': 'jane.smith@example.com'
    }, headers={'Authorization': f'Bearer {token}'})
    response = client.post('/api/clients/1/programs', json={'program_id': 1}, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert response.json['message'] == 'Client enrolled in program'
    with app.app_context():
        client_record = Client.query.get(1)
        assert len(client_record.programs) == 1
        assert client_record.programs[0].name == 'HIV'

# Test search clients endpoint
def test_search_clients(client):
    token = get_jwt_token(client)
    client.post('/api/clients', json={
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'email': 'alice.johnson@example.com'
    }, headers={'Authorization': f'Bearer {token}'})
    response = client.get('/api/clients/search?q=Alice', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['email'] == 'alice.johnson@example.com'

# Test get client profile endpoint
def test_get_client_profile(client):
    token = get_jwt_token(client)
    # Create a program
    client.post('/api/programs', json={
        'name': 'Malaria',
        'description': 'Malaria Prevention Program'
    }, headers={'Authorization': f'Bearer {token}'})
    # Register a client
    client.post('/api/clients', json={
        'first_name': 'Bob',
        'last_name': 'Brown',
        'email': 'bob.brown@example.com',
        'phone': '+9876543210',
        'date_of_birth': '1985-05-15'
    }, headers={'Authorization': f'Bearer {token}'})
    # Enroll client in program
    client.post('/api/clients/1/programs', json={'program_id': 1}, headers={'Authorization': f'Bearer {token}'})
    # Test client profile retrieval
    response = client.get('/api/clients/1', headers={'Authorization': f'Bearer {token}'})
    # Verify response
    assert response.status_code == 200
    assert response.json['email'] == 'bob.brown@example.com'
    assert response.json['first_name'] == 'Bob'
    assert response.json['last_name'] == 'Brown'
    assert response.json['phone'] == '+9876543210'
    assert response.json['date_of_birth'] == '1985-05-15'
    assert len(response.json['programs']) == 1
    assert response.json['programs'][0]['name'] == 'Malaria'
    # Test unauthorized access
    response = client.get('/api/clients/1')
    assert response.status_code == 401
    # Test non-existent client
    response = client.get('/api/clients/999', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 404