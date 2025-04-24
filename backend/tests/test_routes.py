import pytest
from app import app, db
from models import User, Client, Program

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            user = User(username='doctor', password='password')
            db.session.add(user)
            db.session.commit()
        yield client
        with app.app_context():
            db.drop_all()

def test_login_success(client):
    response = client.post('/api/login', json={'username': 'doctor', 'password': 'password'})
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_login_failure(client):
    response = client.post('/api/login', json={'username': 'wrong', 'password': 'wrong'})
    assert response.status_code == 401
    assert response.json['error'] == 'Invalid credentials'

def test_register_client(client):
    login_response = client.post('/api/login', json={'username': 'doctor', 'password': 'password'})
    token = login_response.json['access_token']
    response = client.post('/api/clients', json={
        'first_name': 'Bob',
        'last_name': 'Brown',
        'email': 'bob.brown@example.com'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201
    assert response.json['message'] == 'Client registered'

def test_search_clients(client):
    login_response = client.post('/api/login', json={'username': 'doctor', 'password': 'password'})
    token = login_response.json['access_token']
    client.post('/api/clients', json={
        'first_name': 'Bob',
        'last_name': 'Brown',
        'email': 'bob.brown@example.com'
    }, headers={'Authorization': f'Bearer {token}'})
    response = client.get('/api/clients/search?q=Bob', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['first_name'] == 'Bob'