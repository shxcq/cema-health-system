import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Navbar,
  Nav,
  Alert,
} from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [clientData, setClientData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [programData, setProgramData] = useState({ name: '', description: '' });
  const [enrollData, setEnrollData] = useState({
    client_id: '',
    program_id: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        username,
        password,
      });
      setToken(response.data.access_token);
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/clients', clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
      });
      alert('Client registered successfully!');
    } catch (err) {
      setError('Failed to register client.');
    }
  };

  const handleSearchClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/clients/search?q=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClients(response.data);
    } catch (err) {
      setError('Failed to search clients.');
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/programs', programData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgramData({ name: '', description: '' });
      alert('Program created successfully!');
    } catch (err) {
      setError('Failed to create program.');
    }
  };

  const handleEnrollClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5001/api/clients/${enrollData.client_id}/programs`,
        { program_id: enrollData.program_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrollData({ client_id: '', program_id: '' });
      alert('Client enrolled successfully!');
    } catch (err) {
      setError('Failed to enroll client.');
    }
  };

  return (
    <div className="app-wrapper">
      {!token ? (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <LoginForm
            username={username}
            password={password}
            error={error}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Container>
      ) : (
        <>
          <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
              <Navbar.Brand>
                <i className="fas fa-user-md me-2"></i>CEMA Health System
              </Navbar.Brand>
              <Nav className="ms-auto">
                <Nav.Link onClick={() => setToken('')}>
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <Container>
            <Row>
              <Col md={3}>
                <Card className="shadow-sm mb-4">
                  <Card.Body>
                    <Nav className="flex-column">
                      <Nav.Link href="#search">
                        <i className="fas fa-search me-2"></i>Search Clients
                      </Nav.Link>
                      <Nav.Link href="#register">
                        <i className="fas fa-user-plus me-2"></i>Register Client
                      </Nav.Link>
                      <Nav.Link href="#programs">
                        <i className="fas fa-list me-2"></i>Create Program
                      </Nav.Link>
                      <Nav.Link href="#enroll">
                        <i className="fas fa-link me-2"></i>Enroll Client
                      </Nav.Link>
                    </Nav>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={9}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Card className="shadow-sm mb-4" id="search">
                  <Card.Body>
                    <Card.Title>
                      <i className="fas fa-search me-2"></i>Search Clients
                    </Card.Title>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleSearchClients()
                        }
                      />
                    </Form.Group>
                    <Button
                      variant="outline-primary"
                      onClick={handleSearchClients}
                    >
                      Search
                    </Button>
                    <ul className="list-group mt-3">
                      {clients.map((client: any) => (
                        <li key={client.id} className="list-group-item">
                          {client.first_name} {client.last_name} ({client.email}
                          )
                          <Button
                            variant="link"
                            onClick={() =>
                              (window.location.href = `/client/${client.id}`)
                            }
                          >
                            View Profile
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
                <Card className="shadow-sm mb-4" id="register">
                  <Card.Body>
                    <Card.Title>
                      <i className="fas fa-user-plus me-2"></i>Register Client
                    </Card.Title>
                    <Form onSubmit={handleRegisterClient}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={clientData.first_name}
                              onChange={(e) =>
                                setClientData({
                                  ...clientData,
                                  first_name: e.target.value,
                                })
                              }
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={clientData.last_name}
                              onChange={(e) =>
                                setClientData({
                                  ...clientData,
                                  last_name: e.target.value,
                                })
                              }
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={clientData.email}
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={clientData.phone}
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          value={clientData.date_of_birth}
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              date_of_birth: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-hover"
                      >
                        Register
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className="shadow-sm mb-4" id="programs">
                  <Card.Body>
                    <Card.Title>
                      <i className="fas fa-list me-2"></i>Create Program
                    </Card.Title>
                    <Form onSubmit={handleCreateProgram}>
                      <Form.Group className="mb-3">
                        <Form.Label>Program Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={programData.name}
                          onChange={(e) =>
                            setProgramData({
                              ...programData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={programData.description}
                          onChange={(e) =>
                            setProgramData({
                              ...programData,
                              description: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-hover"
                      >
                        Create
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className="shadow-sm" id="enroll">
                  <Card.Body>
                    <Card.Title>
                      <i className="fas fa-link me-2"></i>Enroll Client in
                      Program
                    </Card.Title>
                    <Form onSubmit={handleEnrollClient}>
                      <Form.Group className="mb-3">
                        <Form.Label>Client ID</Form.Label>
                        <Form.Control
                          type="number"
                          value={enrollData.client_id}
                          onChange={(e) =>
                            setEnrollData({
                              ...enrollData,
                              client_id: e.target.value,
                            })
                          }
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Program ID</Form.Label>
                        <Form.Control
                          type="number"
                          value={enrollData.program_id}
                          onChange={(e) =>
                            setEnrollData({
                              ...enrollData,
                              program_id: e.target.value,
                            })
                          }
                          required
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-hover"
                      >
                        Enroll
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default App;
