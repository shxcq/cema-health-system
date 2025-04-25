import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale } from 'chart.js';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import './App.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, BarElement, CategoryScale);

// Client Profile Component
const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && id) {
      axios.get(`http://localhost:5001/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setClient(response.data))
        .catch(() => setError('Failed to load client profile.'));
    }
  }, [id, token]);

  const handleUnenroll = async (programId: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/clients/${id}/programs/${programId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClient({
        ...client,
        programs: client.programs.filter((p: any) => p.id !== programId),
      });
      alert('Client unenrolled successfully!');
    } catch (err) {
      setError('Failed to unenroll client.');
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="chart-card client-profile-card">
        <Card.Body>
          <Card.Title>Client Profile</Card.Title>
          <div className="client-details">
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Name:</strong> {client.first_name} {client.last_name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {client.date_of_birth || 'N/A'}</p>
            <p><strong>Address:</strong> {client.address || 'N/A'}</p>
            <p><strong>Gender:</strong> {client.gender || 'N/A'}</p>
            <p><strong>Emergency Contact:</strong> {client.emergency_contact || 'N/A'}</p>
            <p><strong>Registered On:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
          </div>
          <h5>Enrolled Programs</h5>
          {client.programs.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Program ID</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(client.programs || []).map((program: any) => (
                  <tr key={program.id}>
                    <td>{program.id}</td>
                    <td>{program.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUnenroll(program.id)}
                      >
                        Unenroll
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No programs enrolled.</p>
          )}
          <Button as={Link as any} to="/dashboard" variant="outline-primary">Back to Dashboard</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Search Clients Component
const SearchClients: React.FC = () => {
  const [error, setError] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5001/api/clients/search?q=', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setClients(response.data || []))
        .catch(() => setError('Failed to fetch clients.'));
    }
  }, [token]);

  const handleSearchClients = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/clients/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to search clients.');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Search Clients</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchClients()}
            />
          </Form.Group>
          <Button variant="outline-primary" onClick={handleSearchClients}>Search</Button>
          <ul className="list-group mt-3">
            {clients.map((client) => (
              <li key={client.id} className="list-group-item d-flex justify-content-between align-items-center">
                {client.first_name} {client.last_name} ({client.email}) - ID: {client.id}
                <Button as={Link as any} to={`/client/${client.id}`} variant="link">
                  View Profile
                </Button>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Register Client Component
const RegisterClient: React.FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientData, setClientData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    gender: '',
    emergency_contact: '',
  });
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/clients', clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewClientId(response.data.id);
      setClientData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        gender: '',
        emergency_contact: '',
      });
      setSuccess('Client registered successfully!');
      setError('');
    } catch (err) {
      setError('Failed to register client.');
      setSuccess('');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Register Client</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              {success} New Client ID: {newClientId}
            </Alert>
          )}
          <Form onSubmit={handleRegisterClient}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={clientData.first_name}
                    onChange={(e) => setClientData({ ...clientData, first_name: e.target.value })}
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
                    onChange={(e) => setClientData({ ...clientData, last_name: e.target.value })}
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
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={clientData.phone}
                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={clientData.date_of_birth}
                onChange={(e) => setClientData({ ...clientData, date_of_birth: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={clientData.address}
                onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={clientData.gender}
                onChange={(e) => setClientData({ ...clientData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Contact</Form.Label>
              <Form.Control
                type="text"
                value={clientData.emergency_contact}
                onChange={(e) => setClientData({ ...clientData, emergency_contact: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Create Program Component
const CreateProgram: React.FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [programData, setProgramData] = useState({ name: '', description: '' });
  const [newProgramId, setNewProgramId] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/programs', programData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProgramId(response.data.id);
      setProgramData({ name: '', description: '' });
      setSuccess('Program created successfully!');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create program.');
      setSuccess('');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Create Program</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              {success} New Program ID: {newProgramId}
            </Alert>
          )}
          <Form onSubmit={handleCreateProgram}>
            <Form.Group className="mb-3">
              <Form.Label>Program Name</Form.Label>
              <Form.Control
                type="text"
                value={programData.name}
                onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={programData.description}
                onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Create</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Enroll Client Component
const EnrollClient: React.FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollData, setEnrollData] = useState({ client_id: '', program_id: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5001/api/clients/search?q=', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setClients(response.data || []))
        .catch(() => setError('Failed to fetch clients.'));

      axios.get('http://localhost:5001/api/programs', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setPrograms(response.data || []))
        .catch(() => setError('Failed to fetch programs.'));
    }
  }, [token]);

  const handleEnrollClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/clients/${enrollData.client_id}/programs`, { program_id: enrollData.program_id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollData({ client_id: '', program_id: '' });
      setSuccess('Client enrolled successfully!');
      setError('');
    } catch (err) {
      setError('Failed to enroll client.');
      setSuccess('');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="chart-card">
        <Card.Body>
          <Card.Title>Enroll Client in Program</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleEnrollClient}>
            <Form.Group className="mb-3">
              <Form.Label>Select Client</Form.Label>
              <Form.Select
                value={enrollData.client_id}
                onChange={(e) => setEnrollData({ ...enrollData, client_id: e.target.value })}
                required
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name} (ID: {client.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Program</Form.Label>
              <Form.Select
                value={enrollData.program_id}
                onChange={(e) => setEnrollData({ ...enrollData, program_id: e.target.value })}
                required
              >
                <option value="">Select a program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name} (ID: {program.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">Enroll</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Define props type for Dashboard component
interface DashboardProps {
  setToken: (token: string) => void;
}

// Main Dashboard Component
const Dashboard: React.FC<DashboardProps> = ({ setToken }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      Promise.all([
        axios.get('http://localhost:5001/api/clients/search?q=', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(response => setClients(response.data || []))
          .catch(() => setError('Failed to fetch clients.')),
        axios.get('http://localhost:5001/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(response => setPrograms(response.data || []))
          .catch(() => setError('Failed to fetch programs.')),
      ])
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Prepare data for Clients by Age Group
  const ageGroups = { '0-10': 0, '10-30': 0, '30-50': 0, 'Above 50': 0 };
  clients.forEach(client => {
    const age = calculateAge(client.date_of_birth);
    if (age <= 10) ageGroups['0-10'] += 1;
    else if (age <= 30) ageGroups['10-30'] += 1;
    else if (age <= 50) ageGroups['30-50'] += 1;
    else ageGroups['Above 50'] += 1;
  });

  const avgCostByAgeData = {
    labels: Object.keys(ageGroups),
    datasets: [{
      data: Object.values(ageGroups),
      backgroundColor: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'],
      borderWidth: 0,
    }],
  };

  // Prepare data for Clients Count by Date
  const clientsByDate: { [key: string]: number } = {};
  clients.forEach(client => {
    const createdAt = client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : 'Unknown';
    clientsByDate[createdAt] = (clientsByDate[createdAt] || 0) + 1;
  });

  const clientsByDateData = {
    labels: Object.keys(clientsByDate),
    datasets: [
      {
        label: 'Registered Clients',
        data: Object.values(clientsByDate),
        borderColor: '#4D96FF',
        backgroundColor: '#4D96FF',
        fill: false,
      },
    ],
  };

  // Prepare data for Clients Count by Program
  const clientsByProgram: { [key: string]: number } = {};
  programs.forEach(program => {
    clientsByProgram[program.name] = 0;
  });
  clients.forEach(client => {
    (client.programs || []).forEach((program: any) => {
      if (clientsByProgram[program.name] !== undefined) {
        clientsByProgram[program.name] += 1;
      }
    });
  });

  const clientsByProgramData = {
    labels: Object.keys(clientsByProgram),
    datasets: [
      {
        label: 'Enrolled Clients',
        data: Object.values(clientsByProgram),
        backgroundColor: '#4D96FF',
      },
    ],
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <i className="fas fa-user-md me-2"></i>
          <span>CEMA Health System</span>
        </div>
        <ul className="sidebar-menu">
          <li className={window.location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </Link>
          </li>
          <li className={window.location.pathname === '/search-clients' ? 'active' : ''}>
            <Link to="/search-clients">
              <i className="fas fa-search me-2"></i> Search Clients
            </Link>
          </li>
          <li className={window.location.pathname === '/register-client' ? 'active' : ''}>
            <Link to="/register-client">
              <i className="fas fa-user-plus me-2"></i> Register Client
            </Link>
          </li>
          <li className={window.location.pathname === '/create-program' ? 'active' : ''}>
            <Link to="/create-program">
              <i className="fas fa-list me-2"></i> Create Program
            </Link>
          </li>
          <li className={window.location.pathname === '/enroll-client' ? 'active' : ''}>
            <Link to="/enroll-client">
              <i className="fas fa-link me-2"></i> Enroll Client
            </Link>
          </li>
          <li onClick={() => { setToken(''); localStorage.removeItem('token'); navigate('/'); }}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Hospital Management Dashboard</h1>
          <div className="header-right">
            <Form.Select size="sm" className="me-2">
              <option>Hospital 1</option>
            </Form.Select>
            <Form.Select size="sm" className="me-2">
              <option>ALL</option>
            </Form.Select>
            <Form.Select size="sm" className="me-2">
              <option>ALL</option>
            </Form.Select>
            <Form.Control size="sm" type="date" defaultValue="2023-02-26" className="me-2" style={{ width: 'auto' }} />
            <i className="fas fa-calendar-alt"></i>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Key Metrics */}
        <Row className="metrics-row">
          <Col md={3}>
            <Card className="metric-card">
              <Card.Body>
                <Card.Title>Doctors</Card.Title>
                <h2>1</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card">
              <Card.Body>
                <Card.Title>Clients</Card.Title>
                <h2>{clients.length}</h2>
                <div className="sub-metrics">
                  <span>F: {Math.floor(clients.length / 2)}</span>
                  <span>M: {Math.ceil(clients.length / 2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card">
              <Card.Body>
                <Card.Title>Avg. Length of Stay</Card.Title>
                <h2>N/A</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="metric-card">
              <Card.Body>
                <Card.Title>Admitted Clients</Card.Title>
                <h2>{clients.length}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row>
          <Col md={6}>
            <Card className="chart-card">
              <Card.Body>
                <Card.Title>Clients by Age Group</Card.Title>
                <div style={{ height: '250px' }}>
                  <Doughnut data={avgCostByAgeData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="chart-card">
              <Card.Body>
                <Card.Title>Clients Count by Registration Date</Card.Title>
                <div style={{ height: '250px' }}>
                  <Line data={clientsByDateData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card className="chart-card">
              <Card.Body>
                <Card.Title>Upcoming Appointments</Card.Title>
                <p>No upcoming appointments scheduled.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="chart-card">
              <Card.Body>
                <Card.Title>Clients Count by Program</Card.Title>
                <div style={{ height: '250px' }}>
                  <Bar data={clientsByProgramData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', { username, password });
      setToken(response.data.access_token);
      localStorage.setItem('token', response.data.access_token);
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route
            path="/"
            element={
              !token ? (
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
                <Dashboard setToken={setToken} />
              )
            }
          />
          <Route path="/dashboard" element={<Dashboard setToken={setToken} />} />
          <Route path="/search-clients" element={<SearchClients />} />
          <Route path="/register-client" element={<RegisterClient />} />
          <Route path="/create-program" element={<CreateProgram />} />
          <Route path="/enroll-client" element={<EnrollClient />} />
          <Route path="/client/:id" element={<ClientProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;